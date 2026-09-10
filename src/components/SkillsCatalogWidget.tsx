"use client";
import { useState, useMemo } from "react";
import { SKILLS_CATALOG, GROUPS, STATS, type SkillStatus, type SkillCategory } from "@/data/skillsCatalog";

export default function SkillsCatalogWidget() {
  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<SkillStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<SkillCategory | "all">("all");
  const [showFull, setShowFull] = useState(false);

  const filtered = useMemo(() => {
    return SKILLS_CATALOG.filter(s => {
      if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.description.toLowerCase().includes(search.toLowerCase())) return false;
      if (groupFilter !== "all" && s.group !== groupFilter) return false;
      if (statusFilter !== "all" && s.status !== statusFilter) return false;
      if (categoryFilter !== "all" && s.category !== categoryFilter) return false;
      return true;
    });
  }, [search, groupFilter, statusFilter, categoryFilter]);

  const displayed = showFull ? filtered : filtered.slice(0, 20);

  return (
    <div className="card p-4 animate-in">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">📚</span>
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Catálogo Completo de Skills</h3>
        <span className="skill-badge active">{STATS.total} skills</span>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="p-2 rounded text-center" style={{background:"var(--bg-secondary)"}}>
          <div className="text-lg font-bold" style={{color:"var(--success)"}}>{STATS.installed}</div>
          <div className="text-[10px]" style={{color:"var(--text-muted)"}}>INSTALADAS</div>
        </div>
        <div className="p-2 rounded text-center" style={{background:"var(--bg-secondary)"}}>
          <div className="text-lg font-bold" style={{color:"var(--accent)"}}>{STATS.available}</div>
          <div className="text-[10px]" style={{color:"var(--text-muted)"}}>DISPONIBLES</div>
        </div>
        <div className="p-2 rounded text-center" style={{background:"var(--bg-secondary)"}}>
          <div className="text-lg font-bold" style={{color:"var(--text-primary)"}}>{STATS.total}</div>
          <div className="text-[10px]" style={{color:"var(--text-muted)"}}>TOTAL</div>
        </div>
      </div>

      <input className="input-dark w-full mb-2" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar skill por nombre o descripción..." />

      <div className="flex gap-2 mb-3 flex-wrap">
        <select className="input-dark text-xs" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as SkillStatus | "all")}>
          <option value="all">Todos los estados</option>
          <option value="installed">Instaladas</option>
          <option value="available">Disponibles</option>
        </select>
        <select className="input-dark text-xs" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value as SkillCategory | "all")}>
          <option value="all">Todas las categorías</option>
          <option value="CREADA">CREADAS</option>
          <option value="USER">USER</option>
          <option value="NATIVA">NATIVAS</option>
        </select>
        <select className="input-dark text-xs" value={groupFilter} onChange={(e) => setGroupFilter(e.target.value)}>
          <option value="all">Todos los grupos</option>
          {GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      <div className="text-xs mb-2" style={{color:"var(--text-muted)"}}>
        Mostrando {displayed.length} de {filtered.length} skills
      </div>

      <div className="space-y-1 max-h-80 overflow-y-auto">
        {displayed.map((s, i) => (
          <div key={i} className="flex items-center gap-2 p-2 rounded text-xs" style={{background:"var(--bg-secondary)"}}>
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${s.status === "installed" ? "bg-green-500" : "bg-gray-500"}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold truncate" style={{color:"var(--text-primary)"}}>{s.name}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded flex-shrink-0" style={{
                  background: s.category === "CREADA" ? "rgba(139,92,246,0.2)" : s.category === "USER" ? "rgba(59,130,246,0.2)" : "rgba(100,116,139,0.2)",
                  color: s.category === "CREADA" ? "#a78bfa" : s.category === "USER" ? "#60a5fa" : "#94a3b8"
                }}>{s.category}</span>
              </div>
              <div className="text-[11px] truncate" style={{color:"var(--text-muted)"}}>{s.description}</div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length > 20 && !showFull && (
        <button className="btn-primary w-full mt-2 text-xs" onClick={() => setShowFull(true)}>
          Ver todas ({filtered.length})
        </button>
      )}
      {showFull && filtered.length > 20 && (
        <button className="btn-primary w-full mt-2 text-xs" onClick={() => setShowFull(false)}>
          Ver menos
        </button>
      )}
    </div>
  );
}
