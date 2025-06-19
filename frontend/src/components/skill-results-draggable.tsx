"use client";

import { DraggableCardBody, DraggableCardContainer } from "@/components/ui/draggable-card";
import { fetchTopMentorsForSkill, MatchItem } from "@/lib/api";
import Image from "next/image";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";

export default function SkillResultsDraggable({ skill }: { skill: string }) {
  const [mentors, setMentors] = useState<MatchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        if (!cancelled) {
          setNeedsAuth(true);
          setLoading(false);
        }
        return;
      }

      try {
        const data = await fetchTopMentorsForSkill(10);
        if (cancelled) return;

        const filtered = data.filter((m) =>
          m.skillsOffered.some((s) => s.toLowerCase() === skill.toLowerCase())
        );
        setMentors(filtered);
      } catch (err: any) {
        console.error("❌ Error loading mentors:", err);
        if (!cancelled) setError("Failed to load instructors.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [skill]);

  if (loading) return <p className="p-4 text-center">Loading…</p>;
  if (needsAuth)
    return (
      <p className="p-4 text-center text-muted-foreground">
        Please sign in to view instructors.
      </p>
    );
  if (error) return <p className="p-4 text-center text-red-500">{error}</p>;
  if (mentors.length === 0)
    return <p className="p-4 text-center text-muted-foreground">No instructors found.</p>;

  return (
    <DraggableCardContainer className="flex flex-wrap gap-6 justify-center py-8">
      {mentors.map((mentor) => (
        <DraggableCardBody key={mentor.uid} className="bg-white dark:bg-neutral-900">
          <div className="flex flex-col items-center text-center gap-2 h-full justify-center">
            <Image
              src={mentor.avatar_url || `https://i.pravatar.cc/150?u=${mentor.uid}`}
              alt={mentor.name}
              width={120}
              height={120}
              className="rounded-full object-cover"
            />
            <h3 className="text-lg font-semibold mt-2">{mentor.name}</h3>
            <p className="text-sm text-muted-foreground capitalize">{skill}</p>
            {mentor.badgeScore !== undefined && (
              <p className="text-sm text-amber-500">⭐ {mentor.badgeScore.toFixed(1)}</p>
            )}
          </div>
        </DraggableCardBody>
      ))}
    </DraggableCardContainer>
  );
}
