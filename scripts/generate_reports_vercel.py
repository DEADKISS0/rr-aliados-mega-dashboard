#!/usr/bin/env python3
"""Genera reporte de predicciones durante el build de Vercel usando OpenRouter (modelos gratis)."""
import json, os, sys, urllib.request, urllib.error
from pathlib import Path

OPENROUTER_KEY = os.environ.get("OPENROUTER_API_KEY", "")
if not OPENROUTER_KEY:
    # Fallback a DEEPSEEK_KEY por compatibilidad
    OPENROUTER_KEY = os.environ.get("DEEPSEEK_API_KEY", "")

if not OPENROUTER_KEY:
    print("[build] No hay OPENROUTER_API_KEY en entorno, saltando generacion de reportes")
    sys.exit(0)

reports_dir = Path(__file__).parent.parent / "public" / "reports"
reports_dir.mkdir(parents=True, exist_ok=True)

prompt = """Genera un reporte de predicciones en JSON para RR ALIADOS S.A.S. para los proximos 7 dias.
Clientes activos: BOGA (pitch miercoles), Wuundeer (precontrato), Real Seguros
Proyectos: Mega Dashboard, MiroFish-Lite, SaaS Vertical Hub, Skills Hub
Ingresos disponibles: $3.6M, meta $5M
Equipo: Santiago, Manuel, Andres

Responde SOLO el JSON, sin markdown:
{"predicciones":[{"area":"...","prediccion":"...","confianza":0}],"acciones_recomendadas":[{"accion":"...","prioridad":"alta"}],"riesgos":[{"riesgo":"...","severidad":"alta"}],"projections":{"short_term":["..."],"medium_term":["..."],"long_term":["..."]},"next_actions":[{"action":"...","priority":"..."}]}"""

try:
    payload = json.dumps({
        "model": "google/gemma-4-26b-a4b-it:free",
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 4096,
        "temperature": 0.7
    }).encode()
    
    req = urllib.request.Request(
        "https://openrouter.ai/api/v1/chat/completions",
        data=payload,
        headers={
            "Authorization": f"Bearer {OPENROUTER_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://rr-aliados-mega-dashboard.vercel.app",
            "X-Title": "RR ALIADOS MegaDashboard"
        }
    )
    
    with urllib.request.urlopen(req, timeout=120) as resp:
        data = json.loads(resp.read())
        content = data["choices"][0]["message"]["content"]
        content = content.strip()
        if content.startswith("```"):
            content = content.split("\n", 1)[1].rsplit("```", 1)[0].strip()
        
        # Guardar predicciones como JSON
        pred_path = reports_dir / "predicciones_latest.json"
        with open(pred_path, "w") as f:
            json.dump(json.loads(content), f, indent=2)
        
        # Crear índices vacíos (los PDFs se serviran desde /reports/ estaticos)
        for name, empty in [
            ("predicciones_index.json", {"reports": []}),
            ("optimizacion_index.json", {"reports": []}),
        ]:
            idx_path = reports_dir / name
            if not idx_path.exists():
                with open(idx_path, "w") as f:
                    json.dump(empty, f, indent=2)
        
        print(f"[build] Reporte generado con OpenRouter ({data.get('usage',{}).get('total_tokens','?')} tokens)")
        
except Exception as e:
    print(f"[build] Error generando reporte: {e}")
    # No fallar el build por esto — crear índices vacios
    for name, empty in [
        ("predicciones_index.json", {"reports": []}),
        ("optimizacion_index.json", {"reports": []}),
    ]:
        idx_path = reports_dir / name
        if not idx_path.exists():
            with open(idx_path, "w") as f:
                json.dump(empty, f, indent=2)