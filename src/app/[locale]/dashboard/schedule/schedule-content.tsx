"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Plus, Trash2, Upload, Calendar as CalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSession, createSessionsBulk, deleteSession } from "@/lib/sessions/actions";

const MONTHS = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type Session = {
  id: number;
  start_time: string;
  end_time: string;
  available_spots: number;
  status: string;
  class_id: number;
  class_title: string;
  class_difficulty: string;
  class_duration: number;
  class_price: number;
  studio_name: string;
  studio_city: string;
  created_by_name: string;
};

type ClassInfo = {
  id: number;
  title: string;
  studio_id: number;
  studio_name: string;
  duration_minutes: number;
  capacity: number;
};

export function ScheduleContent({ sessions, classes }: { sessions: Session[]; classes: ClassInfo[] }) {
  const [tab, setTab] = useState<"calendar" | "add" | "bulk">("calendar");
  const [month, setMonth] = useState(7); // August
  const [year, setYear] = useState(2026);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  // Group sessions by date
  const byDate = useMemo(() => {
    const m: Record<string, Session[]> = {};
    sessions.forEach((s) => {
      const d = s.start_time.slice(0, 10);
      if (!m[d]) m[d] = [];
      m[d].push(s);
    });
    return m;
  }, [sessions]);

  const days = useMemo(() => {
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const off = first.getDay();
    const r: (number | null)[] = [];
    for (let i = 0; i < off; i++) r.push(null);
    for (let d = 1; d <= last.getDate(); d++) r.push(d);
    return r;
  }, [month, year]);

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 bg-gray-100 rounded-lg p-1 w-fit">
        {([
          ["calendar", "Calendar", CalIcon],
          ["add", "Add Session", Plus],
          ["bulk", "Bulk CSV", Upload],
        ] as const).map(([key, label, Icon]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === key ? "bg-white shadow-sm text-[#7C9082]" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-sm ${message.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {message.text}
        </div>
      )}

      {/* CALENDAR TAB */}
      {tab === "calendar" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => { setMonth(month === 0 ? 11 : month - 1); if (month === 0) setYear(year - 1); }}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-lg font-semibold">{MONTHS[month]} {year}</h2>
            <Button variant="ghost" size="icon" onClick={() => { setMonth(month === 11 ? 0 : month + 1); if (month === 11) setYear(year + 1); }}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          <div className="bg-white rounded-xl border overflow-hidden">
            <div className="grid grid-cols-7 bg-[#7C9082]/10">
              {DAY_NAMES.map((d) => (
                <div key={d} className="py-2 text-center text-xs font-medium text-[#7C9082]">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {days.map((d, i) => {
                const ds = d ? `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}` : null;
                const ss = ds ? byDate[ds] : null;
                return (
                  <button
                    key={i}
                    disabled={!d}
                    onClick={() => ds && setSelectedDate(ds === selectedDate ? null : ds)}
                    className={`min-h-[64px] p-1.5 border-b border-r border-gray-100 text-left text-sm
                      ${!d ? "bg-gray-50" : "hover:bg-[#7C9082]/5"}
                      ${ds === todayStr ? "bg-[#7C9082]/10" : ""}
                      ${ds === selectedDate ? "ring-2 ring-[#7C9082] ring-inset" : ""}
                      ${d && (!ss || ss.length === 0) ? "opacity-50" : ""}`}
                  >
                    {d && <span className={ds === todayStr ? "inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#7C9082] text-white text-xs font-semibold" : ""}>{d}</span>}
                    {ss && ss.length > 0 && (
                      <div className="mt-0.5 flex flex-wrap gap-0.5">
                        {ss.slice(0, 3).map((_, j) => <span key={j} className="w-1.5 h-1.5 rounded-full bg-[#7C9082]" />)}
                        {ss.length > 3 && <span className="text-[10px] text-[#7C9082]">+{ss.length - 3}</span>}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {selectedDate && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-HK", { weekday: "long", month: "long", day: "numeric" })}
                </CardTitle>
                <CardDescription>{(byDate[selectedDate] ?? []).length} sessions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {(byDate[selectedDate] ?? []).map((s) => {
                  const t = new Date(s.start_time).toLocaleTimeString("en-HK", { hour: "2-digit", minute: "2-digit", hour12: true });
                  return (
                    <div key={s.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{s.class_title}</p>
                        <p className="text-xs text-gray-500">
                          {s.studio_name} · {t} · {s.class_duration}min · {s.available_spots} spots
                          {s.created_by_name && <span className="ml-1">· by {s.created_by_name}</span>}
                        </p>
                      </div>
                      <form action={async () => {
                        const r = await deleteSession(s.id);
                        setMessage(r.error ? { text: r.error, ok: false } : { text: "Deleted", ok: true });
                      }}>
                        <Button variant="ghost" size="icon" type="submit" className="text-red-400 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* ADD TAB */}
      {tab === "add" && (
        <Card>
          <CardHeader>
            <CardTitle>Add a Session</CardTitle>
            <CardDescription>Pick a class, date, and time</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={async (fd) => {
              const r = await createSession(fd);
              setMessage(r.error ? { text: r.error, ok: false } : { text: "Session created!", ok: true });
            }} className="space-y-4 max-w-md">
              <div>
                <Label htmlFor="classId">Class</Label>
                <select id="classId" name="classId" required className="flex h-10 w-full rounded-md border px-3 py-2 text-sm bg-white">
                  <option value="">Select class...</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>{c.title} ({c.studio_name})</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input id="date" name="date" type="date" required min="2026-08-07" />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input id="time" name="time" type="time" required />
              </div>
              <div>
                <Label htmlFor="spots">Available Spots (defaults to class capacity)</Label>
                <Input id="spots" name="spots" type="number" min="1" max="100" />
              </div>
              <Button type="submit" className="bg-[#7C9082] hover:bg-[#6B7D71]">
                <Plus className="h-4 w-4 mr-1" /> Create Session
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* BULK TAB */}
      {tab === "bulk" && (
        <Card>
          <CardHeader>
            <CardTitle>Bulk Upload (CSV)</CardTitle>
            <CardDescription>
              Upload multiple sessions at once. CSV format: <code className="bg-gray-100 px-1 rounded">class,date,time,spots</code>
              <br />Example: <code className="bg-gray-100 px-1 rounded">Hot Vinyasa,2026-08-15,09:00,15</code>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="text-sm font-medium mb-1">Your classes:</p>
              <div className="flex flex-wrap gap-2">
                {classes.map((c) => (
                  <Badge key={c.id} variant="outline" className="text-xs">{c.title}</Badge>
                ))}
              </div>
            </div>
            <form action={async (fd) => {
              const r = await createSessionsBulk(fd);
              setMessage({ text: r.message ?? (r.error ?? "Done"), ok: !r.error });
            }} className="space-y-4 max-w-md">
              <div>
                <Label htmlFor="csv">Paste CSV</Label>
                <textarea
                  id="csv"
                  name="csv"
                  rows={8}
                  required
                  placeholder={`class,date,time,spots\nHot Vinyasa,2026-08-10,09:00,15\nZen Flow,2026-08-11,18:00,20`}
                  className="flex w-full rounded-md border px-3 py-2 text-sm font-mono bg-white"
                />
              </div>
              <Button type="submit" className="bg-[#7C9082] hover:bg-[#6B7D71]">
                <Upload className="h-4 w-4 mr-1" /> Upload Sessions
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
