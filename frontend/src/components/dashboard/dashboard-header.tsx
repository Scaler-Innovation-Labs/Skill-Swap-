"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Calendar, MessageSquare, Plus, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function DashboardHeader() {
  const [notifications, setNotifications] = useState(3);
  
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your skill exchanges and learning journey
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-destructive">
                {notifications}
              </Badge>
            )}
          </Button>
          
          <Button variant="outline" size="icon">
            <MessageSquare className="h-5 w-5" />
          </Button>
          
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            <span>New Session</span>
          </Button>
        </div>
      </div>
      
      <Card className="mt-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <Avatar className="h-20 w-20 border-4 border-primary/10">
              <AvatarImage src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="User" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold">Welcome back, John!</h2>
              <p className="text-muted-foreground">
                You have 2 upcoming sessions scheduled for this week.
              </p>
            </div>
            
            <div className="ml-auto hidden md:block">
              <Button variant="outline" className="gap-2">
                <Calendar className="h-4 w-4" />
                <span>View Schedule</span>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <StatCard 
              label="Hours Learned"
              value="12.5"
              trend="+2.5 this week"
              trendUp={true}
            />
            
            <StatCard 
              label="Hours Taught" 
              value="8.0"
              trend="+1.0 this week"
              trendUp={true}
            />
            
            <StatCard 
              label="Skill Rating"
              value="4.8/5.0"
              trend="Top 10%"
              trendUp={true}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ label, value, trend, trendUp }: { label: string, value: string, trend: string, trendUp: boolean }) {
  return (
    <div className="bg-muted/40 p-4 rounded-lg">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
      <p className={`text-xs mt-1 flex items-center ${trendUp ? 'text-green-600 dark:text-green-500' : 'text-destructive'}`}>
        {trendUp ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
        {trend}
      </p>
    </div>
  );
}