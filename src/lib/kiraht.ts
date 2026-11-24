/*
 * Dados da prévia:
 *  - src/data/data.js (cópia exata do data.js do site original, lida e nunca alterada): elenco, clubes, países, bios dos treinadores;
 *  - src/data/elenco.json (gerado da planilha elenco-2026-27/elenco.xlsx): nomes de exibição, fotos e Instagram;
 *  - src/data/fichas.json: dados de carreira verificados, com fontes;
 *  - src/data/bios-pt.json: traduções das bios do data.js.
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import elenco from "../data/elenco.json";
import transfermarkt from "../data/transfermarkt.json";
import ajustes from "../data/ajustes.json";

const AJ = ajustes as { atletas: Record<string, any>; equipe: Record<string, any> };
import biosPt from "../data/bios-pt.json";
import biosAr from "../data/bios-ar.json";
import { tr, type Lang } from "./i18n";

type Person = Record<string, any>;

declare const __PROJECT_ROOT__: string;
const PROJECT_ROOT = __PROJECT_ROOT__;

function load() {
  const ctx: any = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(PROJECT_ROOT, "src", "data", "data.js"), "utf8"), ctx);
  return ctx.window.KIRAHT as {
    instagram: { handle: string; url: string; dm: string; posts: any[] };
    team: Person[];
    countries: { id: string; name: string }[];
    players: Person[];
    coaches: Person[];
  };
}

export const D = load();

export const slugify = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const norm = (s: string) => slugify(s).replace(/-/g, " ");

export const initials = (n: string) => {
  const p = n.trim().split(/\s+/);
  return (p[0][0] + (p.length > 1 ? p[p.length - 1][0] : "")).toUpperCase();
};

const countryPt: Record<string, string> = {
  brazil: "Brasil", uae: "Emirados Árabes Unidos", saudi: "Arábia Saudita", qatar: "Catar",
  thailand: "Tailândia", iran: "Irã", kuwait: "Kuwait", ukraine: "Ucrânia", japan: "Japão",
  bahrain: "Bahrein", turkey: "Turquia",
};
const countryAr: Record<string, string> = {
  brazil: "البرازيل", uae: "الإمارات العربية المتحدة", saudi: "المملكة العربية السعودية", qatar: "قطر",
  thailand: "تايلاند", iran: "إيران", kuwait: "الكويت", ukraine: "أوكرانيا", japan: "اليابان",
  bahrain: "البحرين", turkey: "تركيا",
};
export const countryName = (id: string, lang: Lang) =>
  lang === "pt" ? countryPt[id] ?? id : lang === "ar" ? countryAr[id] ?? id : D.countries.find((c) => c.id === id)?.name ?? id;

const PUBLIC_DIR = path.join(PROJECT_ROOT, "public");
const publicFileExists = (url?: string | null) => !!url && fs.existsSync(path.join(PUBLIC_DIR, url));

/* ---------- Planilha ↔ data.js ---------- */
type Linha = { nome: string; rosto: string | null; acao: string | null; instagram: string | null };
const linhas = (elenco as any).linhas as Linha[];

const basePeople = [
  ...D.players.map((p) => ({ ...p, kind: "player" as const })),
  ...D.coaches.map((c) => ({ ...c, kind: "coach" as const })),
];

/** Nome igual (sem acentos) ou, se único, um nome da planilha contido no nome do data.js (ex.: "Chamusca"). */
function matchPerson<T extends { name: string }>(nome: string, list: T[]): T | undefined {
  const n = norm(nome);
  const exact = list.filter((p) => norm(p.name) === n);
  if (exact.length === 1) return exact[0];
  const partial = list.filter((p) => ` ${norm(p.name)} `.includes(` ${n} `));
  return partial.length === 1 ? partial[0] : undefined;
}

const sheetByPerson = new Map<any, Linha>();
const teamRows: Linha[] = [];
for (const l of linhas) {
  const p = matchPerson(l.nome, basePeople);
  if (p) sheetByPerson.set(p, l);
  else teamRows.push(l);
}

