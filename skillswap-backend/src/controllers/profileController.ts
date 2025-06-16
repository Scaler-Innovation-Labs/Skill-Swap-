import { Request, Response, NextFunction } from 'express';
import { firestore } from '../config/firebase';
import { logger } from '../utils/logger';
import { AppError } from '../utils/errors';
import { UpdateProfileRequest } from '../types';
import { FieldValue } from 'firebase-admin/firestore';
import { CalendarService } from '../services/calendarService';
import { SessionRatingService } from '../services/sessionRatingService';
import { SessionBookingService } from '../services/sessionBookingService';

export class ProfileController {
  // Get current user's profile
  static async getMyProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const uid = req.user!.uid;

      // Get user from Firestore
      const userDoc = await firestore.collection('users').doc(uid).get();
      
      if (!userDoc.exists) {
        throw new AppError('User not found', 404);
      }

      const userData = userDoc.data()!;

      logger.info(`📖 Profile retrieved: ${uid}`);

      res.status(200).json({
        success: true,
        data: {
          user: userData
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get another user's public profile
  static async getUserProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { uid } = req.params;

      // Get user from Firestore
      const userDoc = await firestore.collection('users').doc(uid).get();
      
      if (!userDoc.exists) {
        throw new AppError('User not found', 404);
      }

      const userData = userDoc.data()!;

      // Return only public information
      const publicProfile = {
        uid: userData.uid,
        name: userData.name,
        avatar_url: userData.avatar_url,
        role: userData.role,
        skills_offered: userData.skills_offered,
        badge_count: userData.badge_count,
        availability: userData.availability
      };

      logger.info(`📖 Public profile retrieved: ${uid}`);

      res.status(200).json({
        success: true,
        data: {
          user: publicProfile
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Update user profile
  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const uid = req.user!.uid;
      const updateData: UpdateProfileRequest = req.body;

      // Validate that at least one field is being updated
      if (Object.keys(updateData).length === 0) {
        throw new AppError('At least one field must be provided for update', 400);
      }

      // Get current user data first
      const userDoc = await firestore.collection('users').doc(uid).get();
      if (!userDoc.exists) {
        throw new AppError('User not found', 404);
      }

      const currentData = userDoc.data()!;

      // Prepare update data with timestamp
      const dataToUpdate = {
        ...updateData,
        updated_at: FieldValue.serverTimestamp()
      };

      // Update user in Firestore
      await firestore.collection('users').doc(uid).update(dataToUpdate);

      // Update skill popularity if skills_offered changed
      if (updateData.skills_offered) {
        const batch = firestore.batch();
        
        // Get previous skills to decrement their count
        const previousSkills = currentData.skills_offered || [];
        const newSkills = updateData.skills_offered;

        // Decrement count for removed skills
        for (const skill of previousSkills) {
          if (!newSkills.includes(skill)) {
            const skillRef = firestore.collection('skill_popularity').doc(skill.toLowerCase());
            batch.update(skillRef, {
              count: FieldValue.increment(-1),
              updated_at: FieldValue.serverTimestamp()
            });
          }
        }

        // Increment count for new skills
        for (const skill of newSkills) {
          if (!previousSkills.includes(skill)) {
            const skillRef = firestore.collection('skill_popularity').doc(skill.toLowerCase());
            batch.set(skillRef, {
              name: skill,
              count: FieldValue.increment(1),
              updated_at: FieldValue.serverTimestamp()
            }, { merge: true });
          }
        }

        await batch.commit();
      }

      // Clear user's cached matches since profile changed
      const cachedMatches = await firestore
        .collection('users')
        .doc(uid)
        .collection('cached_matches')
        .get();

      if (!cachedMatches.empty) {
        const batch = firestore.batch();
        cachedMatches.forEach(doc => {
          batch.delete(doc.ref);
        });
        await batch.commit();
      }

      // Get updated user data
      const updatedUserDoc = await firestore.collection('users').doc(uid).get();
      const updatedUser = updatedUserDoc.data()!;

      logger.info(`✅ Profile updated: ${uid}`);

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          user: updatedUser
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get user statistics (for admin or analytics)
  static async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      // Check if user has admin role
      if (req.user!.role !== 'admin') {
        throw new AppError('Access denied. Admin role required.', 403);
      }

      // Get user collection statistics
      const usersSnapshot = await firestore.collection('users').get();
      const totalUsers = usersSnapshot.size;

      // Count users by role
      const roleStats: { [key: string]: number } = {};
      const skillStats: { [key: string]: number } = {};

      usersSnapshot.forEach(doc => {
        const userData = doc.data();
        
        // Count by role
        const role = userData.role || 'unknown';
        roleStats[role] = (roleStats[role] || 0) + 1;

        // Count skills
        const skills = [...(userData.skills_offered || []), ...(userData.skills_wanted || [])];
        skills.forEach(skill => {
          skillStats[skill] = (skillStats[skill] || 0) + 1;
        });
      });

      // Get popular skills from skill_popularity collection
      const popularSkillsSnapshot = await firestore
        .collection('skill_popularity')
        .orderBy('count', 'desc')
        .limit(10)
        .get();

      const popularSkills = popularSkillsSnapshot.docs.map(doc => ({
        name: doc.data().name,
        count: doc.data().count
      }));

      const stats = {
        total_users: totalUsers,
        users_by_role: roleStats,
        popular_skills: popularSkills,
        total_unique_skills: Object.keys(skillStats).length
      };

      res.status(200).json({
        success: true,
        data: {
          stats
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete user profile
  static async deleteProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const uid = req.user!.uid;
      const targetUid = req.params.uid || uid;

      // Only allow users to delete their own profile or admins to delete any
      if (targetUid !== uid && req.user!.role !== 'admin') {
        throw new AppError('You can only delete your own profile', 403);
      }

      // Check if user exists
      const userDoc = await firestore.collection('users').doc(targetUid).get();
      if (!userDoc.exists) {
        throw new AppError('User not found', 404);
      }

      const userData = userDoc.data()!;

      // Create a batch for all deletions
      const batch = firestore.batch();

      // Delete user document
      batch.delete(firestore.collection('users').doc(targetUid));

      // Delete cached matches subcollection
      const cachedMatches = await firestore
        .collection('users')
        .doc(targetUid)
        .collection('cached_matches')
        .get();

      cachedMatches.forEach(doc => {
        batch.delete(doc.ref);
      });

      // Update skill popularity (decrement for user's offered skills)
      if (userData.skills_offered && userData.skills_offered.length > 0) {
        for (const skill of userData.skills_offered) {
          const skillRef = firestore.collection('skill_popularity').doc(skill.toLowerCase());
          batch.update(skillRef, {
            count: FieldValue.increment(-1),
            updated_at: FieldValue.serverTimestamp()
          });
        }
      }

      await batch.commit();

      logger.info(`✅ Profile deleted: ${targetUid}`);

      res.status(200).json({
        success: true,
        message: 'Profile deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Update badge count (internal use or achievement system)
  static async updateBadges(req: Request, res: Response, next: NextFunction) {
    try {
      const uid = req.user!.uid;
      const { increment = 1 } = req.body;

      // Update badge count in Firestore
      await firestore.collection('users').doc(uid).update({
        badge_count: FieldValue.increment(increment),
        updated_at: FieldValue.serverTimestamp()
      });

      // Get updated user data
      const userDoc = await firestore.collection('users').doc(uid).get();
      const userData = userDoc.data();

      logger.info(`🏆 Badge count updated for ${uid}: +${increment}`);

      res.status(200).json({
        success: true,
        message: 'Badge count updated successfully',
        data: {
          new_badge_count: userData?.badge_count || 0
        }
      });
    } catch (error) {
      next(error);
    }
  }

 static async storeCalendarToken(req: Request, res: Response, next: NextFunction) {
  try {
    const uid = req.user!.uid;
    const { accessToken } = req.body;

    if (!accessToken) {
      throw new AppError('Access token is required', 400);
    }

    await firestore.collection('users').doc(uid).update({
      calendar_access_token: accessToken,
      calendar_connected: true,
      updated_at: FieldValue.serverTimestamp()
    });

    logger.info(`✅ Calendar token stored for user: ${uid}`);

    res.status(200).json({
      success: true,
      message: 'Calendar connected successfully'
    });
  } catch (error) {
    next(error);
  }
}

// 🔥 UPDATED: Calendar sync method
static async syncCalendarAvailability(req: Request, res: Response, next: NextFunction) {
  try {
    const { uid } = req.user!;
    const { accessToken } = req.body;

    if (!accessToken) {
      throw new AppError('Google Calendar access token is required', 400);
    }

    // Get user's current availability preferences
    const userDoc = await firestore.collection('users').doc(uid).get();
    if (!userDoc.exists) {
      throw new AppError('User not found', 404);
    }

    const userData = userDoc.data()!;
    
    // 🔥 UPDATED: Handle new availability format
    let userAvailability = userData.availability;
    
    if (!userAvailability || typeof userAvailability !== 'object') {
      userAvailability = { days: [], times: [] };
      console.log(`⚠️ User ${uid} has no manual availability set, using defaults`);
    } else {
      // Ensure days and times arrays exist
      if (!userAvailability.days || !Array.isArray(userAvailability.days)) {
        userAvailability.days = [];
      }
      if (!userAvailability.times || !Array.isArray(userAvailability.times)) {
        userAvailability.times = [];
      }
    }

    // Validate day format (should be 3-letter abbreviations)
    const validDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    userAvailability.days = userAvailability.days.filter((day: string) => validDays.includes(day));

    // Validate time format (should be ranges like "09:00-12:00")
    const timeRangeRegex = /^\d{2}:\d{2}-\d{2}:\d{2}$/;
    userAvailability.times = userAvailability.times.filter((time: string) => timeRangeRegex.test(time));

    console.log(`📋 User ${uid} validated availability:`, userAvailability);

    const busyTimes = await CalendarService.getUserAvailability(accessToken);
    const availableSlots = await CalendarService.generateAvailableSlots(busyTimes, userAvailability, uid);
    
    await firestore.collection('users').doc(uid).update({
      calendar_synced: true,
      calendar_busy_times: busyTimes,
      available_slots: availableSlots,
      calendar_last_sync: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp()
    });

    logger.info(`✅ Calendar synced for user: ${uid}, generated ${availableSlots.length} available slots`);

    res.status(200).json({
      success: true,
      message: 'Calendar availability synced successfully',
      data: {
        available_slots: availableSlots,
        busy_times_count: busyTimes.length,
        user_availability: userAvailability,
        slots_generated: availableSlots.length
      }
    });
  } catch (error) {
    next(error);
  }
}

// 🔥 UPDATED: 2-way session booking
static async bookTwoWaySession(req: Request, res: Response, next: NextFunction) {
  try {
    const { uid: organizerUid } = req.user!;
    const { 
      organizerAccessToken, 
      participantAccessToken,
      participantUid,
      summary, 
      startTime, 
      endTime, 
      skillTopic, 
      sessionType, 
      description 
    } = req.body;

    // Validation
    if (!organizerAccessToken || !participantAccessToken || !participantUid || !summary || !startTime || !endTime || !skillTopic) {
      throw new AppError('Missing required fields: organizerAccessToken, participantAccessToken, participantUid, summary, startTime, endTime, skillTopic', 400);
    }

    // Validate time format
    const startDateTime = new Date(startTime);
    const endDateTime = new Date(endTime);
    
    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
      throw new AppError('Invalid date format. Use ISO format like: 2025-06-12T10:00:00+05:30', 400);
    }

    if (startDateTime >= endDateTime) {
      throw new AppError('Start time must be before end time', 400);
    }

    // Get both users' emails
    const [organizerDoc, participantDoc] = await Promise.all([
      firestore.collection('users').doc(organizerUid).get(),
      firestore.collection('users').doc(participantUid).get()
    ]);

    if (!organizerDoc.exists || !participantDoc.exists) {
      throw new AppError('One or both users not found', 404);
    }

    const organizerEmail = organizerDoc.data()!.email;
    const participantEmail = participantDoc.data()!.email;

    // Create calendar events for both users
    const { organizerEvent, participantEvent } = await CalendarService.createTwoWaySessionEvent(
      organizerAccessToken,
      participantAccessToken,
      {
        summary,
        startTime,
        endTime,
        organizerEmail,
        participantEmail,
        description: description || `SkillSwap Session: ${skillTopic}`
      }
    );

    // Book session in database
    const sessionId = await SessionBookingService.bookTwoWaySession({
      organizerUid,
      participantUid,
      startTime,
      endTime,
      skillTopic,
      sessionType: sessionType || 'learning',
      organizerEventId: organizerEvent.id,
      participantEventId: participantEvent.id
    });

    logger.info(`✅ 2-way session booked for users ${organizerUid} & ${participantUid}`);

    res.status(200).json({
      success: true,
      message: 'Session booked for both users and added to calendars',
      data: {
        sessionId,
        organizer: {
          eventId: organizerEvent.id,
          eventLink: organizerEvent.htmlLink,
          hangoutLink: organizerEvent.hangoutLink
        },
        participant: {
          eventId: participantEvent.id,
          eventLink: participantEvent.htmlLink,
          hangoutLink: participantEvent.hangoutLink
        },
        summary,
        startTime,
        endTime,
        skillTopic
      }
    });
  } catch (error) {
    logger.error('❌ Failed to book 2-way session:', error);
    next(error);
  }
}




static async rateSession(req: Request, res: Response, next: NextFunction) {
  try {
    const raterUid = req.user!.uid;
    const { sessionId, mentorUid, rating } = req.body;

    if (!sessionId || !mentorUid || !rating) {
      throw new AppError('Session ID, mentor UID, and rating are required', 400);
    }

    if (rating < 1 || rating > 5) {
      throw new AppError('Rating must be between 1 and 5', 400);
    }

    await SessionRatingService.rateSession(sessionId, raterUid, mentorUid, rating);

    const mentorDoc = await firestore.collection('users').doc(mentorUid).get();
    const mentorData = mentorDoc.data()!;

    logger.info(`✅ Session rated by ${raterUid}: ${rating}/5 for mentor ${mentorUid}`);

    res.status(200).json({
      success: true,
      message: 'Session rated successfully',
      data: {
        mentor_new_badge_score: mentorData.badge_score,
        mentor_total_ratings: mentorData.badge_count
      }
    });
  } catch (error) {
    next(error);
  }
}

// static async bookSession(req: Request, res: Response, next: NextFunction) {
//   try {
//     const uid = req.user!.uid;
//     const { accessToken, summary, startTime, endTime, attendeeEmail, description } = req.body;

//     // Validation
//     if (!accessToken || !summary || !startTime || !endTime || !attendeeEmail) {
//       throw new AppError('Missing required fields: accessToken, summary, startTime, endTime, attendeeEmail', 400);
//     }

//     // Validate time format
//     const startDateTime = new Date(startTime);
//     const endDateTime = new Date(endTime);
    
//     if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
//       throw new AppError('Invalid date format. Use ISO format like: 2025-06-12T10:00:00+05:30', 400);
//     }

//     if (startDateTime >= endDateTime) {
//       throw new AppError('Start time must be before end time', 400);
//     }

//     // Create calendar event
//     const event = await CalendarService.createSessionEvent(accessToken, {
//       summary,
//       startTime,
//       endTime,
//       attendeeEmail,
//       description: description || 'SkillSwap Learning Session'
//     });

//     // Store session record in Firestore
//     const sessionRef = firestore.collection('sessions').doc();
//     await sessionRef.set({
//       id: sessionRef.id,
//       organizer_uid: uid,
//       attendee_email: attendeeEmail,
//       summary,
//       start_time: startDateTime,
//       end_time: endDateTime,
//       google_event_id: event.id,
//       google_event_link: event.htmlLink,
//       hangout_link: event.hangoutLink || null,
//       status: 'scheduled',
//       created_at: FieldValue.serverTimestamp()
//     });

//     logger.info(`✅ Session booked for user ${uid} with event ID: ${event.id}`);

//     res.status(200).json({
//       success: true,
//       message: 'Session booked and added to calendar',
//       data: {
//         sessionId: sessionRef.id,
//         eventId: event.id,
//         eventLink: event.htmlLink,
//         hangoutLink: event.hangoutLink || null,
//         summary: event.summary,
//         startTime: event.start?.dateTime,
//         endTime: event.end?.dateTime,
//         attendeeEmail: attendeeEmail
//       }
//     });
//   } catch (error) {
//     logger.error(`❌ Failed to book session for user:`, error);
//     next(error);
//   }
// }

}