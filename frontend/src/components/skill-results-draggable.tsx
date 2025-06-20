"use client";

import { fetchTopMentorsForSkill, MatchItem } from "@/lib/api";
import Image from "next/image";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { Badge } from "./ui/badge";
import { CalendarDays, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MentorWithSlot extends MatchItem {
  nextSlot: Date;
  bio?: string;
}

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
  const [mentors, setMentors] = useState<MentorWithSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
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
        ).map((mentor): MentorWithSlot => ({
          ...mentor,
          bio: "Experienced mentor in this field.",
          nextSlot: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000)
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

  const handleSwipe = () => {
    setCurrentIndex(prevIndex => prevIndex + 1);
  };

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
  
  if (currentIndex >= mentors.length) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4">Would you love to learn from AI?</h2>
        <Button onClick={() => window.open('https://ai-interview-platform-umber.vercel.app', '_blank')}>
          Learn from AI
        </Button>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center h-[500px] w-full max-w-sm mx-auto">
      <AnimatePresence>
        {mentors.slice(currentIndex, currentIndex + 2).reverse().map((mentor, index) => {
          const isTopCard = index === 1;
          return (
            <motion.div
              key={mentor.uid}
              className="absolute w-full h-full p-6 bg-card rounded-lg shadow-xl border"
              style={{
                zIndex: mentors.length - (currentIndex + (1-index)),
                y: isTopCard ? 0 : -20,
                scale: isTopCard ? 1 : 0.95,
                boxShadow: isTopCard ? '0px 10px 30px -5px rgba(0, 0, 0, 0.3)' : '0px 5px 20px -5px rgba(0, 0, 0, 0.2)',
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(event, info) => {
                if (info.offset.x < -100) {
                  handleSwipe();
                } else if (info.offset.x > 100) {
                  handleSwipe();
                }
              }}
              animate={{
                y: isTopCard ? 0 : -20,
                scale: isTopCard ? 1 : 0.95,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
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
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
