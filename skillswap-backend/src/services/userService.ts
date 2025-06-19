import { UserModel } from '../models/user';
import { CacheService } from '../config/redis';
import { redis } from '../config/redis';
import { logger } from '../utils/logger';
import { User, CreateUserRequest, UpdateProfileRequest } from '../types';

export class UserService {
  // Create user with additional business logic
  static async createUser(userData: CreateUserRequest & { uid: string }): Promise<User> {
    try {
      // Validate and clean data
      const cleanedData = {
        ...userData,
        name: userData.name.trim(),
        email: userData.email.toLowerCase(),
        skills_offered: userData.skills_offered?.map(skill => skill.trim()) || [],
        skills_wanted: userData.skills_wanted?.map(skill => skill.trim()) || []
      };

      // Create user
      const user = await UserModel.create(cleanedData);

      // Update skill popularity
      if (cleanedData.skills_offered.length > 0) {
        for (const skill of cleanedData.skills_offered) {
          await CacheService.incrementSkillPopularity(skill);
        }
      }

      logger.info(`✅ User service: Created user ${user.uid}`);
      return user;
    } catch (error) {
      logger.error('❌ User service: Failed to create user:', error);
      throw error;
    }
  }

  // Get user with caching
  static async getUser(uid: string, useCache: boolean = true): Promise<User | null> {
    try {
      if (useCache) {
        // Try cache first
        const cached = await CacheService.getUserProfile(uid);
        if (cached) {
          return cached;
        }
      }

      // Get from Firestore
      const user = await UserModel.findByUid(uid);
      if (user && useCache) {
        // Cache for future requests
        await CacheService.setUserProfile(uid, user);
      }

      return user;
    } catch (error) {
      logger.error(`❌ User service: Failed to get user ${uid}:`, error);
      throw error;
    }
  }

  // Update user with cache invalidation
  // In updateUser method, add these fields to the cleanedData handling
static async updateUser(uid: string, updateData: UpdateProfileRequest & {
  badge_score?: number;
  badge_count?: number;
  total_badge_points?: number;
  // ... other existing fields
}): Promise<User> {
  try {
    // Clean the data
    const cleanedData: any = {};
    
    // Existing fields (name, skills, etc.)
    if (updateData.name) {
      cleanedData.name = updateData.name.trim();
    }
    if (updateData.skills_offered) {
      cleanedData.skills_offered = updateData.skills_offered.map(skill => skill.trim());
    }
    if (updateData.skills_wanted) {
      cleanedData.skills_wanted = updateData.skills_wanted.map(skill => skill.trim());
    }
    if (updateData.availability) {
      cleanedData.availability = updateData.availability;
    }
    if (updateData.avatar_url) {
      cleanedData.avatar_url = updateData.avatar_url;
    }

    // 🔥 ADD: Badge score fields
    if (updateData.badge_score !== undefined) {
      cleanedData.badge_score = updateData.badge_score;
    }
    if (updateData.badge_count !== undefined) {
      cleanedData.badge_count = updateData.badge_count;
    }
    if (updateData.total_badge_points !== undefined) {
      cleanedData.total_badge_points = updateData.total_badge_points;
    }

    // Update user
    const updatedUser = await UserModel.update(uid, cleanedData);

    // Rest of your existing logic...
    return updatedUser;
  } catch (error) {
    logger.error(`❌ User service: Failed to update user ${uid}:`, error);
    throw error;
  }
}


  // Get users for matching with business logic
  static async getUsersForMatching(excludeUid: string, limit: number = 50): Promise<User[]> {
    try {
      const users = await UserModel.getAllForMatching(excludeUid, limit);
      
      // Filter out users with incomplete profiles
      const completeUsers = users.filter(user => 
        user.skills_offered.length > 0 || user.skills_wanted.length > 0
      );

      logger.info(`✅ User service: Retrieved ${completeUsers.length} users for matching`);
      return completeUsers;
    } catch (error) {
      logger.error('❌ User service: Failed to get users for matching:', error);
      throw error;
    }
  }

  // Validate user can perform action
  static async validateUserAction(uid: string, action: string): Promise<boolean> {
    try {
      const user = await this.getUser(uid);
      if (!user) {
        return false;
      }

      // Add business logic for different actions
      switch (action) {
        case 'match':
          return user.skills_offered.length > 0 || user.skills_wanted.length > 0;
        case 'mentor':
          return user.role === 'mentor' && user.skills_offered.length > 0;
        default:
          return true;
      }
    } catch (error) {
      logger.error(`❌ User service: Failed to validate action ${action} for ${uid}:`, error);
      return false;
    }
  }

  // Award badges to user
  static async awardBadge(uid: string, badgeType: string, increment: number = 1): Promise<void> {
    try {
      await UserModel.updateBadgeCount(uid, increment);
      
      // Update cache
      const user = await UserModel.findByUid(uid);
      if (user) {
        await CacheService.setUserProfile(uid, user);
      }

      logger.info(`🏆 User service: Awarded ${badgeType} badge to ${uid} (+${increment})`);
    } catch (error) {
      logger.error(`❌ User service: Failed to award badge to ${uid}:`, error);
      throw error;
    }
  }

  // Delete user
  static async deleteUser(uid: string): Promise<void> {
    try {
      await UserModel.delete(uid);
      await CacheService.clearUserCache(uid);
      logger.info(`✅ User service: Deleted user ${uid}`);
    } catch (error) {
      logger.error(`❌ User service: Failed to delete user ${uid}:`, error);
      throw error;
    }
  }
}
