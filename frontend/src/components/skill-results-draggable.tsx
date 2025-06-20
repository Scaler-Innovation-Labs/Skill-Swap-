"use client";

import { DraggableCardBody, DraggableCardContainer } from "@/components/ui/draggable-card";
import { fetchTopMentorsForSkill, MatchItem } from "@/lib/api";
import Image from "next/image";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { Badge } from "./ui/badge";
import { CalendarDays, Star } from "lucide-react";

// Helper function to format date and time in Indian timezone
const formatIndianDateTime = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    hour: 'numeric',
    minute: 'numeric',
    timeZone: 'Asia/Kolkata',
    hour12: true
  };
  return new Intl.DateTimeFormat('en-IN', options).format(date);
};

export default function SkillResultsDraggable({ skill }: { skill: string }) {
  const [mentors, setMentors] = useState<MatchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(false);
  const router = useRouter();

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

        // Add next available slot for each mentor
        const mentorsWithSlots = data.filter((m) =>
          m.skillsOffered.some((s) => s.toLowerCase() === skill.toLowerCase())
        ).map(mentor => ({
          ...mentor,
          nextSlot: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000) // Random date within next 7 days (for demo)
        }));

        setMentors(mentorsWithSlots);
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

  const handleAccept = (mentorId: string) => {
    router.push(`/schedule-session?mentor=${mentorId}&skill=${skill}`);
  };

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
    <DraggableCardContainer className="flex flex-col gap-6 items-center py-8 max-w-3xl mx-auto">
      {mentors.map((mentor) => (
        <DraggableCardBody key={mentor.uid} className="bg-card">
          <div className="flex flex-col h-full">
            {/* Header with Avatar and Basic Info */}
            <div className="flex items-start gap-4 mb-4">
              <Image
                src={mentor.avatar_url || `https://i.pravatar.cc/150?u=${mentor.uid}`}
                alt={mentor.name}
                width={80}
                height={80}
                className="rounded-full object-cover border-2 border-primary"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{mentor.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="capitalize">{skill}</Badge>
                  {mentor.badgeScore !== undefined && (
                    <div className="flex items-center text-amber-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="ml-1 font-medium">{mentor.badgeScore.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Next Available Slot */}
            <div className="mb-6">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CalendarDays className="w-4 h-4" />
                <span>Next available: {formatIndianDateTime(mentor.nextSlot)}</span>
              </div>
              {mentor.bio && (
                <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                  {mentor.bio}
                </p>
              )}
            </div>

            {/* Action Button */}
            <div className="mt-auto">
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white" 
                onClick={() => handleAccept(mentor.uid)}
              >
                Schedule Session
              </Button>
            </div>
          </div>
        </DraggableCardBody>
      ))}
    </DraggableCardContainer>
  );
}
