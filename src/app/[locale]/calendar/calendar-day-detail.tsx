"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, X } from "lucide-react";
import type { Session } from "./page";

export function CalendarDayDetail({
  date,
  sessions,
  onClose,
}: {
  date: string;
  sessions: Session[];
  onClose: () => void;
}) {
  const [y, m, d] = date.split("-");
  const displayDate = new Date(+y, +m - 1, +d).toLocaleDateString("en-HK", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#2D2D2D]">{displayDate}</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {sessions.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No classes on this day.</p>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => {
            const startTime = new Date(session.start_time);
            const timeStr = startTime.toLocaleTimeString("en-HK", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            });
            const spotsLeft = session.available_spots;

            return (
              <Link
                key={session.id}
                href={`/classes/${session.class_id}`}
                className="block"
              >
                <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base group-hover:text-[#7C9082] transition-colors">
                          {session.class_title}
                        </CardTitle>
                        <CardDescription>
                          {session.studio_name} · {session.style_name} ·{" "}
                          {session.class_difficulty}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={spotsLeft <= 3 ? "destructive" : "outline"}
                        className={
                          spotsLeft > 3
                            ? "text-[#7C9082] border-[#7C9082]/30 shrink-0"
                            : "shrink-0"
                        }
                      >
                        {spotsLeft <= 3 && spotsLeft > 0
                          ? `Only ${spotsLeft}!`
                          : spotsLeft === 0
                            ? "Full"
                            : `${spotsLeft} spots`}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {timeStr} · {session.class_duration} min
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {session.studio_city}
                      </span>
                      {session.class_price > 0 && (
                        <span className="font-medium text-[#7C9082]">
                          ${session.class_price}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
