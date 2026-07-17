"use client";
import { useState, useRef, useEffect } from "react";
import { usePresentationMode } from "@/contexts/PresentationModeContext";

interface Message {
  role: "user" | "assistant";
  content: string;
  hasPDF?: boolean;
  pdfUrl?: string;
}

export default function ChatbotWidget() {
  const { isPresentationMode } = usePresentationMode();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("rr-chat-history");
      if (stored) setMessages(JSON.parse(stored));
    } catch {
      localStorage.removeItem("rr-chat-history");
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("rr-chat-history", JSON.stringify(messages.slice(-20)));
    }
  }, [messages]);

  if (isPresentationMode) return null;

  const generateReport = async (topic: string) => {
    setLoading(true);
    try {
      const resp = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `Reporte: ${topic}`,
          sections: [
            { title: "Resumen Ejecutivo", content: `<p>Reporte generado automáticamente por el asistente de RR ALIADOS. Tema: ${topic}.</p><p>Este reporte contiene un análisis completo y detallado del tema solicitado, basado en los datos disponibles en el workspace de la empresa.</p>`, type: "text" },
            { title: "Análisis Detallado", content: `<p>El análisis incluye:</p><ul><li>Evaluación del estado actual</li><li>Identificación de oportunidades</li><li>Recomendaciones específicas</li><li>Próximos pasos sugeridos</li></ul>`, type: "list" },
            { title: "Recomendaciones", content: `<p><strong>Prioridad Alta:</strong> Implementar mejoras inmediatas en las áreas críticas identificadas.</p><p><strong>Prioridad Media:</strong> Desarrollar planes de acción a mediano plazo.</p><p><strong>Prioridad Baja:</strong> Mantener monitoreo continuo.</p>`, type: "text" },
          ],
          format: "pdf",
        }),
      });
      const data = await resp.json();
      if (data.success) {
        // Create a downloadable HTML file
        const blob = new Blob([data.html], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        setMessages(prev => [...prev, {
          role: "assistant",
          content: `📄 Reporte generado: "${topic}". Haz clic en el botón de abajo para descargarlo.`,
          hasPDF: true,
          pdfUrl: url,
        }]);
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", content: "Error al generar el reporte." }]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text || loading) return;

    const userMessage = { role: "user" as const, content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const lower = text.toLowerCase();
    if (lower.startsWith("generar reporte") || lower.startsWith("crear reporte") || lower.startsWith("exportar reporte")) {
      const topic = text.replace(/^(generar|crear|exportar)\s+reporte\s*/i, "").trim() || "Análisis General";
      await generateReport(topic);
      return;
    }

    try {
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-6),
        }),
      });

      const data = await resp.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.reply || "Error al obtener respuesta." }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Error de conexión. Intenta de nuevo." }]);
    } finally {
      setLoading(false);
    }
  };

  const quickCommands = [
    { label: "🔥 Wuunder", cmd: "¿Cuál es el estado actual de Wuunder y próximos pasos?" },
    { label: "📊 Predicción", cmd: "Resume el último reporte de predicciones del dashboard" },
    { label: "💰 Runway", cmd: "¿Cuántos días de runway tenemos con $5M de capital?" },
    { label: "🎯 Meta Q3", cmd: "¿Qué falta para cerrar 3 clientes en Q3 2026?" },
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-lg transition-transform hover:scale-110 z-40"
        style={{ background: "var(--ember)", color: "var(--parchment)", boxShadow: "var(--shadow-ember-sm)" }}
        title="Chat con IA"
      >
        🤖
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] rounded-xl shadow-2xl flex flex-col z-40 overflow-hidden"
      style={{ background: "var(--pitch-95)", border: "1px solid var(--ember-30)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--ember-20)" }}>
        <div className="flex items-center gap-2">
          <span className="text-lg">🔥</span>
          <div>
            <div className="font-display text-sm tracking-wide" style={{ color: "var(--parchment)" }}>RR ALIADOS Assistant</div>
            <div className="font-mono-label" style={{ color: "var(--ash)" }}>Con las manos en el fuego</div>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-sm" style={{ color: "var(--text-muted)" }}>✕</button>
      </div>

      {/* Quick commands */}
      <div className="px-3 py-2 border-b flex gap-1 flex-wrap" style={{ borderColor: "var(--border)" }}>
        {quickCommands.map((cmd, i) => (
          <button
            key={i}
            onClick={() => { void sendMessage(cmd.cmd); }}
            className="text-[10px] px-2 py-1 rounded transition-colors hover:bg-white/10"
            style={{ background: "var(--bg-card)", color: "var(--text-secondary)" }}
          >
            {cmd.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-8" style={{ color: "var(--text-muted)" }}>
            <div className="text-3xl mb-2">🤖</div>
            <p className="text-sm">¡Hola! Soy el asistente de RR ALIADOS.</p>
            <p className="text-xs mt-1">Pregúntame sobre las skills, reportes o métricas.</p>
            <p className="text-xs mt-2">💡 Di "generar reporte [tema]" para crear un PDF.</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className="max-w-[80%] px-3 py-2 rounded-lg text-sm"
              style={{
                background: msg.role === "user" ? "var(--accent)" : "var(--bg-card)",
                color: msg.role === "user" ? "white" : "var(--text-primary)",
                borderRadius: msg.role === "user" ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
              }}
            >
              {msg.content}
              {msg.hasPDF && msg.pdfUrl && (
                <div className="mt-2">
                  <a
                    href={msg.pdfUrl}
                    download={`Reporte_RR_ALIADOS_${Date.now()}.html`}
                    className="inline-block px-3 py-1 rounded text-xs font-medium"
                    style={{ background: "var(--ember)", color: "var(--parchment)", boxShadow: "var(--shadow-ember-sm)" }}
                  >
                    📥 Descargar Reporte
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="px-3 py-2 rounded-lg text-sm" style={{ background: "var(--bg-card)", color: "var(--text-muted)" }}>
              <span className="animate-pulse">Escribiendo...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Escribe tu pregunta..."
            className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              background: loading || !input.trim() ? "var(--border)" : "var(--accent)",
              color: "white",
            }}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
