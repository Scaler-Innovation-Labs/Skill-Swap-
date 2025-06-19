"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import {
  DraggableCardBody,
  DraggableCardContainer,
} from "@/components/ui/draggable-card";

export interface Teacher {
  id: string;
  name: string;
  photo: string;
  subject: string;
  badges: number;
  rating: number; // 0–5
}

interface Props {
  teachers: Teacher[];
  onDismiss: (id: string, direction: "left" | "right") => void;
}

export default function TeacherCardList({ teachers = [], onDismiss }: Props) {
  return (
    <DraggableCardContainer className="relative flex min-h-screen w-full items-center justify-center overflow-clip">
      {teachers.length === 0 ? (
        <p className="text-center text-neutral-400">No teachers to display.</p>
      ) : (
        teachers.map((teacher, index) => (
          <DraggableCardBody
            key={teacher.id}
            className="absolute"
            style={{
              top: index * 20,
              left: `calc(50% - 160px + ${index * 8}px)`,
              rotate: index % 2 === 0 ? -4 : 4,
              zIndex: teachers.length - index,
            }}
            onDragEnd={(dir: "left" | "right") => onDismiss(teacher.id, dir)}
          >
            <div className="w-80 p-6 rounded-2xl bg-neutral-900 shadow-xl select-none">
              <div className="flex items-center gap-4">
                <Image
                  src={teacher.photo}
                  alt={teacher.name}
                  width={64}
                  height={64}
                  className="rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold">{teacher.name}</h3>
                  <p className="text-sm text-muted-foreground">{teacher.subject}</p>
                  <div className="flex items-center gap-1 text-xs mt-1">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    {teacher.rating.toFixed(1)} • {teacher.badges} badges
                  </div>
                </div>
              </div>
            </div>
          </DraggableCardBody>
        ))
      )}
    </DraggableCardContainer>
  );
} 