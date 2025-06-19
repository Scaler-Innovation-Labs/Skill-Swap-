"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UpcomingSessions } from "./upcoming-sessions";
import { SkillsOverview } from "./skills-overview";
import { RecommendedMatches } from "./recommended-matches";
import { Leaderboard } from "./leaderboard";

export function DashboardTabs() {
  const [activeTab, setActiveTab] = useState("upcoming");
  
  return (
    <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-4 md:w-[520px] mb-8">
        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        <TabsTrigger value="skills">My Skills</TabsTrigger>
        <TabsTrigger value="matches">Matches</TabsTrigger>
        <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
      </TabsList>
      <TabsContent value="upcoming">
        <UpcomingSessions />
      </TabsContent>
      <TabsContent value="skills">
        <SkillsOverview />
      </TabsContent>
      <TabsContent value="matches">
        <RecommendedMatches />
      </TabsContent>
      <TabsContent value="leaderboard">
        <Leaderboard />
      </TabsContent>
    </Tabs>
  );
}