/* ---------- Tradução para exibição dos campos em inglês do data.js ---------- */
const meses: Record<string, string> = {
  January: "janeiro", February: "fevereiro", March: "março", April: "abril", May: "maio", June: "junho",
  July: "julho", August: "agosto", September: "setembro", October: "outubro", November: "novembro", December: "dezembro",
};
const mesesAbr: Record<string, string> = {
  Jan: "jan.", Feb: "fev.", Mar: "mar.", Apr: "abr.", May: "maio", Jun: "jun.", Jul: "jul.", Aug: "ago.", Sep: "set.", Oct: "out.", Nov: "nov.", Dec: "dez.",
};
const ptData = (s?: string) => s?.replace(/(\d{1,2}) ([A-Z][a-z]+) (\d{4})/, (m, d, mo, y) => (meses[mo] ? `${d} de ${meses[mo]} de ${y}` : m));
const ptContrato = (s?: string) => s?.replace(/^(\S+) season$/, "Temporada $1");
const ptCarreira = (s: string) =>
  s.replace(/· since (\w{3}) (\d{4})/, (m, mo, y) => (mesesAbr[mo] ? `· desde ${mesesAbr[mo]} ${y}` : m)).replace(/· from (\d{4})/, "· a partir de $1");
const ptNota = (s?: string) => s?.replace(/^On loan from (.+)$/, "emprestado pelo $1");
const ptPais = (s?: string) => (s === "Brazil" ? "Brasil" : s);
const MES_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
/* Árabe (a partir dos campos em inglês do data.js) — algarismos ocidentais, como no restante do site */
const MES_AR = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
const arData = (s?: string) => s?.replace(/(\d{1,2}) ([A-Z][a-z]+) (\d{4})/, (m, d, mo, y) => { const i = MES_EN.indexOf(mo); return i >= 0 ? `${d} ${MES_AR[i]} ${y}` : m; });
const arContrato = (s?: string) => s?.replace(/^(\S+) season$/, "موسم $1");
const arNota = (s?: string) => s?.replace(/^On loan from (.+)$/, "معار من $1");
const arPais = (s?: string) => (s === "Brazil" ? "البرازيل" : s);
const bios = biosPt as Record<string, string>;
const biosAR = biosAr as Record<string, string>;

export type Athlete = {
  slug: string;
  kind: "player" | "coach";
  name: string;
  club: string;
  country: string;
  competition?: string | null;
  face: string | null;
  action: string | null;
  instagram: string | null;
  inSheet: boolean;
  raw: Person;
  ficha?: any;
};

/** Fotos em ação ocultas até confirmação da agência (o retrato e os dados continuam). */
export const ACAO_PENDENTE = new Set<string>([]); // IMG_3797 (Édson) confirmada pela agência em 24/11/2026

const TM = transfermarkt as { jogadores: Record<string, any>; treinadores: Record<string, any> };

/* Somente quem está na planilha final aparece no site. */
export const athletes: Athlete[] = basePeople
  .filter((p) => sheetByPerson.has(p))
  .map((p) => {
    const l = sheetByPerson.get(p)!;
    const slug = p.slug || slugify(p.name);
    const action = publicFileExists(l.acao) && !ACAO_PENDENTE.has(l.acao!) ? l.acao : null;
    return {
      slug,
      kind: p.kind,
      name: AJ.atletas[slug]?.nome ?? l.nome, // planilha, salvo ajuste confirmado pela agência
      club: AJ.atletas[slug]?.clube ?? p.club,
      country: AJ.atletas[slug]?.pais ?? p.country,
      competition: AJ.atletas[slug]?.competicao ?? p.competition,
      face: publicFileExists(l.rosto) ? l.rosto : null,
      action,
      instagram: l.instagram ?? null,
      inSheet: true,
      raw: p,
      ficha: (p.kind === "coach" ? TM.treinadores : TM.jogadores)[slug],
    };
  });

