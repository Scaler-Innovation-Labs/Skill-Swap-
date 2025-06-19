import { db } from "../../firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  Timestamp,
  arrayUnion,
} from "firebase/firestore";
import { User as FirebaseUser } from "firebase/auth";

/**
 * User profile shape in Firestore
 * users/{uid}
 */
export interface Skill {
  id: string; // uuid
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  // optional metadata
  sessionsCompleted?: number;
  rating?: number;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  photoURL?: string;
  teachingSkills: Skill[];
  learningSkills: Skill[];
  rating?: number;
  completedSessions?: number;
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  return snap.data() as UserProfile;
}

export async function upsertUserProfile(profile: UserProfile) {
  await setDoc(doc(db, "users", profile.uid), profile, { merge: true });
}

export async function addTeachingSkill(uid: string, skill: Skill) {
  await updateDoc(doc(db, "users", uid), {
    teachingSkills: arrayUnion(skill),
  });
}

export async function addLearningSkill(uid: string, skill: Skill) {
  await updateDoc(doc(db, "users", uid), {
    learningSkills: arrayUnion(skill),
  });
}

/**
 * Returns list of users whose learningSkills include one of my teaching skills.
 * Very naive matching; refine later.
 */
export async function fetchRecommendedMatches(currentUid: string): Promise<UserProfile[]> {
  const me = await getUserProfile(currentUid);
  if (!me) return [];
  const myTeachNames = me.teachingSkills.map((s) => s.name.toLowerCase());

  // Fetch users where learningSkills array contains any of myTeachNames
  // Firestore doesn\'t support full array-contains-any on nested objects, so we store simple lowercase names in each user doc for fast search.
  // Here we assume user profile has learningSkillNames field updated via Cloud Function or client.
  const q = query(
    collection(db, "users"),
    where("learningSkillNames", "array-contains-any", myTeachNames)
  );
  const snapshot = await getDocs(q);
  const matches: UserProfile[] = [];
  snapshot.forEach((docSnap) => {
    if (docSnap.id !== currentUid) {
      matches.push(docSnap.data() as UserProfile);
    }
  });
  return matches;
}

export type SessionStatus = "pending" | "accepted" | "declined" | "completed";

export interface SessionRequest {
  id?: string;
  fromUid: string;
  toUid: string;
  skillId: string;
  preferredTime: string; // ISO string or any
  status: SessionStatus;
  createdAt: Timestamp;
}

export async function sendSessionRequest(
  fromUid: string,
  toUid: string,
  skillId: string,
  preferredTime: string
): Promise<string> {
  const docRef = await addDoc(collection(db, "sessionRequests"), {
    fromUid,
    toUid,
    skillId,
    preferredTime,
    status: "pending",
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateSessionStatus(requestId: string, status: SessionStatus) {
  await updateDoc(doc(db, "sessionRequests", requestId), { status });
} 