"use client";

import { useState } from "react";
import ReportViewer from "@/components/ui/ReportViewer";

export interface ReportEntry {
  date: string;
  label?: string;
  pdf: string;
  excel: string;
  summary?: Record<string, string | number | undefined>;
}

interface ReportHistorySelectorProps {
  reports: ReportEntry[];
  /** Max number of reports to show in history selector */
  maxItems?: number;
  /** Label prefix for the variant (e.g. "Predicciones", "Estratégico") */
  variantName: string;
  /** Current selected report (defaults to first) */
  selectedIndex?: number;
  /** Called when user selects a different report version */
  onSelect?: (report: ReportEntry, index: number) => void;
  /** Render a summary strip for the selected report (optional) */
  renderSummary?: (report: ReportEntry) => React.ReactNode;
}

export default function ReportHistorySelector({
  reports,
  maxItems = 5,
  variantName,
  selectedIndex: controlledIndex,
  onSelect,
  renderSummary,
}: ReportHistorySelectorProps) {
  const [localIndex, setLocalIndex] = useState(0);
  const isControlled = controlledIndex !== undefined;
  const idx = isControlled ? controlledIndex : localIndex;
  const displayReports = reports.slice(0, maxItems);
  const selected = displayReports[idx] ?? null;

  if (reports.length === 0) return null;

  const handleSelect = (newIdx: number) => {
    if (!isControlled) setLocalIndex(newIdx);
    onSelect?.(displayReports[newIdx], newIdx);
  };

  return (
    <div className="space-y-3">
      {/* Version selector — like the apps grid deep-links */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-mono-label text-[10px]" style={{ color: "var(--text-muted)" }}>
          Versiones:
        </span>
        <div className="flex flex-wrap gap-1">
          {displayReports.map((r, i) => (
            <button
              key={r.date}
              onClick={() => handleSelect(i)}
              className={`!py-1 !px-2 text-[10px] rounded-md transition-all ${
                i === idx
                  ? "btn-primary"
                  : "btn-ghost"
              }`}
              style={i === idx ? {} : { color: "var(--text-muted)" }}
              title={r.label || r.date}
            >
              {r.label || `#${i + 1}`}
            </button>
          ))}
        </div>
        {reports.length > maxItems && (
          <span className="font-mono-label text-[10px]" style={{ color: "var(--ash)" }}>
            +{reports.length - maxItems} más
          </span>
        )}
      </div>

      {/* Summary strip for selected report */}
      {selected && renderSummary && (
        <div className="px-1">
          {renderSummary(selected)}
        </div>
      )}

      {/* PDF preview for selected report — matches EcosystemAppsGrid pattern */}
      {selected && (
        <ReportViewer
          key={selected.date}
          pdf={selected.pdf}
          excel={selected.excel}
          title={`${variantName} ${selected.label || selected.date}`}
          defaultOpen={true}
        />
      )}
    </div>
  );
}
