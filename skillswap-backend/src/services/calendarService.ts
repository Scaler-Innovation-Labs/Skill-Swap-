import { google } from 'googleapis';
import { logger } from '../utils/logger';
import { SessionBookingService } from './sessionBookingService';

export class CalendarService {
  private static oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  static async getUserAvailability(accessToken: string, days: number = 7): Promise<any[]> {
    try {
      this.oauth2Client.setCredentials({ access_token: accessToken });
      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

      const now = new Date();
      const end = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

      const response = await calendar.freebusy.query({
        requestBody: {
          timeMin: now.toISOString(),
          timeMax: end.toISOString(),
          timeZone: 'Asia/Kolkata',
          items: [{ id: 'primary' }]
        }
      });

      const busyTimes = response.data.calendars?.['primary']?.busy || [];
      logger.info(`✅ Retrieved ${busyTimes.length} busy slots from Google Calendar`);
      
      return busyTimes;
    } catch (error) {
      logger.error('❌ Failed to fetch calendar availability:', error);
      throw new Error('Failed to fetch calendar data');
    }
  }

  // 🔥 UPDATED: Generate available slots with new day/time format and conflict checking
  static async generateAvailableSlots(
    busyTimes: any[], 
    userAvailability: any, 
    uid: string,
    workingHours = { start: 9, end: 20 }
  ): Promise<string[]> {
    const availableSlots: string[] = [];
    const today = new Date();
    
    // 🔥 UPDATED: Use 3-letter day abbreviations
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    console.log('🔍 User availability received:', userAvailability);
    
    // Get user's booked sessions to exclude them
    const bookedSessions = await SessionBookingService.getUserBookedSessions(uid);
    console.log(`📅 User has ${bookedSessions.length} booked sessions to exclude`);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dayName = dayNames[date.getDay()];
      
      // Skip weekends
      // if (date.getDay() === 0 || date.getDay() === 6) {
      //   console.log(`⏭️ Skipping weekend: ${dayName}`);
      //   continue;
      // }
      
      // 🔥 UPDATED: Check manual availability (3-letter day names)
      if (userAvailability && userAvailability.days && Array.isArray(userAvailability.days) && userAvailability.days.length > 0) {
        if (!userAvailability.days.includes(dayName)) {
          console.log(`⏭️ Skipping ${dayName} - not in user's available days:`, userAvailability.days);
          continue;
        } else {
          console.log(`✅ ${dayName} is in user's available days`);
        }
      } else {
        console.log(`⚠️ No manual day preferences found, using ${dayName} by default`);
      }
      
      // 🔥 UPDATED: Parse time ranges instead of single times
      let timeRangesToCheck = [];
      if (userAvailability && userAvailability.times && Array.isArray(userAvailability.times) && userAvailability.times.length > 0) {
        // Parse time ranges like "09:00-12:00", "14:00-16:00"
        timeRangesToCheck = userAvailability.times.map((timeRange: string) => {
          const [startTime, endTime] = timeRange.split('-');
          const [startHour, startMin] = startTime.split(':').map(Number);
          const [endHour, endMin] = endTime.split(':').map(Number);
          return {
            start: startHour + (startMin / 60),
            end: endHour + (endMin / 60),
            range: timeRange
          };
        });
        console.log(`⏰ Using user's preferred time ranges for ${dayName}:`, timeRangesToCheck);
      } else {
        // Use default working hours
        timeRangesToCheck = [{
          start: workingHours.start,
          end: workingHours.end,
          range: `${workingHours.start}:00-${workingHours.end}:00`
        }];
        console.log(`⏰ Using default working hours for ${dayName}:`, timeRangesToCheck);
      }
      
      // Generate 30-minute slots within each time range
      for (const timeRange of timeRangesToCheck) {
        let currentHour = timeRange.start;
        
        while (currentHour < timeRange.end) {
          const slotStart = new Date(date);
          slotStart.setHours(Math.floor(currentHour), (currentHour % 1) * 60, 0, 0);
          
          const slotEnd = new Date(date);
          slotEnd.setHours(Math.floor(currentHour + 0.5), ((currentHour + 0.5) % 1) * 60, 0, 0);
          
          // Check for conflicts with Google Calendar busy times
          const isGoogleCalendarConflict = busyTimes.some((busy: any) => {
            const busyStart = new Date(busy.start);
            const busyEnd = new Date(busy.end);
            return slotStart < busyEnd && slotEnd > busyStart;
          });
          
          // Check for conflicts with booked sessions
          const isBookedSessionConflict = bookedSessions.some((session: any) => {
            const sessionStart = session.start_time.toDate();
            const sessionEnd = session.end_time.toDate();
            return slotStart < sessionEnd && slotEnd > sessionStart;
          });
          
          if (!isGoogleCalendarConflict && !isBookedSessionConflict) {
            // Convert to normal format with day name
            const normalTime = slotStart.toLocaleString('en-IN', {
              timeZone: 'Asia/Kolkata',
              weekday: 'short',  // This gives us "Mon", "Tue", etc.
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            });
            
            availableSlots.push(normalTime);
            console.log(`✅ Added slot: ${dayName} ${Math.floor(currentHour)}:${String((currentHour % 1) * 60).padStart(2, '0')} - ${normalTime}`);
          } else {
            if (isGoogleCalendarConflict) {
              console.log(`❌ Google Calendar conflict for ${dayName} ${Math.floor(currentHour)}:${String((currentHour % 1) * 60).padStart(2, '0')}`);
            }
            if (isBookedSessionConflict) {
              console.log(`❌ Booked session conflict for ${dayName} ${Math.floor(currentHour)}:${String((currentHour % 1) * 60).padStart(2, '0')}`);
            }
          }
          
          currentHour += 0.5; // Move to next 30-minute slot
        }
      }
    }
    