/* ---------- Tradução dos dados do Transfermarkt ---------- */
type T3 = [string, string, string]; // [pt, en, ar]
const POS: Record<string, T3> = {
  "Goleiro": ["Goleiro", "Goalkeeper", "حارس مرمى"], "Zagueiro": ["Zagueiro", "Centre-back", "قلب دفاع"],
  "Lateral Dir.": ["Lateral-direito", "Right-back", "ظهير أيمن"], "Lateral Esq.": ["Lateral-esquerdo", "Left-back", "ظهير أيسر"],
  "Volante": ["Volante", "Defensive midfielder", "لاعب وسط دفاعي"], "Meia Central": ["Meio-campista central", "Central midfielder", "لاعب وسط"],
  "Meia Ofensivo": ["Meia ofensivo", "Attacking midfielder", "لاعب وسط هجومي"], "Meia Esquerda": ["Meia pela esquerda", "Left midfielder", "لاعب وسط أيسر"],
  "Ponta-Direita": ["Ponta-direita", "Right winger", "جناح أيمن"], "Ponta-Esquerda": ["Ponta-esquerda", "Left winger", "جناح أيسر"],
  "Centroavante": ["Centroavante", "Centre-forward", "مهاجم صريح"], "Seg. Atacante": ["Segundo atacante", "Second striker", "مهاجم ثانٍ"],
};
const PE: Record<string, T3> = { direito: ["Direito", "Right", "اليمنى"], esquerdo: ["Esquerdo", "Left", "اليسرى"], ambos: ["Ambos", "Both", "كلتاهما"] };
const NAC: Record<string, T3> = {
  "Brasil": ["Brasil", "Brazil", "البرازيل"], "Mali": ["Mali", "Mali", "مالي"],
  "Emirados Árabes Unidos": ["Emirados Árabes Unidos", "United Arab Emirates", "الإمارات العربية المتحدة"],
  "Itália": ["Itália", "Italy", "إيطاليا"], "Gana": ["Gana", "Ghana", "غانا"],
};
const LI: Record<Lang, number> = { pt: 0, en: 1, ar: 2 };
const MES_PT = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
const pick = (m: Record<string, T3>, v: string | null | undefined, lang: Lang) => (v ? (m[v]?.[LI[lang]] ?? v) : undefined);
const fmtDMY = (s: string | null | undefined, lang: Lang) => {
  const m = s?.match(/^(\d\d)\/(\d\d)\/(\d{4})$/);
  if (!m) return undefined;
  const [d, mo, y] = [+m[1], +m[2] - 1, m[3]];
  return lang === "pt" ? `${d} de ${MES_PT[mo]} de ${y}` : lang === "ar" ? `${d} ${MES_AR[mo]} ${y}` : `${d} ${MES_EN[mo]} ${y}`;
};
const fmtISO = (iso: string, lang: Lang) => fmtDMY(iso.split("-").reverse().join("/"), lang)!;
const period = (de: number, ate: number | null) => (ate === null ? `${de}–` : ate === de ? `${de}` : `${de}–${ate}`);

