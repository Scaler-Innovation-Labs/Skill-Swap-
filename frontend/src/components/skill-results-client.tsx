"use client";

import TeacherCardList from "@/components/teacher-card-list";
import { useEffect, useState } from "react";
import { fetchTopMentorsForSkill, MatchItem } from "@/lib/api";

export default function SkillResultsClient({ skill }: { skill: string }) {
  const [mentors, setMentors] = useState<MatchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const data = await fetchTopMentorsForSkill(5);
        if (cancelled) return;

        // Further filter to ensure mentor actually teaches this skill
        const filtered = data.filter((m) =>
          m.skillsOffered.some((s) => s.toLowerCase() === skill.toLowerCase())
        );
        setMentors(filtered);
      } catch (err: any) {
        console.error(err);

        if (err.message?.includes("401")) {
          setNeedsAuth(true);
        } else {
          setError("Failed to load teachers");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [skill]);

  const handleDismiss = (id: string, dir: "left" | "right") => {
    console.log(`Teacher ${id} dismissed to the ${dir}`);
  };

  if (loading) {
    return <p className="p-4 text-center">Loading…</p>;
  }

  if (needsAuth) {
    return (
      <p className="p-4 text-center text-muted-foreground">
        Please sign in to view your top instructors.
      </p>
    );
  }

  if (error) {
    return <p className="p-4 text-center text-red-500">{error}</p>;
  }

  if (mentors.length === 0) {
    return <p className="p-4 text-center text-muted-foreground">No teachers found.</p>;
  }

  // Transform TeacherItem to TeacherCardList friendly shape
  const mapped = mentors.map((t) => ({
    id: t.uid,
    name: t.name,
    photo: t.avatar_url || "https://i.pravatar.cc/150?u=" + t.uid,
    subject: skill,
    badges: Math.round(t.badgeScore || 0),
    rating: Math.max(1, Math.min(5, Math.round(t.badgeScore))) // crude mapping until proper rating provided
  }));

  return (
    <div className="p-4">
      <TeacherCardList teachers={mapped} onDismiss={handleDismiss} />
    </div>
  );
} 