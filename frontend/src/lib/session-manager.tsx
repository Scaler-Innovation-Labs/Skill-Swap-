import { User } from 'firebase/auth';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export interface SessionData {
  userId: string;
  loginTime: string;
  lastActivity: string;
  requiredSessionTime: number; // in minutes
  isSessionComplete: boolean;
  warningShown: boolean;
}

export class SessionManager {
  private sessionData: SessionData | null = null;
  private activityTimer: NodeJS.Timeout | null = null;
  private warningTimer: NodeJS.Timeout | null = null;
  private logoutTimer: NodeJS.Timeout | null = null;
  private onSessionWarning?: (timeLeft: number) => void;
  private onSessionExpired?: () => void;
  private onSessionCompleted?: () => void;

  // Default session requirements (in minutes)
  private readonly DEFAULT_REQUIRED_SESSION_TIME = 30;
  private readonly INACTIVITY_TIMEOUT = 15; // minutes before logout due to inactivity
  private readonly WARNING_TIME = 5; // minutes before showing warning

  constructor(
    onSessionWarning?: (timeLeft: number) => void,
    onSessionExpired?: () => void,
    onSessionCompleted?: () => void
  ) {
    this.onSessionWarning = onSessionWarning;
    this.onSessionExpired = onSessionExpired;
    this.onSessionCompleted = onSessionCompleted;
    this.setupActivityListeners();
  }

  async startSession(user: User, requiredTime?: number): Promise<void> {
    const now = new Date().toISOString();
    const sessionTime = requiredTime || this.DEFAULT_REQUIRED_SESSION_TIME;

    this.sessionData = {
      userId: user.uid,
      loginTime: now,
      lastActivity: now,
      requiredSessionTime: sessionTime,
      isSessionComplete: false,
      warningShown: false,
    };

    // Save session to Firestore
    await setDoc(doc(db, 'sessions', user.uid), this.sessionData);

    // Start monitoring session
    this.startSessionMonitoring();
    this.resetActivityTimer();
  }

  async updateActivity(): Promise<void> {
    if (!this.sessionData) return;

    const now = new Date().toISOString();
    this.sessionData.lastActivity = now;

    // Update in Firestore
    await updateDoc(doc(db, 'sessions', this.sessionData.userId), {
      lastActivity: now,
    });

    this.resetActivityTimer();
  }

  async getSessionStatus(): Promise<{
    timeSpent: number;
    timeRemaining: number;
    isComplete: boolean;
    progressPercentage: number;
  } | null> {
    if (!this.sessionData) return null;

    const now = new Date();
    const loginTime = new Date(this.sessionData.loginTime);
    const timeSpentMs = now.getTime() - loginTime.getTime();
    const timeSpentMinutes = Math.floor(timeSpentMs / (1000 * 60));
    
    const timeRemaining = Math.max(0, this.sessionData.requiredSessionTime - timeSpentMinutes);
    const isComplete = timeSpentMinutes >= this.sessionData.requiredSessionTime;
    const progressPercentage = Math.min(100, (timeSpentMinutes / this.sessionData.requiredSessionTime) * 100);

    // Update completion status if session is complete
    if (isComplete && !this.sessionData.isSessionComplete) {
      this.sessionData.isSessionComplete = true;
      await updateDoc(doc(db, 'sessions', this.sessionData.userId), {
        isSessionComplete: true,
      });
      this.onSessionCompleted?.();
    }

    return {
      timeSpent: timeSpentMinutes,
      timeRemaining,
      isComplete,
      progressPercentage,
    };
  }

  async endSession(): Promise<void> {
    if (!this.sessionData) return;

    // Clear all timers
    this.clearAllTimers();

    // Update session end time in Firestore
    await updateDoc(doc(db, 'sessions', this.sessionData.userId), {
      endTime: new Date().toISOString(),
    });

    this.sessionData = null;
  }

  async loadExistingSession(userId: string): Promise<boolean> {
    try {
      const sessionDoc = await getDoc(doc(db, 'sessions', userId));
      
      if (sessionDoc.exists()) {
        const data = sessionDoc.data() as SessionData;
        
        // Check if session is still valid (not older than 24 hours)
        const loginTime = new Date(data.loginTime);
        const now = new Date();
        const hoursSinceLogin = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
        
        if (hoursSinceLogin < 24) {
          this.sessionData = data;
          this.startSessionMonitoring();
          this.resetActivityTimer();
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error loading existing session:', error);
      return false;
    }
  }

  private setupActivityListeners(): void {
    if (typeof window === 'undefined') return;

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => {
      this.updateActivity();
    };

    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });
  }

  private startSessionMonitoring(): void {
    if (!this.sessionData) return;

    // Check session status every minute
    const checkInterval = setInterval(async () => {
      const status = await this.getSessionStatus();
      if (!status) {
        clearInterval(checkInterval);
        return;
      }

      // Show warning when approaching required time
      if (!this.sessionData?.warningShown && status.timeRemaining <= this.WARNING_TIME && status.timeRemaining > 0) {
        this.sessionData.warningShown = true;
        this.onSessionWarning?.(status.timeRemaining);
      }
    }, 60000); // Check every minute
  }

  private resetActivityTimer(): void {
    this.clearActivityTimer();

    // Set timer for inactivity logout
    this.activityTimer = setTimeout(() => {
      this.handleInactivityLogout();
    }, this.INACTIVITY_TIMEOUT * 60 * 1000);
  }

  private handleInactivityLogout(): void {
    this.onSessionExpired?.();
  }

  private clearActivityTimer(): void {
    if (this.activityTimer) {
      clearTimeout(this.activityTimer);
      this.activityTimer = null;
    }
  }

  private clearAllTimers(): void {
    this.clearActivityTimer();
    
    if (this.warningTimer) {
      clearTimeout(this.warningTimer);
      this.warningTimer = null;
    }
    
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
      this.logoutTimer = null;
    }
  }

  // Get session requirements for different user types
  static getSessionRequirements(userType: 'student' | 'professional' | 'premium'): number {
    switch (userType) {
      case 'student':
        return 20; // 20 minutes minimum
      case 'professional':
        return 30; // 30 minutes minimum
      case 'premium':
        return 15; // 15 minutes minimum (premium users get reduced time)
      default:
        return 30;
    }
  }
}