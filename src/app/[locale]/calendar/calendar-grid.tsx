"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CalendarDayDetail } from "./calendar-day-detail";
import type { Session } from "./page";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarGrid({ sessions }: { sessions: Session[] }) {
  const [currentMonth, setCurrentMonth] = useState(7); // August
  const [currentYear, setCurrentYear] = useState(2026);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Group sessions by date (YYYY-MM-DD)
  const sessionsByDate = useMemo(() => {
    const map: Record<string, Session[]> = {};
    sessions.forEach((s) => {
      const date = s.start_time.slice(0, 10);
      if (!map[date]) map[date] = [];
      map[date].push(s);
    });
    return map;
  }, [sessions]);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDate(null);
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDate(null);
  };

  // Build calendar grid
  const days = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startOffset = firstDay.getDay();

    const result: (number | null)[] = [];
    for (let i = 0; i < startOffset; i++) result.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) result.push(d);
    return result;
  }, [currentMonth, currentYear]);

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  return (
    <div className="space-y-6">
      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={prevMonth}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-xl font-semibold text-[#2D2D2D]">
          {MONTH_NAMES[currentMonth]} {currentYear}
        </h2>
        <Button variant="ghost" size="icon" onClick={nextMonth}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 bg-[#7C9082]/10">
          {DAY_NAMES.map((day) => (
            <div
              key={day}
              className="py-3 text-center text-sm font-medium text-[#7C9082]"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7">
          {days.map((day, i) => {
            const dateStr = day
              ? `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
              : null;
            const daySessions = dateStr ? sessionsByDate[dateStr] : null;
            const isToday = dateStr === todayStr;
            const isSelected = dateStr === selectedDate;

            return (
              <button
                key={i}
                disabled={!day}
                onClick={() => dateStr && setSelectedDate(dateStr)}
                className={`
                  min-h-[72px] p-2 border-b border-r border-gray-100 text-left
                  transition-colors
                  ${!day ? "bg-gray-50" : "hover:bg-[#7C9082]/5 cursor-pointer"}
                  ${isToday ? "bg-[#7C9082]/10" : ""}
                  ${isSelected ? "ring-2 ring-[#7C9082] ring-inset" : ""}
                  ${day && (!daySessions || daySessions.length === 0) ? "opacity-40" : ""}
                `}
              >
                {day && (
                  <>
                    <span
                      className={`
                        inline-flex items-center justify-center w-7 h-7 rounded-full text-sm
                        ${isToday ? "bg-[#7C9082] text-white font-semibold" : "text-gray-700"}
                      `}
                    >
                      {day}
                    </span>
                    {daySessions && daySessions.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-0.5">
                        {daySessions.slice(0, 3).map((_, j) => (
                          <span
                            key={j}
                            className="w-1.5 h-1.5 rounded-full bg-[#7C9082]"
                          />
                        ))}
                        {daySessions.length > 3 && (
                          <span className="text-[10px] text-[#7C9082] ml-0.5 leading-none">
                            +{daySessions.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Detail */}
      {selectedDate && (
        <CalendarDayDetail
          date={selectedDate}
          sessions={sessionsByDate[selectedDate] ?? []}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  );
}
