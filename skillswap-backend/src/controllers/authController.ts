import { Request, Response, NextFunction } from 'express';
import { verifyFirebaseToken, firestore } from '../config/firebase';
import { logger } from '../utils/logger';
import { AppError } from '../utils/errors';
import { CreateUserRequest } from '../types';
import { FieldValue } from 'firebase-admin/firestore';
import { UserService } from '../services/userService';

export class AuthController {
  // Register new user with Firebase
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      //added
      const { uid, email } = req.user!;
      const { 
        //idToken, 
        name, 
        role = 'student', 
        avatar_url, 
        skills_offered = [], 
        skills_wanted = [], 
        availability = { days: [], times: [] } 
      } = req.body;

      // if (!idToken) {
      //   throw new AppError('Firebase ID token is required', 400);
      // }

      if (!name) {
        throw new AppError('Name is required', 400);
      }

      // Verify Firebase ID token
      // const decodedToken = await verifyFirebaseToken(idToken);
      // const { uid, email } = decodedToken;

      // // Check if user already exists in Firestore
      // const userDoc = await firestore.collection('users').doc(uid).get();
      // if (userDoc.exists) {
      //   throw new AppError('User already exists', 409);
      // }

      // Create user data
      // const userData = {
      const user = await UserService.createUser({
        uid,
        name: name.trim(),
        email,
        avatar_url: avatar_url || null,
        role,
        skills_offered,
        skills_wanted,
        // availability: availability || {
        //   days: [],
        //   times: []
        // },
        // badge_count: 0,
        // available_slots: [], // Default empty array for calendar slots
        // created_at: FieldValue.serverTimestamp(),
        // updated_at: FieldValue.serverTimestamp()
        availability
      });

      // Create user document in Firestore
      // await firestore.collection('users').doc(uid).set(userData);

      // // Update skill popularity counters
      // if (skills_offered.length > 0) {
      //   const batch = firestore.batch();
        
      //   for (const skill of skills_offered) {
      //     const skillRef = firestore.collection('skill_popularity').doc(skill.toLowerCase());
      //     batch.set(skillRef, {
      //       name: skill,
      //       count: FieldValue.increment(1),
      //       updated_at: FieldValue.serverTimestamp()
      //     }, { merge: true });
      //   }
        
      //   await batch.commit();
      // }

      logger.info(`✅ User registered successfully: ${uid}`);

      // Return user data (excluding sensitive info)
      const responseData = {
        uid: user.uid,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar_url: user.avatar_url,
        skills_offered: user.skills_offered,
        skills_wanted: user.skills_wanted,
        availability: user.availability,
        badge_count: user.badge_count
      };

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: responseData
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Login user (verify token and return user info)
  // static async login(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const { idToken } = req.body;

  //     if (!idToken) {
  //       throw new AppError('Firebase ID token is required', 400);
  //     }
static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // User info already extracted and verified by authenticateToken middleware
    const { uid, email } = req.user!;
      // Verify Firebase ID token
      // const decodedToken = await verifyFirebaseToken(idToken);
      // const { uid, email } = decodedToken;

      // // Get user from Firestore
      // const userDoc = await firestore.collection('users').doc(uid).get();
      
      // if (!userDoc.exists) {
      //   // For Google OAuth users who haven't completed registration
      //   if (decodedToken.firebase.sign_in_provider === 'google.com') {
      //      res.status(200).json({
      //       success: true,
      //       message: 'Google user needs to complete registration',
      //       data: {
      //         needsRegistration: true,
      //         email,
      //         uid
      //       }
      //     });
      //     return;
      //   }
        
      //   throw new AppError('User not found. Please register first.', 404);
      // }

      // const userData = userDoc.data()!;

      // logger.info(`✅ User logged in successfully: ${uid}`);

      const user = await UserService.getUser(uid);

      if (!user) {
      // For OAuth users who haven't completed registration


      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          // user: {
          //   uid: userData.uid,
          //   name: userData.name,
          //   email: userData.email,
          //   role: userData.role,
          //   avatar_url: userData.avatar_url,
          //   badge_count: userData.badge_count
          // }
          needsRegistration: true,
          email,
          uid
        }
      });
    // } catch (error) {
    //   next(error);
    return;
    }

    logger.info(`✅ User logged in successfully: ${uid}`);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          uid: user.uid,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar_url: user.avatar_url,
          badge_count: user.badge_count
        }
      }
    });
  } catch (error) {
    next(error);
  }
}

  // Verify token endpoint (for frontend auth checks)
  static async verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
      // const { idToken } = req.body;

      // if (!idToken) {
      //   throw new AppError('Firebase ID token is required', 400);
      // }

      // // Verify Firebase ID token
      // const decodedToken = await verifyFirebaseToken(idToken);
      // const userDoc = await firestore.collection('users').doc(decodedToken.uid).get();

      const { uid } = req.user!;
      
      const user = await UserService.getUser(uid);

      if (!user) {
        throw new AppError('User not found', 404);
      }

      //const userData = userDoc.data()!;

      res.status(200).json({
        success: true,
        message: 'Token is valid',
        data: {
          user: {
            uid: user.uid,
            name: user.name,
            email: user.email,
            role: user.role,
            badge_count: user.badge_count
          }
        }
      });

    } catch (error) {
      next(error);
    }
  }


  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const uid = req.user?.uid;

      if (uid) {
        logger.info(`✅ User logged out: ${uid}`);
      }

      res.status(200).json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      next(error);
    }
  }

}