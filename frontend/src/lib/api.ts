// lib/api.ts
import { auth } from "../../firebase";

export interface MatchItem {
  uid: string;
  name: string;
  skillsOffered: string[];
  badgeScore?: number;
  avatar_url?: string;
  matchScore?: number;
  availability?: unknown;
}

/**
 * Fetch the top mentors from the backend.
 * Requires Firebase Auth token (user must be signed in).
 */
export async function fetchTopMentorsForSkill(limit: number = 5): Promise<MatchItem[]> {
  const base =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "");
  const url = `${base}/api/match/redesigned?limit=${limit}`;

  // Get Firebase Auth token
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not signed in. Cannot fetch mentors.");
  }

  const token = await user.getIdToken(true);

  // Make sure the user exists in the backend (register if missing)
  await ensureBackendUser(token, user.displayName || user.email || "User");

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  console.log("token", token);

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch mentors (${res.status}): ${errorText}`);
  }

  const json = await res.json();
  return json?.data?.matches ?? [];
}

// Ensure the authenticated Firebase user exists in our backend database.
async function ensureBackendUser(token: string, name: string): Promise<void> {
  const base =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "");

  // 1. Try login; this does *not* require the user to already exist.
  const loginRes = await fetch(`${base}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!loginRes.ok) {
    // Bail early; something else went wrong (token invalid, etc.)
    return;
  }

  const loginJson = await loginRes.json();

  // If backend says user needs registration, perform it now.
  if (loginJson?.data?.needsRegistration) {
    await fetch(`${base}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });
  }
}

export interface PopularSkill {
  name: string;
  popularity: number;
  category?: string;
}

/**
 * Fetch list of popular skills.
 * Public API, no auth required.
 */
export async function fetchPopularSkills(limit: number = 100): Promise<PopularSkill[]> {
  const base =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "");
  const url = `${base}/api/match/skills/popular?limit=${limit}`;

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Failed to fetch skills (${res.status})`);
  }

  const json = await res.json();
  return json?.data?.skills ?? [];
}
