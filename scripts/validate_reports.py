#!/usr/bin/env python3
"""
validate_reports.py — Python replacement for sync_reports.ps1

Validates report artifacts in the Mega Dashboard public directory.

Checks performed:
  1. predicciones_index.json exists and has valid entries
  2. optimizacion_index.json exists and has valid entries
  3. All PDF/XLSX files referenced in indices exist and are > 0 bytes
  4. Scan public files for exposed secrets (API keys)
  5. Validates charts_index.json and referenced chart files

Exit codes:
  0 — All validations passed
  1 — One or more validations failed
  2 — Usage error (missing args, etc.)
"""

import argparse
import json
import os
import re
import sys
from pathlib import Path
from typing import List, Tuple


# ── Constants ───────────────────────────────────────────────────────────────

SECRET_PATTERNS = [
    # OpenRouter
    re.compile(r'sk-or-v1-[A-Za-z0-9]{20,}'),
    # Groq
    re.compile(r'gsk_[A-Za-z0-9]{20,}'),
    # Generic API key assignments
    re.compile(r'OPENROUTER_API_KEY\s*=\s*["\']?[A-Za-z0-9_\-]{20,}["\']?'),
    re.compile(r'GROQ_API_KEY\s*=\s*["\']?[A-Za-z0-9_\-]{20,}["\']?'),
    # Vercel tokens
    re.compile(r'VERCEL_TOKEN\s*=\s*["\']?[A-Za-z0-9]{20,}["\']?'),
    # Generic bearer tokens
    re.compile(r'bearer\s+[A-Za-z0-9_\-\.]{20,}', re.IGNORECASE),
    # Google OAuth client secrets
    re.compile(r'"client_secret"\s*:\s*"GOCSPX-[A-Za-z0-9_\-]{20,}"'),
    # Private keys
    re.compile(r'-----BEGIN\s+(RSA\s+)?PRIVATE\s+KEY-----'),
]

# Files to skip during secret scanning (large data snapshots)
SKIP_SECRET_SCAN = {
    'knowledge_graph.json',
    'patterns.json',
    'predictions.json',
    'qualitative_context.json',
    'metrics_latest.json',
    'progress_history.json',
}

# Known safe patterns that look like secrets but aren't
SAFE_EXAMPLES = {
    '.env.example',
    'config.example.json',
    'config.example',
}

# File extensions to scan for secrets
SECRET_SCAN_EXTENSIONS = {'.json', '.ts', '.tsx', '.js', '.md', '.env.example', '.cfg'}

# ── Helpers ─────────────────────────────────────────────────────────────────

def red(text: str) -> str:
    return f"\033[91m{text}\033[0m"

def green(text: str) -> str:
    return f"\033[92m{text}\033[0m"

def yellow(text: str) -> str:
    return f"\033[93m{text}\033[0m"

def cyan(text: str) -> str:
    return f"\033[96m{text}\033[0m"


class ValidationError(Exception):
    """Raised when a validation check fails."""
    pass


# ── Validation Functions ────────────────────────────────────────────────────

