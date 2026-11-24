/*
 * Últimas publicações do @kirahtsports pela API oficial do Instagram
 * ("Instagram API with Instagram Login", permissão instagram_business_basic).
 *
 * O token NUNCA vai para o navegador: a busca acontece no servidor do Astro
 * (a cada requisição em `npm run dev`, ou no build do site estático).
 * Configure em preview-astro/.env:  INSTAGRAM_ACCESS_TOKEN=...
 */

export type IgPost = {
  id: string;
  caption: string;
  mediaType: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  image: string;
  permalink: string;
  timestamp: string;
};

export type IgResult =
  | { status: "ok"; posts: IgPost[] }
  | { status: "sem-token" }
  | { status: "erro"; message: string };

const API_BASE = import.meta.env.INSTAGRAM_API_BASE || "https://graph.instagram.com";
const CACHE_MS = 5 * 60 * 1000; // evita chamar a API a cada recarga; novo post aparece em até 5 min

let cache: { at: number; result: IgResult } | null = null;

export async function getLatestPosts(limit = 3): Promise<IgResult> {
  const token = import.meta.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) return { status: "sem-token" };
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.result;

  const url = new URL("/me/media", API_BASE);
  url.searchParams.set("fields", "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp");
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("access_token", token);

  let result: IgResult;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    const body = await res.json();
    if (!res.ok || body.error) {
      result = { status: "erro", message: body?.error?.message ?? `HTTP ${res.status}` };
    } else {
      const posts: IgPost[] = (body.data ?? [])
        .map((m: any) => ({
          id: m.id,
          caption: m.caption ?? "",
          mediaType: m.media_type,
          image: m.media_type === "VIDEO" ? m.thumbnail_url : m.media_url,
          permalink: m.permalink,
          timestamp: m.timestamp,
        }))
        .filter((p: IgPost) => p.permalink && p.image)
        .sort((a: IgPost, b: IgPost) => Date.parse(b.timestamp) - Date.parse(a.timestamp)) // mais novo → mais antigo
        .slice(0, limit);
      result = { status: "ok", posts };
    }
  } catch (e: any) {
    result = { status: "erro", message: e?.message ?? "falha de rede" };
  }

  if (result.status === "erro") console.warn(`[instagram] ${result.message}`); // o token não aparece no log
  cache = { at: Date.now(), result };
  return result;
}
