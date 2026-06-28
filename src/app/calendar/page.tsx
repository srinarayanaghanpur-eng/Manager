"use client";

import { useMemo, useState } from "react";
import { GlassCard, PageHeader, Button, StatusBadge, Select } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { useSchool } from "@/components/SchoolProvider";
import { calendarItems as seed, schools } from "@/lib/data/seed";
import { platformColor, platformLabel, cn } from "@/lib/utils";
import type { CalendarItem } from "@/lib/types";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function CalendarPage() {
  const { activeSchool } = useSchool();
  const [items, setItems] = useState<CalendarItem[]>(seed);
  const [view, setView] = useState<"month" | "week">("month");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [cursor, setCursor] = useState(new Date("2026-06-29T00:00:00"));
  const [dragId, setDragId] = useState<string | null>(null);

  const filtered = items.filter(
    (i) =>
      (activeSchool === "all" || i.schoolId === activeSchool) &&
      (platformFilter === "all" || i.platform === platformFilter)
  );

  const days = useMemo(() => {
    if (view === "week") {
      const start = startOfWeek(cursor);
      return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
    }
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const start = startOfWeek(first);
    return Array.from({ length: 42 }).map((_, i) => addDays(start, i));
  }, [cursor, view]);

  const itemsForDay = (d: Date) =>
    filtered.filter((i) => i.date === iso(d));

  const onDrop = (d: Date) => {
    if (!dragId) return;
    setItems((prev) => prev.map((i) => (i.id === dragId ? { ...i, date: iso(d) } : i)));
    setDragId(null);
  };

  const monthLabel = cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Content Calendar"
        subtitle="Drag posts between days. Color = platform. Nothing posts automatically."
        action={
          <div className="flex items-center gap-2">
            <div className="flex rounded-xl glass p-1">
              {(["month", "week"] as const).map((v) => (
                <button key={v} onClick={() => setView(v)} className={cn("rounded-lg px-3 py-1.5 text-xs font-medium capitalize", view === v && "btn-primary")}>{v}</button>
              ))}
            </div>
            <div className="w-36"><Select value={platformFilter} onChange={setPlatformFilter} options={[{ value: "all", label: "All platforms" }, { value: "instagram", label: "Instagram" }, { value: "youtube", label: "YouTube" }, { value: "facebook", label: "Facebook" }, { value: "whatsapp", label: "WhatsApp" }]} /></div>
          </div>
        }
      />

      <GlassCard hover={false}>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold">{monthLabel}</h3>
          <div className="flex gap-2">
            <Button variant="soft" onClick={() => setCursor((c) => addDays(c, view === "week" ? -7 : -30))}>‹</Button>
            <Button variant="soft" onClick={() => setCursor(new Date("2026-06-29T00:00:00"))}>Today</Button>
            <Button variant="soft" onClick={() => setCursor((c) => addDays(c, view === "week" ? 7 : 30))}>›</Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {WEEKDAYS.map((w) => (
            <div key={w} className="pb-1 text-center text-[11px] font-semibold text-muted">{w}</div>
          ))}
          {days.map((d) => {
            const inMonth = view === "week" || d.getMonth() === cursor.getMonth();
            const dayItems = itemsForDay(d);
            return (
              <div
                key={iso(d)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onDrop(d)}
                className={cn(
                  "min-h-[92px] rounded-xl border border-white/5 p-1.5",
                  inMonth ? "bg-white/[0.03]" : "opacity-40",
                  view === "week" && "min-h-[200px]"
                )}
              >
                <div className="mb-1 text-[11px] text-muted">{d.getDate()}</div>
                <div className="space-y-1">
                  {dayItems.map((i) => (
                    <div
                      key={i.id}
                      draggable
                      onDragStart={() => setDragId(i.id)}
                      className="cursor-grab rounded-lg p-1.5 text-[10px] font-medium text-white active:cursor-grabbing"
                      style={{ background: `${platformColor(i.platform)}cc` }}
                      title={`${i.title} · ${i.status}`}
                    >
                      <p className="truncate">{i.title}</p>
                      <p className="opacity-80">{platformLabel(i.platform)}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* Upcoming list */}
      <GlassCard hover={false}>
        <h3 className="mb-3 font-semibold">Planned Posts</h3>
        <div className="space-y-2">
          {filtered.map((i) => {
            const s = schools.find((x) => x.id === i.schoolId);
            return (
              <div key={i.id} className="flex items-center gap-3 rounded-xl glass p-2.5">
                <span className="h-8 w-1 rounded-full" style={{ background: platformColor(i.platform) }} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{i.title}</p>
                  <p className="text-[11px] text-muted">{i.date} · {platformLabel(i.platform)} · {s?.branch} · {i.assignedTo}</p>
                </div>
                <StatusBadge status={i.status} />
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}

function iso(d: Date) { return d.toISOString().slice(0, 10); }
function addDays(d: Date, n: number) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
function startOfWeek(d: Date) {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7; // Monday = 0
  x.setDate(x.getDate() - day);
  x.setHours(0, 0, 0, 0);
  return x;
}
