"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Edit2, Trash2, Star } from "lucide-react";
import { Progress } from "../ui/progress";

// Sample data
const teachingSkills = [
  { id: 1, name: "Excel Formulas", proficiency: 90, sessions: 12, rating: 4.8 },
  { id: 2, name: "Data Analysis", proficiency: 85, sessions: 8, rating: 4.6 },
  { id: 3, name: "PowerPoint Presentations", proficiency: 95, sessions: 15, rating: 4.9 }
];

const learningSkills = [
  { id: 1, name: "Photoshop Basics", progress: 65 },
  { id: 2, name: "UX Design", progress: 40 },
  { id: 3, name: "Public Speaking", progress: 25 }
];

export function SkillsOverview() {
  const [isAddingTeachingSkill, setIsAddingTeachingSkill] = useState(false);
  const [isAddingLearningSkill, setIsAddingLearningSkill] = useState(false);
  
  return (
    <div className="space-y-8">
      {/* Teaching Skills */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold tracking-tight">Skills I Can Teach</h2>
          <Dialog open={isAddingTeachingSkill} onOpenChange={setIsAddingTeachingSkill}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <PlusCircle className="h-4 w-4" />
                Add Skill
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Teaching Skill</DialogTitle>
                <DialogDescription>
                  Add a skill you can teach to others on the platform.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="skill-name">Skill Name</Label>
                  <Input id="skill-name" placeholder="e.g., JavaScript Programming" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skill-proficiency">Proficiency Level (1-100)</Label>
                  <Input id="skill-proficiency" type="number" min="1" max="100" placeholder="85" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skill-description">Brief Description</Label>
                  <Input id="skill-description" placeholder="What aspects of this skill can you teach?" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingTeachingSkill(false)}>Cancel</Button>
                <Button onClick={() => setIsAddingTeachingSkill(false)}>Add Skill</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teachingSkills.map((skill) => (
            <Card key={skill.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{skill.name}</CardTitle>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  Proficiency Level
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-2">
                  <Progress value={skill.proficiency} className="h-2" />
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    <span>{skill.rating}/5.0</span>
                  </div>
                  <Badge variant="outline">{skill.sessions} Sessions</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      
      {/* Learning Skills */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold tracking-tight">Skills I Want to Learn</h2>
          <Dialog open={isAddingLearningSkill} onOpenChange={setIsAddingLearningSkill}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <PlusCircle className="h-4 w-4" />
                Add Skill
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Learning Skill</DialogTitle>
                <DialogDescription>
                  Add a skill you want to learn from others.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="learning-skill-name">Skill Name</Label>
                  <Input id="learning-skill-name" placeholder="e.g., French Language" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="learning-skill-level">Current Level</Label>
                  <select id="learning-skill-level" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="learning-skill-goals">Learning Goals</Label>
                  <Input id="learning-skill-goals" placeholder="What do you want to achieve?" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingLearningSkill(false)}>Cancel</Button>
                <Button onClick={() => setIsAddingLearningSkill(false)}>Add Skill</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {learningSkills.map((skill) => (
            <Card key={skill.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{skill.name}</CardTitle>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  Learning Progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-2">
                  <Progress value={skill.progress} className="h-2" />
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">{skill.progress}% Complete</span>
                  <Button variant="ghost" className="h-8 px-2 text-xs">Find Teachers</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}