"use client";
import { useState } from "react";

export default function SkillsHubPopup() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <div className="card p-4 animate-in">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🌐</span>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>RR Skills Hub</h3>
          <span className="skill-badge support">Online</span>
        </div>
        <p className="text-xs mb-3" style={{color:"var(--text-secondary)"}}>
          Catálogo completo de skills del ecosistema RR. Explora, descubre e instala nuevas skills directamente desde el hub.
        </p>
        <div className="flex gap-2">
          <button className="btn-primary flex-1" onClick={() => setShowPopup(true)}>
            Abrir en Popup
          </button>
          <a
            href="https://rr-skills-hub.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex-1 text-center"
            style={{background:"var(--bg-secondary)", color:"var(--text-primary)"}}
          >
            Abrir en Nueva Pestaña ↗
          </a>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:"rgba(0,0,0,0.8)"}}>
          <div className="w-full max-w-6xl h-[80vh] rounded-lg overflow-hidden flex flex-col" style={{background:"var(--bg-card)", border:"1px solid var(--border)"}}>
            <div className="flex items-center justify-between p-3 border-b" style={{borderColor:"var(--border)"}}>
              <div className="flex items-center gap-2">
                <span className="text-lg">🌐</span>
                <span className="text-sm font-semibold" style={{color:"var(--text-primary)"}}>RR Skills Hub</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="https://rr-skills-hub.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-3 py-1 rounded"
                  style={{background:"var(--bg-secondary)", color:"var(--text-secondary)"}}
                >
                  Abrir en nueva pestaña ↗
                </a>
                <button
                  onClick={() => setShowPopup(false)}
                  className="text-xs px-3 py-1 rounded"
                  style={{background:"var(--danger)", color:"white"}}
                >
                  Cerrar ✕
                </button>
              </div>
            </div>
            <iframe
              src="https://rr-skills-hub.vercel.app/"
              className="flex-1 w-full"
              style={{border:"none"}}
              title="RR Skills Hub"
            />
          </div>
        </div>
      )}
    </>
  );
}
