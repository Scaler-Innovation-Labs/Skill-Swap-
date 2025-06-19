"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare, Calendar, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchRecommendedMatches, UserProfile, sendSessionRequest } from "@/services/firestore-service";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebase";

// Loading state UI helper
function SkeletonCard() {
  return <div className="h-40 bg-muted rounded-lg animate-pulse" />;
}

export function RecommendedMatches() {
  const [matches, setMatches] = useState<UserProfile[] | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const data = await fetchRecommendedMatches(user.uid);
        setMatches(data);
      } else {
        setMatches([]);
      }
    });
    return () => unsub();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold tracking-tight">Recommended Matches</h2>
        <Button variant="outline" className="gap-1">
          View All
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {matches === null && (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}
        {matches && matches.length === 0 && (
          <p className="text-muted-foreground">No matches yet. Add more skills to improve matching!</p>
        )}
        {matches &&
          matches.map((match) => {
            const teachSkill = match.teachingSkills[0];
            const learnSkill = match.learningSkills[0];
            const initials = match.displayName
              .split(" ")
              .map((w) => w.charAt(0))
              .join("")
              .slice(0, 2)
              .toUpperCase();

            return (
              <Card
                key={match.uid}
                className="overflow-hidden transition-all duration-200 hover:shadow-md"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={match.photoURL || undefined} alt={match.displayName} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{match.displayName}</CardTitle>
                      {match.rating && (
                        <CardDescription className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                          {match.rating.toFixed(1)}
                          {match.completedSessions && (
                            <> • {match.completedSessions} sessions</>
                          )}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-0">
                  <div className="space-y-4">
                    {teachSkill && (
                      <div>
                        <p className="text-sm font-medium">Teaches:</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="rounded-md">
                            {teachSkill.name}
                          </Badge>
                        </div>
                      </div>
                    )}
                    {learnSkill && (
                      <div>
                        <p className="text-sm font-medium">Wants to learn:</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="rounded-md">
                            {learnSkill.name}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2 pt-4 mt-4 border-t">
                  <Button
                    className="flex-1"
                    onClick={async () => {
                      const preferredTime = prompt("Preferred time (e.g. 2024-06-18 15:00)");
                      if (!preferredTime) return;
                      if (!auth.currentUser) return alert("Please sign in first");
                      await sendSessionRequest(
                        auth.currentUser.uid,
                        match.uid,
                        teachSkill?.id || "",
                        preferredTime
                      );
                      alert("Request sent!");
                    }}
                  >
                    Request Swap
                  </Button>
                  <Button variant="outline" size="icon">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Calendar className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
      </div>
      
      <div className="text-center mt-8">
        <p className="text-sm text-muted-foreground mb-4">
          Want to find more specific matches? Try filtering by skill or availability.
        </p>
        <Button variant="outline">Advanced Search</Button>
      </div>
    </div>
  );
}