"use client";

import SessionScheduler from "@/components/session-scheduler";

export default function SchedulePage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Schedule a Session</h1>
      <SessionScheduler />
    </div>
  );
} 