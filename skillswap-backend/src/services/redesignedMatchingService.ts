import { firestore } from '../config/firebase';
import { logger } from '../utils/logger';

interface MatchScore {
  uid: string;
  name: string;
  avatar_url?: string;
  skillsOffered: string[];
  badgeScore: number;
  availability: any[];
  calendarSynced?: boolean;
  matchScore: number;
  skillMatchPoints: number;
  availabilityPoints: number;
}

export class RedesignedMatchingService {
  private static readonly WEIGHTS = {
    SKILL_MATCH: 5,
    AVAILABILITY: 2
  };

  static async findMatches(uid: string, excludeUids: string[] = [], limit: number = 10): Promise<MatchScore[]> {
    try {
      const currentUserDoc = await firestore.collection('users').doc(uid).get();
      if (!currentUserDoc.exists) {
        throw new Error('User not found');
      }

      const currentUser = currentUserDoc.data()!;
      const skillsWanted = currentUser.skills_wanted || [];

      logger.info(`🎯 Finding matches for user ${uid} who wants to learn: ${skillsWanted.join(', ')}`);

      const potentialMentors = await firestore
        .collection('users')
        .where('uid', '!=', uid)
        .get();

      const matchScores: MatchScore[] = [];

      potentialMentors.forEach(doc => {
        const mentor = doc.data();
        
        if (excludeUids.includes(mentor.uid)) {
          return;
        }

        if (!mentor.skills_offered || mentor.skills_offered.length === 0) {
          return;
        }

        const matchScore = this.calculateMatchScore(currentUser, mentor);
        
        if (matchScore.matchScore > 0) {
          matchScores.push(matchScore);
        }
      });

      matchScores.sort((a, b) => b.matchScore - a.matchScore);

      logger.info(`✅ Computed ${matchScores.length} matches for user: ${uid}`);
      return matchScores.slice(0, limit);

    } catch (error) {
      logger.error(`❌ Redesigned matching failed for user ${uid}:`, error);
      throw error;
    }
  }

  private static calculateMatchScore(learner: any, mentor: any): MatchScore {
    let totalScore = 0;
    let skillMatchPoints = 0;
    let availabilityPoints = 0;

    // 1. SKILL MATCH (+5 points)
    const skillsWanted = learner.skills_wanted || [];
    const skillsOffered = mentor.skills_offered || [];
    
    const matchingSkills = skillsWanted.filter((skill: string) =>
      skillsOffered.some((offered: string) =>
        offered.toLowerCase() === skill.toLowerCase()
      )
    );

    if (matchingSkills.length > 0) {
      skillMatchPoints = this.WEIGHTS.SKILL_MATCH;
      totalScore += skillMatchPoints;
    }

    // 2. BADGE SCORE (badgeScore * 3 / 5)
    const badgeScore = mentor.badge_score || 0;
    const badgeContribution = (badgeScore * 3) / 5;
    totalScore += badgeContribution;

  // In calculateMatchScore method, update availability section:
  // 3. AVAILABILITY (with session-aware checking)
  if (learner.calendar_synced && mentor.calendar_synced) {
    const learnerSlots = learner.available_slots || [];
    const mentorSlots = mentor.available_slots || [];
    
    const hasOverlap = learnerSlots.some((slot: string) => mentorSlots.includes(slot));
    if (hasOverlap) {
      availabilityPoints = this.WEIGHTS.AVAILABILITY;
      totalScore += availabilityPoints;
    }
  } else {
    // Handle manual availability with new format
    const learnerAvailability = learner.availability || { days: [], times: [] };
    const mentorAvailability = mentor.availability || { days: [], times: [] };
    
    const learnerDays = learnerAvailability.days || [];
    const mentorDays = mentorAvailability.days || [];
    const learnerTimes = learnerAvailability.times || [];
    const mentorTimes = mentorAvailability.times || [];

    // Check for day overlap (3-letter format)
    const commonDays = learnerDays.filter((day: string) => mentorDays.includes(day));
    
    // Check for time range overlap
    const hasTimeOverlap = this.checkTimeRangeOverlap(learnerTimes, mentorTimes);

    if (commonDays.length > 0 && hasTimeOverlap) {
      availabilityPoints = this.WEIGHTS.AVAILABILITY;
      totalScore += availabilityPoints;
    }
  }

    return {
    uid: mentor.uid,
    name: mentor.name,
    avatar_url: mentor.avatar_url,
    skillsOffered: mentor.skills_offered,
    badgeScore: badgeScore,
    // Always return availability, even if empty
    availability: mentor.available_slots || mentor.availability || { days: [], times: [] },
    calendarSynced: mentor.calendar_synced || false,
    matchScore: Math.round(totalScore * 10) / 10,
    skillMatchPoints,
    availabilityPoints
  };
  }

private static checkTimeRangeOverlap(ranges1: string[], ranges2: string[]): boolean {
  for (const range1 of ranges1) {
    for (const range2 of ranges2) {
      if (this.doTimeRangesOverlap(range1, range2)) {
        return true;
      }
    }
  }
  return false;
}

// 🔥 NEW: Check if two time ranges overlap
private static doTimeRangesOverlap(range1: string, range2: string): boolean {
  try {
    const [start1, end1] = range1.split('-').map(time => {
      const [hour, min] = time.split(':').map(Number);
      return hour * 60 + min; // Convert to minutes
    });
    
    const [start2, end2] = range2.split('-').map(time => {
      const [hour, min] = time.split(':').map(Number);
      return hour * 60 + min; // Convert to minutes
    });
    
    // Check if ranges overlap
    return start1 < end2 && start2 < end1;
  } catch (error) {
    console.error('Error parsing time ranges:', error);
    return false;
  }
}

  static async storeDenial(learnerUid: string, mentorUid: string): Promise<void> {
    try {
      const denialRef = firestore
        .collection('users')
        .doc(learnerUid)
        .collection('denials')
        .doc(mentorUid);

      await denialRef.set({
        mentorUid,
        deniedAt: new Date(),
        reason: 'user_rejection'
      });

      logger.info(`📝 Stored denial: ${learnerUid} rejected ${mentorUid}`);
    } catch (error) {
      logger.error('❌ Failed to store denial:', error);
    }
  }

  static async getDeniedMentors(learnerUid: string): Promise<string[]> {
    try {
      const denialsSnapshot = await firestore
        .collection('users')
        .doc(learnerUid)
        .collection('denials')
        .get();

      const deniedUids = denialsSnapshot.docs.map(doc => doc.data().mentorUid);
      return deniedUids;
    } catch (error) {
      logger.error('❌ Failed to get denied mentors:', error);
      return [];
    }
  }

  static async getMentorProfile(mentorUid: string): Promise<any> {
    try {
      const mentorDoc = await firestore.collection('users').doc(mentorUid).get();
      
      if (!mentorDoc.exists) {
        throw new Error('Mentor not found');
      }

      const mentor = mentorDoc.data()!;
      
      return {
        uid: mentor.uid,
        name: mentor.name,
        avatar_url: mentor.avatar_url,
        skillsOffered: mentor.skills_offered,
        badgeScore: mentor.badge_score || 0,
        availability: mentor.available_slots || mentor.availability,
        calendarSynced: mentor.calendar_synced || false
      };
    } catch (error) {
      logger.error(`❌ Failed to get mentor profile ${mentorUid}:`, error);
      throw error;
    }
  }
}