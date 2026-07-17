"use client";

interface ReportOption {
  date: string;
  label?: string;
}

interface ReportSelectorProps {
  reports: ReportOption[];
  selectedDate: string | null;
  onSelect: (index: number) => void;
  maxRecent?: number;
}

export default function ReportSelector({
  reports,
  selectedDate,
  onSelect,
  maxRecent = 3,
}: ReportSelectorProps) {
  if (reports.length === 0) return null;

  const recent = reports.slice(0, maxRecent);
  const archived = reports.slice(maxRecent);
  const selectedIndex = reports.findIndex((r) => r.date === selectedDate);

  return (
    <div className="mb-3 space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        {recent.map((r, i) => (
          <button
            key={r.date}
            onClick={() => onSelect(i)}
            className="text-xs px-2.5 py-1.5 rounded-md transition-colors font-mono-label"
            style={{
              background: selectedIndex === i ? "var(--ember)" : "var(--bg-secondary)",
              color: selectedIndex === i ? "var(--parchment)" : "var(--text-secondary)",
              border: `1px solid ${selectedIndex === i ? "var(--ember)" : "var(--border-subtle)"}`,
            }}
          >
            {r.label || r.date}
          </button>
        ))}
        {archived.length > 0 && (
          <span className="font-mono-label" style={{ color: "var(--text-muted)" }}>
            +{archived.length} archivados
          </span>
        )}
      </div>

      {reports.length > 1 && (
        <select
          value={selectedIndex >= 0 ? String(selectedIndex) : "0"}
          onChange={(e) => onSelect(Number(e.target.value))}
          className="input-dark w-full text-xs"
          aria-label="Seleccionar reporte"
        >
          {recent.length > 0 && (
            <optgroup label="Recientes">
              {recent.map((r, i) => (
                <option key={r.date} value={i}>
                  {r.label || r.date}
                </option>
              ))}
            </optgroup>
          )}
          {archived.length > 0 && (
            <optgroup label="Archivo">
              {archived.map((r, i) => (
                <option key={r.date} value={i + maxRecent}>
                  {r.label || r.date}
                </option>
              ))}
            </optgroup>
          )}
        </select>
      )}
    </div>
  );
}
