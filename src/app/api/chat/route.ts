import { NextRequest, NextResponse } from "next/server";
import { chatCompletion } from "@/lib/llm";
import { buildDashboardGrounding } from "@/lib/dashboardContext";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    if (!message || typeof message !== "string" || message.length > 1000) {
      return NextResponse.json({ error: "Mensaje inválido" }, { status: 400 });
    }

    const grounding = await buildDashboardGrounding();

    const systemPrompt = `Eres el asistente operativo de RR ALIADOS S.A.S. (Medellín). Meta: #1 en tecnología de posicionamiento digital en Colombia.

Responde en español, conciso y accionable. Prioriza "qué hacer hoy".
Cita números del CONTEXTO VIVO cuando hables de runway, capital, clientes, Wuunder o deals.
Si el usuario pide un pack pitch / PDF, indícale el botón "Pack Pitch" del dashboard o el comando de exportar.

${grounding.text}`;

    const safeHistory = Array.isArray(history)
      ? history.slice(-6).map((h: { role: string; content: string }) => ({
          role: h.role,
          content: String(h.content || "").slice(0, 500),
        }))
      : [];

    const messages = [
      { role: "system", content: systemPrompt },
      ...safeHistory,
      { role: "user", content: message.slice(0, 1000) },
    ];

    const { content, provider } = await chatCompletion(messages, {
      maxTokens: 1024,
      temperature: 0.4,
    });

    if (!content) {
      return NextResponse.json(
        {
          error:
            "No hay proveedor LLM disponible. Configura OPENROUTER_API_KEY, OPENCODE_API_KEY o GROQ_API_KEY en .env.local",
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      reply: content,
      provider,
      groundedAt: grounding.generatedAt,
    });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