def validate_index(index_path: Path, label: str) -> int:
    """
    Validate a report index JSON file and its referenced artifacts.

    Returns the number of validated entries.
    Raises ValidationError on failure.
    """
    if not index_path.exists():
        raise ValidationError(f"[{label}] Índice no encontrado: {index_path}")

    try:
        content = index_path.read_text(encoding='utf-8')
        index = json.loads(content)
    except json.JSONDecodeError as e:
        raise ValidationError(f"[{label}] JSON inválido: {e}")
    except OSError as e:
        raise ValidationError(f"[{label}] Error leyendo archivo: {e}")

    reports = index.get('reports', [])
    if not isinstance(reports, list) or len(reports) == 0:
        raise ValidationError(f"[{label}] El índice no tiene reportes")

    # Determine the public root (parent of the reports/ or data/ directory)
    public_root = index_path.parent
    if public_root.name == 'reports':
        public_root = public_root.parent

    validated = 0
    for i, entry in enumerate(reports):
        if not isinstance(entry, dict):
            print(yellow(f"  [{label}] Entrada {i}: no es un dict, saltando"))
            continue

        # Check PDF
        pdf_rel = entry.get('pdf', '')
        if pdf_rel:
            # Convert /reports/foo.pdf → public/reports/foo.pdf
            pdf_rel_clean = pdf_rel.lstrip('/')
            pdf_path = public_root / pdf_rel_clean
            if not pdf_path.exists():
                raise ValidationError(
                    f"[{label}] Artefacto faltante: {pdf_path} (referido desde entrada {i})"
                )
            if pdf_path.stat().st_size == 0:
                raise ValidationError(
                    f"[{label}] Artefacto vacío: {pdf_path}"
                )
            print(green(f"  [{label}] OK: {pdf_rel_clean} ({pdf_path.stat().st_size} bytes)"))

        # Check Excel (optional)
        excel_rel = entry.get('excel', '')
        if excel_rel:
            excel_rel_clean = excel_rel.lstrip('/')
            excel_path = public_root / excel_rel_clean
            if not excel_path.exists():
                print(yellow(f"  [{label}] Excel faltante (no fatal): {excel_rel_clean}"))
            elif excel_path.stat().st_size == 0:
                print(yellow(f"  [{label}] Excel vacío: {excel_rel_clean}"))
            else:
                print(green(f"  [{label}] OK: {excel_rel_clean} ({excel_path.stat().st_size} bytes)"))

        validated += 1

    print(green(f"[{label}] Índice y artefactos válidos ({validated} entradas)."))
    return validated


def validate_charts_index(charts_index_path: Path) -> int:
    """Validate charts_index.json and referenced chart files."""
    if not charts_index_path.exists():
        print(yellow(f"[CHARTS] Índice no encontrado: {charts_index_path} (no fatal)"))
        return 0

    try:
        content = charts_index_path.read_text(encoding='utf-8')
        index = json.loads(content)
    except (json.JSONDecodeError, OSError) as e:
        print(yellow(f"[CHARTS] Error leyendo índice: {e}"))
        return 0

    charts = index.get('charts', [])
    if not charts:
        print(yellow("[CHARTS] Sin gráficos en el índice"))
        return 0

    public_root = charts_index_path.parent
    if public_root.name in ('data', 'mirofish'):
        # charts_index.json is at public/data/mirofish/charts_index.json
        # Charts are referenced as /data/mirofish/charts/xxx.png
        public_root = public_root.parent  # data/mirofish → data
        if public_root.name == 'data':
            public_root = public_root.parent  # data → public

    validated = 0
    for chart in charts:
        if not isinstance(chart, dict):
            continue
        url = chart.get('url', '')
        if url:
            url_clean = url.lstrip('/')
            chart_path = public_root / url_clean
            if chart_path.exists() and chart_path.stat().st_size > 0:
                validated += 1
            else:
                print(yellow(f"  [CHARTS] Faltante o vacío: {url_clean}"))

    if validated:
        print(green(f"[CHARTS] {validated}/{len(charts)} gráficos válidos"))
    return validated


def scan_for_secrets(scan_roots: List[Path]) -> List[Tuple[Path, str]]:
    """
    Scan public files for exposed secrets.

    Returns a list of (file_path, match_description) tuples for matches found.
    """
    findings: List[Tuple[Path, str]] = []

    for root in scan_roots:
        if not root.exists():
            continue

        for dirpath, _, filenames in os.walk(str(root)):
            for fn in filenames:
                # Skip large data snapshots
                if fn in SKIP_SECRET_SCAN:
                    continue
                # Skip known safe files
                if fn in SAFE_EXAMPLES:
                    continue

                ext = os.path.splitext(fn)[1].lower()
                # If extension doesn't match and it's not a dotfile-like pattern
                if ext not in SECRET_SCAN_EXTENSIONS and not fn.startswith('.env'):
                    continue

                fpath = Path(dirpath) / fn

                # Skip binary files and files > 500KB
                try:
                    stat = fpath.stat()
                    if stat.st_size > 500_000:
                        continue
                except OSError:
                    continue

                try:
                    text = fpath.read_text(encoding='utf-8', errors='replace')
                except (OSError, UnicodeDecodeError):
                    continue

                if not text.strip():
                    continue

                for pattern in SECRET_PATTERNS:
                    matches = pattern.findall(text)
                    for match in matches:
                        match_str = match if isinstance(match, str) else match
                        # Truncate the match for display
                        display = match_str[:40] + '...' if len(str(match_str)) > 40 else str(match_str)
                        findings.append((fpath, f"Pattern matched: {display}"))

    return findings


