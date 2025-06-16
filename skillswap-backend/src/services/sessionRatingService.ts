import { firestore } from '../config/firebase';
import { logger } from '../utils/logger';
import { FieldValue } from 'firebase-admin/firestore';

export class SessionRatingService {
  static async rateSession(sessionId: string, raterUid: string, mentorUid: string, rating: number): Promise<void> {
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    try {
      await firestore.runTransaction(async (transaction) => {
        const mentorRef = firestore.collection('users').doc(mentorUid);
        const mentorDoc = await transaction.get(mentorRef);
        
        if (!mentorDoc.exists) {
          throw new Error('Mentor not found');
        }

        const mentorData = mentorDoc.data()!;
        
        const currentBadgeCount = mentorData.badge_count || 0;
        const currentTotalPoints = mentorData.total_badge_points || 0;
        
        const newBadgeCount = currentBadgeCount + 1;
        const newTotalPoints = currentTotalPoints + rating;
        const newBadgeScore = newTotalPoints / newBadgeCount;

        transaction.update(mentorRef, {
          badge_score: Math.round(newBadgeScore * 100) / 100,
          badge_count: newBadgeCount,
          total_badge_points: newTotalPoints,
          updated_at: FieldValue.serverTimestamp()
        });

        const ratingRef = firestore.collection('session_ratings').doc();
        transaction.set(ratingRef, {
          session_id: sessionId,
          rater_uid: raterUid,
          mentor_uid: mentorUid,
          rating: rating,
          created_at: FieldValue.serverTimestamp()
        });

        logger.info(`✅ Session rated: ${rating}/5 for mentor ${mentorUid}, new average: ${newBadgeScore.toFixed(2)}`);
      });
    } catch (error) {
      logger.error('❌ Failed to rate session:', error);
      throw error;
    }
  }
}