    console.log(`🎯 Total available slots generated: ${availableSlots.length}`);
    return availableSlots;
  }

  // 🔥 NEW: 2-way session booking
  static async createTwoWaySessionEvent(
    organizerAccessToken: string, 
    participantAccessToken: string,
    sessionData: {
      summary: string;
      startTime: string;
      endTime: string;
      organizerEmail: string;
      participantEmail: string;
      description?: string;
    }
  ): Promise<{ organizerEvent: any, participantEvent: any }> {
    try {
      // Create event in organizer's calendar
      const organizerEvent = await this.createSessionEvent(organizerAccessToken, {
        summary: sessionData.summary,
        startTime: sessionData.startTime,
        endTime: sessionData.endTime,
        attendeeEmail: sessionData.participantEmail,
        description: sessionData.description
      });

      // Create event in participant's calendar
      const participantEvent = await this.createSessionEvent(participantAccessToken, {
        summary: sessionData.summary,
        startTime: sessionData.startTime,
        endTime: sessionData.endTime,
        attendeeEmail: sessionData.organizerEmail,
        description: sessionData.description
      });

      logger.info(`✅ Created 2-way session events: organizer=${organizerEvent.id}, participant=${participantEvent.id}`);
      
      return { organizerEvent, participantEvent };
    } catch (error) {
      logger.error('❌ Failed to create 2-way session events:', error);
      throw new Error('Failed to create calendar events for both users');
    }
  }

  // Existing createSessionEvent method remains the same
  static async createSessionEvent(accessToken: string, sessionData: {
    summary: string;
    startTime: string;
    endTime: string;
    attendeeEmail: string;
    description?: string;
  }): Promise<any> {
    try {
      this.oauth2Client.setCredentials({ access_token: accessToken });
      const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

      const event = {
        summary: sessionData.summary,
        description: sessionData.description || 'SkillSwap Learning Session',
        start: {
          dateTime: sessionData.startTime,
          timeZone: 'Asia/Kolkata'
        },
        end: {
          dateTime: sessionData.endTime,
          timeZone: 'Asia/Kolkata'
        },
        attendees: [
          { email: sessionData.attendeeEmail }
        ],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 10 }
          ]
        }
      };

      const response = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: event
      });

      logger.info(`✅ Created calendar event: ${response.data.id}`);
      return response.data;
    } catch (error) {
      logger.error('❌ Failed to create calendar event:', error);
      throw new Error('Failed to create calendar event');
    }
  }
}