/** Campos de uma ficha já no idioma pedido; valores vazios ficam undefined e são ocultados. */
export function athleteView(a: Athlete, lang: Lang) {
  const f = a.ficha ?? {};
  const r = a.raw;
  const pt = lang === "pt", ar = lang === "ar";
  const L = <X,>(vPt: X, vEn: X, vAr: X) => (pt ? vPt : ar ? vAr : vEn);
  const coach = a.kind === "coach";
  const divergence = f.divergencia ? tr(f.divergencia, lang) : undefined;
  const bornDate = fmtDMY(f.nascimento, lang) ?? L(ptData(r.born), r.born, arData(r.born));
  const born = bornDate && f.localNascimento ? `${bornDate} · ${f.localNascimento}` : bornDate;
  const sep = ar ? "، " : ", ";
  const nats = (f.nacionalidades ?? []).map((n: string) => pick(NAC, n, lang)).join(sep) || L(ptPais(r.nationality), r.nationality, arPais(r.nationality));
  return {
    sportName: !coach && f.nomeEsportivo && f.nomeEsportivo !== a.name ? f.nomeEsportivo : undefined,
    fullName: f.nomeCompleto ?? r.fullName,
    position: coach ? undefined : pick(POS, f.posicao, lang),
    secondary: coach ? undefined : (f.posicoesSecundarias ?? []).map((x: string) => pick(POS, x, lang)).join(sep) || undefined,
    role: coach ? L("Treinador", "Head coach", "مدرب") : undefined,
    born,
    nationality: nats || undefined,
    height: f.altura ? L(f.altura, f.altura.replace(",", "."), f.altura.replace(",", ".").replace(" m", " م")) : undefined,
    foot: pick(PE, f.pe, lang),
    license: tr(f.licenca, lang),
    loanFrom: !divergence && f.emprestadoDe ? f.emprestadoDe : undefined,
    clubSince: fmtDMY(f.inicioClube, lang), // início no clube atual (Transfermarkt)
    clubLine: a.club + (r.clubNote ? ` (${L(ptNota(r.clubNote), r.clubNote, arNota(r.clubNote))})` : ""),
    contract: L(ptContrato(r.contract), r.contract, arContrato(r.contract)),
    bio: L(bios[a.slug] ?? r.bio, r.bio, biosAR[a.slug] ?? r.bio),
    career: ((f.carreira ?? []) as any[]).map((c) => ({
      club: (!pt && c.clubeEn) || c.clube,
      period: period(c.de, c.ate),
      note: [c.emprestimo ? L("Empréstimo", "Loan", "إعارة") : null, c.funcao === "auxiliar" ? L("Auxiliar técnico", "Assistant coach", "مساعد مدرب") : null].filter(Boolean).join(" · ") || undefined,
      current: c.ate === null,
      since: c.ate === null ? fmtDMY(f.inicioClube, lang) : undefined,
    })) as { club: string; period: string; note?: string; current: boolean; since?: string }[],
    source: f.tm ? { url: f.tm as string, date: fmtISO(f.consultado, lang) } : undefined,
    divergence,
  };
}

/* ---------- Equipe: data.js + linhas da planilha que não são atletas ---------- */
const rolePt: Record<string, string> = {
  "Founder & Owner": "Fundador e proprietário",
  "Football Agent": "Agente de futebol",
  "Licensed Football Agent": "Agente de futebol licenciado",
};
const roleAr: Record<string, string> = {
  "Founder & Owner": "المؤسس والمالك",
  "Football Agent": "وكيل كرة قدم",
  "Licensed Football Agent": "وكيل كرة قدم مرخّص",
};

export type Member = { name: string; role?: { pt: string; en: string; ar: string }; photo: string | null; instagram: string | null };

export const team: Member[] = (() => {
  const out: Member[] = D.team.map((m) => {
    const l = matchPerson(m.name, teamRows.map((r) => ({ ...r, name: r.nome })));
    return {
      name: AJ.equipe[l?.nome ?? ""]?.nome ?? l?.nome ?? m.name,
      role: m.role ? { pt: rolePt[m.role] ?? m.role, en: m.role, ar: roleAr[m.role] ?? m.role } : undefined,
      photo: publicFileExists(l?.rosto) ? l!.rosto : null,
      instagram: l?.instagram ?? null,
    };
  });
  for (const r of teamRows) {
    if (!D.team.some((m) => norm(m.name) === norm(r.nome))) {
      const aj = AJ.equipe[r.nome];
      out.push({
        name: aj?.nome ?? r.nome,
        role: aj?.cargo ? { pt: aj.cargo, en: aj.cargo, ar: aj.cargo } : undefined, // cargo exatamente como pedido, em todos os idiomas
        photo: publicFileExists(r.rosto) ? r.rosto : null,
        instagram: r.instagram,
      });
    }
  }
  return out;
})();
