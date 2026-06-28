"use client";

import { motion } from "framer-motion";
import { cn, prettyLabel, statusColor } from "@/lib/utils";

export function GlassCard({
  children,
  className,
  hover = true,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      whileHover={hover ? { y: -3 } : undefined}
      className={cn("glass rounded-2xl p-5", className)}
    >
      {children}
    </motion.div>
  );
}

export function StatCard({
  label,
  value,
  sub,
  icon,
  accent = "#3563ff",
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon?: React.ReactNode;
  accent?: string;
}) {
  return (
    <GlassCard className="relative overflow-hidden">
      <div
        className="absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-30 blur-2xl"
        style={{ background: accent }}
      />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
          <p className="mt-1 text-2xl font-bold">{value}</p>
          {sub && <p className="mt-1 text-xs text-muted">{sub}</p>}
        </div>
        {icon && (
          <div
            className="grid h-10 w-10 place-items-center rounded-xl"
            style={{ background: `${accent}22`, color: accent }}
          >
            {icon}
          </div>
        )}
      </div>
    </GlassCard>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const color = statusColor(status);
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ background: `${color}22`, color }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      {prettyLabel(status)}
    </span>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">
          <span className="gradient-text">{title}</span>
        </h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Button({
  children,
  onClick,
  variant = "primary",
  disabled,
  className,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "soft";
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
}) {
  const styles =
    variant === "primary"
      ? "btn-primary"
      : variant === "soft"
      ? "glass hover:brightness-110"
      : "hover:bg-white/10";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
        styles,
        className
      )}
    >
      {children}
    </button>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted">{label}</span>
      {children}
    </label>
  );
}

export function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 text-sm outline-none focus:ring-2"
      style={{ boxShadow: "none" }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} className="bg-slate-900 text-white">
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function ConsentWarning({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-xl border border-amber-400/40 bg-amber-400/10 p-3 text-xs text-amber-300">
      <span>⚠️</span>
      <p>{children ?? "Child safety: confirm signed parent consent before using student photos/videos in any public post."}</p>
    </div>
  );
}
