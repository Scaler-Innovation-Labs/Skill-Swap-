import { firestore } from '../config/firebase';
import { logger } from '../utils/logger';
import { FieldValue } from 'firebase-admin/firestore';

export class SessionBookingService {
  // Get all booked sessions for a user
  static async getUserBookedSessions(uid: string): Promise<any[]> {
    try {
      const sessionsSnapshot = await firestore
        .collection('sessions')
        .where('participants', 'array-contains', uid)
        .where('status', '==', 'confirmed')
        .get();

      const bookedSessions = sessionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      logger.info(`📅 Retrieved ${bookedSessions.length} booked sessions for user: ${uid}`);
      return bookedSessions;
    } catch (error) {
      logger.error(`❌ Failed to get booked sessions for ${uid}:`, error);
      return [];
    }
  }

  // 🔥 UPDATED: 2-way session booking
  static async bookTwoWaySession(sessionData: {
    organizerUid: string;
    participantUid: string;
    startTime: string;
    endTime: string;
    skillTopic: string;
    sessionType: 'learning' | 'teaching';
    organizerEventId?: string;
    participantEventId?: string;
  }): Promise<string> {
    try {
      const sessionRef = firestore.collection('sessions').doc();
      
      await sessionRef.set({
        id: sessionRef.id,
        organizer_uid: sessionData.organizerUid,
        participant_uid: sessionData.participantUid,
        participants: [sessionData.organizerUid, sessionData.participantUid],
        start_time: new Date(sessionData.startTime),
        end_time: new Date(sessionData.endTime),
        skill_topic: sessionData.skillTopic,
        session_type: sessionData.sessionType,
        status: 'confirmed',
        organizer_event_id: sessionData.organizerEventId || null,
        participant_event_id: sessionData.participantEventId || null,
        created_at: FieldValue.serverTimestamp(),
        updated_at: FieldValue.serverTimestamp()
      });

      logger.info(`✅ 2-way session booked: ${sessionRef.id}`);
      return sessionRef.id;
    } catch (error) {
      logger.error('❌ Failed to book 2-way session:', error);
      throw error;
    }
  }
}
