import React, { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  detail?: string;
  trend?: string;
  glowColor?: string;
  onClick?: () => void;
}

export function StatCard({
  label,
  value,
  icon,
  detail,
  trend,
  onClick,
}: StatCardProps) {
  return (
    <div
      onClick={onClick}
      className={`p-6 rounded-3xl bg-secondary/70 border border-white/10 hover:border-accent/40 transition-all duration-300 relative overflow-hidden group shadow-lg ${
        onClick ? "cursor-pointer hover:bg-secondary/90" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">
            {label}
          </p>
          <h3 className="text-2xl sm:text-3xl font-display font-bold text-text-pure tracking-tight group-hover:text-accent transition-colors">
            {value}
          </h3>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-accent/15 flex items-center justify-center text-accent group-hover:scale-110 transition-transform shrink-0 border border-accent/20">
          {icon}
        </div>
      </div>

      {(detail || trend) && (
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-text-soft">
          <span>{detail}</span>
          {trend && <span className="text-accent font-semibold">{trend}</span>}
        </div>
      )}
    </div>
  );
}
