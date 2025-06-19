import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { DraggableCardBody, DraggableCardContainer } from "@/components/ui/draggable-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import "react-day-picker/style.css";

const timeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
];

export default function SessionScheduler() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  return (
    <div className="flex flex-col lg:flex-row gap-10 items-start w-full">
      {/* Draggable session card */}
      <DraggableCardContainer className="mx-auto lg:mx-0">
        <DraggableCardBody>
          <h3 className="text-xl font-semibold mb-2">🎸 Guitar Masterclass</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Teacher: <span className="font-medium">Alice Doe</span>
          </p>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Date:</span>{" "}
              {selectedDate ? selectedDate.toDateString() : "—"}
            </p>
            <p>
              <span className="font-medium">Time:</span> {selectedTime || "—"}
            </p>
          </div>
        </DraggableCardBody>
      </DraggableCardContainer>

      {/* Scheduler controls */}
      <div className="flex flex-col gap-8">
        {/* Calendar */}
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => setSelectedDate(date)}
          className="rounded-md border shadow"
        />

        {/* Time slots */}
        <div>
          <h4 className="font-semibold mb-2">Pick a time slot</h4>
          <div className="grid grid-cols-3 gap-2 max-w-xs">
            {timeSlots.map((slot) => (
              <button
                key={slot}
                onClick={() => setSelectedTime(slot)}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium rounded-md transition-all",
                  selectedTime === slot
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105"
                    : "bg-muted hover:bg-purple-600 hover:text-white hover:shadow-md"
                )}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        {/* Confirm button */}
        <button
          disabled={!selectedDate || !selectedTime}
          className="group relative inline-flex items-center justify-center overflow-hidden rounded-full p-[2px] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="absolute inset-0 h-full w-full bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 group-hover:from-indigo-600 group-hover:via-purple-600 group-hover:to-fuchsia-600 transition-all blur-xl group-hover:blur-none"></span>
          <span className="relative rounded-full bg-black px-6 py-3 text-sm font-semibold text-white group-hover:bg-transparent transition-colors">
            {selectedDate && selectedTime ? "Schedule Session" : "Select date & time"}
          </span>
        </button>
      </div>
    </div>
  );
} 