# ── Main ─────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description='Mega Dashboard Report Validator',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python validate_reports.py --reports-dir public/reports
  python validate_reports.py --reports-dir public/reports --no-secret-scan
  python validate_reports.py --reports-dir public/reports --scan-dir public/
        """,
    )
    parser.add_argument(
        '--reports-dir',
        required=True,
        type=Path,
        help='Path to public/reports/ directory',
    )
    parser.add_argument(
        '--scan-dir',
        type=Path,
        nargs='*',
        help='Additional directories to scan for secrets (defaults to reports-dir parent)',
    )
    parser.add_argument(
        '--no-secret-scan',
        action='store_true',
        help='Skip secret scanning',
    )
    parser.add_argument(
        '--allow-missing-optimization',
        action='store_true',
        help='Do not fail if optimizacion_index.json is missing',
    )

    args = parser.parse_args()
    reports_dir = args.reports_dir.resolve()

    if not reports_dir.exists():
        print(red(f"[FATAL] Reports directory not found: {reports_dir}"))
        sys.exit(2)

    errors: List[str] = []

    print(cyan("=== Validate Reports — Mega Dashboard ==="))
    print(f"Reports dir: {reports_dir}")
    print()

    # ── 1. Validate predicciones_index.json ─────────────────────────────────
    pred_index = reports_dir / 'predicciones_index.json'
    try:
        validate_index(pred_index, "PREDICCIONES")
    except ValidationError as e:
        errors.append(str(e))
        print(red(f"  {e}"))
    print()

    # ── 2. Validate optimizacion_index.json ─────────────────────────────────
    opt_index = reports_dir / 'optimizacion_index.json'
    try:
        validate_index(opt_index, "OPTIMIZACION")
    except ValidationError as e:
        if args.allow_missing_optimization and 'no encontrado' in str(e):
            print(yellow(f"  [OPTIMIZACION] Índice no encontrado (--allow-missing-optimization activo)"))
        else:
            errors.append(str(e))
            print(red(f"  {e}"))
    print()

    # ── 3. Validate charts_index.json ───────────────────────────────────────
    # charts_index.json lives in public/data/mirofish/
    charts_index = reports_dir.parent / 'data' / 'mirofish' / 'charts_index.json'
    try:
        validate_charts_index(charts_index)
    except Exception as e:
        print(yellow(f"[CHARTS] Error validando gráficos: {e}"))
    print()

    # ── 4. Scan for secrets ──────────────────────────────────────────────────
    if not args.no_secret_scan:
        scan_roots = args.scan_dir if args.scan_dir else [reports_dir.parent]
        print(cyan("[SECRETS] Scanning public files for exposed credentials..."))
        findings = scan_for_secrets(scan_roots)

        if findings:
            for fpath, desc in findings:
                msg = f"[SECRETS] Posible secreto en {fpath}: {desc}"
                errors.append(msg)
                print(red(f"  {msg}"))
            print()
        else:
            print(green("[SECRETS] No credentials found in public files."))
            print()

    # ── 5. Summary ───────────────────────────────────────────────────────────
    print(cyan("=== Validation Summary ==="))
    if errors:
        print(red(f"  {len(errors)} issue(s) found:"))
        for e in errors:
            print(red(f"    - {e}"))
        print()
        print(red("  VALIDATION FAILED"))
        sys.exit(1)
    else:
        print(green("  All checks passed"))
        print(green("  VALIDATION SUCCESSFUL"))
        sys.exit(0)


if __name__ == '__main__':
    main()
