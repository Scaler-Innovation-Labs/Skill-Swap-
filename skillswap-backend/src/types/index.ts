export interface User {
  uid: string;
  name: string;
  email: string;
  avatar_url?: string;
  role: 'student' | 'mentor' | 'admin';
  skills_offered: string[];
  skills_wanted: string[];
  availability: {
    days: string[];
    times: string[];
  };
  created_at: Date;
  updated_at: Date;
  badge_score: number;           // Average rating (0-5.0)
  badge_count: number;          // Total number of ratings received
  total_badge_points: number;   // Sum of all ratings
  calendar_connected?: boolean;
  calendar_synced?: boolean;
  calendar_access_token?: string;
  calendar_busy_times?: any[];
  available_slots?: string[];
  calendar_last_sync?: Date;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  avatar_url?: string;
  role?: 'student' | 'mentor';
  skills_offered?: string[];
  skills_wanted?: string[];
  availability?: {
    days: string[];
    times: string[];
  };
}

export interface UpdateProfileRequest {
  name?: string;
  avatar_url?: string;
  skills_offered?: string[];
  skills_wanted?: string[];
  availability?: {
    days: string[];
    times: string[];
  };
}

export interface UserMatch {
  uid: string;
  name: string;
  skills_offered: string[];
  skills_wanted: string[];
  badge_count: number;
  availability: {
    days: string[];
    times: string[];
  };
  match_score: number;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email: string;
    role: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  limit: number;
  offset: number;
}

export interface MatchParams extends PaginationParams {
  skill_filter?: string;
  availability_filter?: string[];
}

export interface MatchExplanation {
  match_score: number;
  mutual_skills: boolean;
  skills_a_wants_from_b: string[];
  skills_b_wants_from_a: string[];
  availability_overlap: number;
  role_compatibility: boolean;
}

export interface MatchStats {
  total_matches: number;
  high_score_matches: number;
  medium_score_matches: number;
  low_score_matches: number;
  average_match_score: number;
  top_skills_in_demand: { skill: string; count: number }[];
  top_skills_offered: { skill: string; count: number }[];
}
