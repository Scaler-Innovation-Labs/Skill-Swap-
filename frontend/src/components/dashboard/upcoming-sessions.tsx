"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Video, MessageSquare, ExternalLink } from "lucide-react";
import { RatingDialog } from "./rating-dialog";

const upcomingSessions = [
  {
    id: 1,
    type: "teaching",
    skill: "Advanced Excel Formulas",
    with: {
      name: "Sarah Miller",
      avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      initials: "SM"
    },
    date: "2025-03-15T10:00:00",
    duration: 30
  },
  {
    id: 2,
    type: "learning",
    skill: "Photoshop Basics",
    with: {
      name: "David Thompson",
      avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      initials: "DT"
    },
    date: "2025-03-16T15:30:00",
    duration: 45
  }
];

export function UpcomingSessions() {
  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'long',
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Upcoming Sessions</h2>
        <Button variant="outline">View All</Button>
      </div>
      
      {upcomingSessions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {upcomingSessions.map((session) => (
            <Card key={session.id} className="overflow-hidden transition-all duration-200 hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <Badge variant={session.type === "teaching" ? "default" : "secondary"}>
                    {session.type === "teaching" ? "Teaching" : "Learning"}
                  </Badge>
                  <Button variant="ghost" size="icon">
                    <Calendar className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle className="text-xl">{session.skill}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {session.duration} minutes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar>
                    <AvatarImage src={session.with.avatar} alt={session.with.name} />
                    <AvatarFallback>{session.with.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{session.with.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {session.type === "teaching" ? "Student" : "Teacher"}
                    </p>
                  </div>
                </div>
                <div className="bg-muted p-3 rounded-md text-sm">
                  <p className="font-medium">Scheduled for:</p>
                  <p>{formatDate(session.date)}</p>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex gap-2">
                <Button className="flex-1 gap-2">
                  <Video className="h-4 w-4" />
                  Join Session
                </Button>
                <Button variant="outline" size="icon">
                  <MessageSquare className="h-4 w-4" />
                </Button>
                <RatingDialog triggerLabel="Rate" targetId={session.id.toString()} onSubmit={(r, rev) => console.log("rating submitted", session.id, r, rev)} />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-lg mb-2">No upcoming sessions</h3>
            <p className="text-muted-foreground mb-4">
              You don't have any sessions scheduled yet. Start by finding matches or creating a new session.
            </p>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Schedule a Session
            </Button>
          </CardContent>
        </Card>
      )}
      
      <div className="bg-muted p-4 rounded-lg mt-6">
        <h3 className="font-medium mb-2 flex items-center gap-2">
          <ExternalLink className="h-4 w-4" />
          Quick Tip
        </h3>
        <p className="text-sm text-muted-foreground">
          Prepare for your teaching sessions by outlining key points you want to cover. 
          For learning sessions, prepare specific questions to make the most of your time.
        </p>
      </div>
    </div>
  );
}

function Plus(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}