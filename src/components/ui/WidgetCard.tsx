import { ReactNode } from "react";

interface WidgetCardProps {
  children: ReactNode;
  className?: string;
  id?: string;
  title?: string;
  icon?: string;
  badge?: string;
  badgeVariant?: "active" | "support" | "demo" | "heuristic" | "context";
  action?: ReactNode;
}

export function WidgetCardHeader({
  title,
  icon,
  badge,
  badgeVariant = "support",
  action,
}: Pick<WidgetCardProps, "title" | "icon" | "badge" | "badgeVariant" | "action">) {
  if (!title) return null;
  return (
    <div className="flex items-center gap-2 mb-3">
      {icon && <span className="text-lg">{icon}</span>}
      <h3 className="font-display text-sm tracking-wide" style={{ color: "var(--text-primary)" }}>
        {title}
      </h3>
      {badge && <span className={`skill-badge ${badgeVariant}`}>{badge}</span>}
      {action && <div className="ml-auto">{action}</div>}
    </div>
  );
}

export default function WidgetCard({
  children,
  className = "",
  id,
  title,
  icon,
  badge,
  badgeVariant,
  action,
}: WidgetCardProps) {
  return (
    <div id={id} className={`card p-4 animate-in h-full report-card ${className}`}>
      <WidgetCardHeader
        title={title}
        icon={icon}
        badge={badge}
        badgeVariant={badgeVariant}
        action={action}
      />
      {children}
    </div>
  );
}
