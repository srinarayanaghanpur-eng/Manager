"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PageHeader, Button, Field, Select } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { agents, agentCategories } from "@/lib/data/agents";
import { schools } from "@/lib/data/seed";
import { runAgent, type AgentRunInput } from "@/lib/ai/runAgent";
import { copyToClipboard, downloadText } from "@/lib/utils";
import type { AgentDef, AgentField } from "@/lib/types";

const platformOptions = [
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "facebook", label: "Facebook" },
  { value: "whatsapp", label: "WhatsApp" },
];

// Build the initial value map for an agent from its field defaults.
function initialValues(agent: AgentDef, schoolId: string): Record<string, string> {
  const v: Record<string, string> = {};
  for (const f of agent.fields) {
    if (f.type === "school") v[f.key] = schoolId;
    else if (f.type === "platform") v[f.key] = f.default ?? "instagram";
    else v[f.key] = f.default ?? "";
  }
  return v;
}

export default function AIAgentsPage() {
  const [category, setCategory] = useState("all");
  const [active, setActive] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const activeAgent = agents.find((a) => a.id === active) ?? null;
  const visible = useMemo(
    () => (category === "all" ? agents : agents.filter((a) => a.category === category)),
    [category]
  );

  const open = (agent: AgentDef) => {
    setActive(agent.id);
    setValues(initialValues(agent, schools[0].id));
    setOutput("");
    setSaved(false);
  };

  const setVal = (key: string, value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const run = async () => {
    if (!activeAgent) return;
    setLoading(true);
    setOutput("");
    setSaved(false);
    const schoolId = values.school || schools[0].id;
    const school = schools.find((s) => s.id === schoolId)!;
    const input: AgentRunInput = {
      schoolName: `${school.name} (${school.branch})`,
      schoolShort: school.name,
      branch: school.branch,
      schoolId,
      followers: school.followers.instagram,
      values,
    };
    const [text] = await Promise.all([
      runAgent(activeAgent.id, input),
      new Promise((r) => setTimeout(r, 600)), // let the loading animation breathe
    ]);
    setOutput(text);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Agents"
        subtitle={`${agents.length} automated assistants. Every output is a draft — nothing posts without admin approval.`}
      />

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {agentCategories.map((c) => {
          const on = category === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className="relative rounded-full px-4 py-1.5 text-sm font-medium transition"
            >
              {on && (
                <motion.span
                  layoutId="cat-pill"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-500 to-purple-500"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className={on ? "relative z-10 text-white" : "relative z-10 text-muted hover:text-current"}>
                {c.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Agent grid */}
      <motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {visible.map((a, i) => (
            <motion.button
              key={a.id}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.03, type: "spring", stiffness: 300, damping: 26 }}
              onClick={() => open(a)}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="glass group relative overflow-hidden rounded-2xl p-5 text-left"
            >
              {/* hover glow */}
              <span
                className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-40"
                style={{ background: a.accent }}
              />
              <div className="flex items-start justify-between">
                <div
                  className="grid h-11 w-11 place-items-center rounded-xl"
                  style={{ background: `${a.accent}22`, color: a.accent }}
                >
                  <Icon name={a.icon} className="h-5 w-5" />
                </div>
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                  style={{ background: `${a.accent}1a`, color: a.accent }}
                >
                  {a.category}
                </span>
              </div>
              <h3 className="mt-3 font-semibold leading-tight">{a.name}</h3>
              <p className="mt-1 text-xs text-muted">{a.tagline}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {a.outputs.slice(0, 4).map((o) => (
                  <span key={o} className="rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] text-muted ring-1 ring-white/10">
                    {o}
                  </span>
                ))}
              </div>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-brand-400">
                Run agent <Icon name="ChevronRight" className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </span>
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Drawer */}
      <AnimatePresence>
        {activeAgent && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActive(null)}
            />
            <motion.div
              className="glass-strong fixed inset-x-0 bottom-0 z-50 max-h-[90vh] overflow-y-auto rounded-t-3xl border-t border-white/15 p-5 sm:inset-y-0 sm:right-0 sm:left-auto sm:w-[520px] sm:max-h-full sm:rounded-l-3xl sm:rounded-tr-none"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 280 }}
            >
              {/* Header */}
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-xl"
                    style={{ background: `${activeAgent.accent}22`, color: activeAgent.accent }}
                  >
                    <Icon name={activeAgent.icon} className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-bold leading-tight">{activeAgent.name}</h2>
                    <p className="mt-0.5 text-xs text-muted">{activeAgent.description}</p>
                  </div>
                </div>
                <button onClick={() => setActive(null)} className="rounded-lg p-2 hover:bg-white/10">
                  <Icon name="X" className="h-4 w-4" />
                </button>
              </div>

              {/* Dynamic inputs */}
              <div className="grid grid-cols-2 gap-3">
                {activeAgent.fields.map((f) => (
                  <div key={f.key} className={f.full || f.type === "textarea" ? "col-span-2" : ""}>
                    <FieldInput field={f} value={values[f.key] ?? ""} onChange={(v) => setVal(f.key, v)} />
                  </div>
                ))}
              </div>

              <Button onClick={run} disabled={loading} className="mt-4 w-full">
                <Icon name="Sparkles" className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
                {loading ? "Generating…" : output ? "Regenerate" : "Generate"}
              </Button>

              {/* Loading skeleton */}
              <AnimatePresence>
                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 space-y-2"
                  >
                    {[90, 70, 80, 55, 75].map((w, i) => (
                      <div
                        key={i}
                        className="relative h-3 overflow-hidden rounded-full bg-white/10"
                        style={{ width: `${w}%` }}
                      >
                        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent" style={{ animation: "shimmer 1.4s infinite" }} />
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Output */}
              <AnimatePresence>
                {output && !loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4"
                  >
                    <OutputView text={output} accent={activeAgent.accent} />

                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        variant="soft"
                        onClick={async () => {
                          await copyToClipboard(output);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 1500);
                        }}
                      >
                        <Icon name="Copy" className="h-4 w-4" /> {copied ? "Copied!" : "Copy"}
                      </Button>
                      <Button variant="soft" onClick={run}>
                        <Icon name="Sparkles" className="h-4 w-4" /> Regenerate
                      </Button>
                      <Button variant="soft" onClick={() => downloadText(`${activeAgent.id}.txt`, output)}>
                        <Icon name="Download" className="h-4 w-4" /> Save
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => {
                          setSaved(true);
                          setTimeout(() => setSaved(false), 1800);
                        }}
                      >
                        <Icon name="CalendarDays" className="h-4 w-4" /> {saved ? "Added ✓" : "Add to Calendar"}
                      </Button>
                    </div>
                    <p className="mt-2 text-[11px] text-muted">
                      Adding creates a Draft idea on the calendar. It still needs admin approval before posting.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Field renderer ──────────────────────────────────────────────────────────
function FieldInput({
  field,
  value,
  onChange,
}: {
  field: AgentField;
  value: string;
  onChange: (v: string) => void;
}) {
  if (field.type === "school") {
    return (
      <Field label={field.label}>
        <Select value={value} onChange={onChange} options={schools.map((s) => ({ value: s.id, label: s.name }))} />
      </Field>
    );
  }
  if (field.type === "platform") {
    return (
      <Field label={field.label}>
        <Select value={value} onChange={onChange} options={platformOptions} />
      </Field>
    );
  }
  if (field.type === "select") {
    return (
      <Field label={field.label}>
        <Select value={value} onChange={onChange} options={field.options ?? []} />
      </Field>
    );
  }
  if (field.type === "textarea") {
    return (
      <Field label={field.label}>
        <textarea
          className="min-h-[76px] w-full resize-y px-3 py-2 text-sm outline-none focus:ring-2"
          placeholder={field.placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </Field>
    );
  }
  return (
    <Field label={field.label}>
      <input
        className="w-full px-3 py-2 text-sm outline-none focus:ring-2"
        placeholder={field.placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}

// ── Output renderer ─────────────────────────────────────────────────────────
// Splits the text into blocks (blank-line separated). The first line of each
// block is treated as a heading, the rest as body — works for every agent.
function OutputView({ text, accent }: { text: string; accent: string }) {
  const blocks = text.split(/\n\n+/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className="space-y-2.5 rounded-2xl border border-white/10 bg-black/20 p-4">
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        const [title, ...body] = lines;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <p className="text-[13px] font-semibold" style={{ color: accent }}>
              {title}
            </p>
            {body.length > 0 && (
              <pre className="mt-0.5 whitespace-pre-wrap break-words font-sans text-[13px] leading-relaxed text-current/90">
                {body.join("\n")}
              </pre>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
