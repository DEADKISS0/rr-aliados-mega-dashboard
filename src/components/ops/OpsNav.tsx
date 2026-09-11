import Link from "next/link";

const links = [
  ["Finanzas", "/ops/finanzas"],
  ["Clientes", "/ops/clientes"],
  ["Desarrollos", "/ops/desarrollos"],
] as const;

export default function OpsNav({ active }: { active: (typeof links)[number][0] }) {
  return (
    <nav aria-label="Navegación interna" className="flex items-center gap-1 overflow-x-auto rounded-2xl border border-white/10 bg-black/20 p-1">
      {links.map(([label, href]) => (
        <Link key={href} href={href} className={`whitespace-nowrap rounded-xl px-3 py-2 text-xs font-bold transition ${active === label ? "bg-[#BE076D] text-[#FFFFF3] shadow-lg shadow-[#BE076D]/20" : "text-[#D2C7D0] hover:bg-white/10 hover:text-[#FFFFF3]"}`}>
          {label}
        </Link>
      ))}
    </nav>
  );
}
