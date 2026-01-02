import pdf from 'pdf-parse';
import { BiomarkerDefinition, GeneDefinition, RiskLevel } from '@prisma/client';

export type ParsedGeneVariant = { symbol: string; variant: string };
export type ParsedBiomarkerValue = { nameOrShortName: string; value: number; unit?: string };

const normalize = (s: string) => s.trim();
const normalizeUpper = (s: string) => normalize(s).toUpperCase();

function detectDelimiter(line: string): string {
  if (line.includes('\t')) return '\t';
  if (line.includes(';')) return ';';
  return ',';
}

function parseTableLikeLines(text: string): string[][] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) return [];
  const delimiter = detectDelimiter(lines[0]);

  return lines.map((l) =>
    l
      .split(delimiter)
      .map((c) => c.trim())
      .filter((c) => c.length > 0)
  );
}

export async function extractTextFromUpload(buffer: Buffer, mimeType?: string): Promise<string> {
  const mt = (mimeType || '').toLowerCase();

  if (mt.includes('pdf')) {
    const out = await pdf(buffer);
    return out.text || '';
  }

  // For CSV/TXT we treat as utf-8 text
  return buffer.toString('utf-8');
}

export function parseGeneticVariantsFromText(text: string): ParsedGeneVariant[] {
  const rows = parseTableLikeLines(text);
  const bySymbol = new Map<string, ParsedGeneVariant>();

  // CSV-like rows: SYMBOL, VARIANT
  for (const row of rows) {
    if (row.length < 2) continue;
    const symbol = normalizeUpper(row[0]);
    const variant = normalizeUpper(row[1]);
    if (!/^[A-Z0-9]{2,10}$/.test(symbol)) continue;
    if (variant.length < 2) continue;
    bySymbol.set(symbol, { symbol, variant });
  }

  // Regex fallback: "FTO: AA" or "FTO AA"
  const regex = /\b([A-Z0-9]{2,10})\b\s*[:\-]?\s*([A-Z0-9/]{2,12})\b/g;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(text)) !== null) {
    const symbol = normalizeUpper(m[1]);
    const variant = normalizeUpper(m[2]);
    if (!bySymbol.has(symbol)) bySymbol.set(symbol, { symbol, variant });
  }

  return Array.from(bySymbol.values());
}

export function parseBiomarkersFromText(text: string): ParsedBiomarkerValue[] {
  const rows = parseTableLikeLines(text);
  const out: ParsedBiomarkerValue[] = [];

  // CSV-like rows: NAME, VALUE, UNIT?
  for (const row of rows) {
    if (row.length < 2) continue;
    const nameOrShortName = normalize(row[0]);
    const value = Number(row[1].replace(',', '.'));
    if (!nameOrShortName || Number.isNaN(value)) continue;
    const unit = row[2] ? normalize(row[2]) : undefined;
    out.push({ nameOrShortName, value, unit });
  }

  // Regex fallback: "Glucose: 92 mg/dL"
  const regex =
    /\b([A-Za-z][A-Za-z0-9\-\s()\/]+?)\b\s*[:\-]\s*([0-9]+(?:[.,][0-9]+)?)\s*([A-Za-z/%μ\^0-9.\-]+)?/g;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(text)) !== null) {
    const nameOrShortName = normalize(m[1]);
    const value = Number((m[2] || '').replace(',', '.'));
    if (!nameOrShortName || Number.isNaN(value)) continue;
    const unit = m[3] ? normalize(m[3]) : undefined;
    out.push({ nameOrShortName, value, unit });
  }

  // De-dupe by nameOrShortName, keep last
  const dedup = new Map<string, ParsedBiomarkerValue>();
  for (const v of out) dedup.set(v.nameOrShortName.toLowerCase(), v);
  return Array.from(dedup.values());
}

export function riskLevelToTraffic(risk: RiskLevel): '🟢' | '🟠' | '🔴' {
  if (risk === RiskLevel.OPTIMAL) return '🟢';
  if (risk === RiskLevel.MODERATE) return '🟠';
  return '🔴';
}

export function riskForGene(def: GeneDefinition, variant: string | undefined): RiskLevel {
  if (!variant) return RiskLevel.MODERATE;
  const v = normalizeUpper(variant).replace(/\s/g, '');
  const opt = normalizeUpper(def.optimalVariant).replace(/\s/g, '');
  const mod = normalizeUpper(def.moderateVariant).replace(/\s/g, '');
  const high = normalizeUpper(def.highRiskVariant).replace(/\s/g, '');

  if (v === opt) return RiskLevel.OPTIMAL;
  if (v === high) return RiskLevel.HIGH;
  if (v === mod) return RiskLevel.MODERATE;
  return RiskLevel.MODERATE;
}

export function riskForBiomarker(def: BiomarkerDefinition, value: number | undefined): RiskLevel {
  if (value === undefined || Number.isNaN(value)) return RiskLevel.MODERATE;
  if (value >= def.optimalMin && value <= def.optimalMax) return RiskLevel.OPTIMAL;
  if (
    def.moderateMin !== null &&
    def.moderateMax !== null &&
    value >= def.moderateMin &&
    value <= def.moderateMax
  ) {
    return RiskLevel.MODERATE;
  }
  return RiskLevel.HIGH;
}

export function scoreFromRisk(risk: RiskLevel): number {
  switch (risk) {
    case RiskLevel.OPTIMAL:
      return 1;
    case RiskLevel.MODERATE:
      return 0.5;
    case RiskLevel.HIGH:
      return 0;
    default:
      return 0.5;
  }
}

