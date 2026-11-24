/*
 * Carrossel “Publicações recentes”.
 * Troca a cada data-intervalo ms (padrão 5000) com transição suave (CSS),
 * setas, indicadores, botão de pausa, teclado (← →) e deslize no celular.
 * Pausa sozinho fora da tela ou com a aba oculta. Com movimento reduzido começa pausado.
 */
export function initCarrossel(root: HTMLElement) {
  const slides = [...root.querySelectorAll<HTMLElement>("[data-car-slide]")];
  const datas = [...root.querySelectorAll<HTMLElement>("[data-car-data]")];
  const dots = [...root.querySelectorAll<HTMLButtonElement>("[data-car-dot]")];
  const pausa = root.querySelector<HTMLButtonElement>("[data-car-pausa]")!;
  const contagem = root.querySelector<HTMLElement>("[data-car-contagem]");
  const palco = root.querySelector<HTMLElement>("[data-car-palco]")!;
  const total = slides.length;
  if (total < 2) { root.querySelector(".car-ctrl")?.remove(); return; }

  const intervalo = Number(root.dataset.intervalo) || 5000;
  const fmt = root.dataset.slideFmt ?? ""; // ex.: "Publicação 999 de 4"
  let i = 0, timer = 0;
  let pausadoPeloUsuario = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let visivel = false;

  const mostrar = (n: number) => {
    i = (n + total) % total;
    slides.forEach((s, k) => { s.classList.toggle("ativo", k === i); s.setAttribute("aria-hidden", k === i ? "false" : "true"); });
    datas.forEach((d, k) => d.classList.toggle("ativo", k === i));
    dots.forEach((d, k) => { d.classList.toggle("ativo", k === i); k === i ? d.setAttribute("aria-current", "true") : d.removeAttribute("aria-current"); });
    if (contagem) contagem.textContent = fmt.replace("999", String(i + 1));
    root.dataset.indice = String(i);
  };
  const agendar = () => {
    clearTimeout(timer);
    if (!pausadoPeloUsuario && visivel && !document.hidden) {
      timer = window.setTimeout(() => { mostrar(i + 1); root.dataset.trocas = String(Number(root.dataset.trocas || 0) + 1); agendar(); }, intervalo);
    }
  };
  const ir = (n: number) => { mostrar(n); agendar(); };
  const setPausa = (v: boolean) => {
    pausadoPeloUsuario = v;
    pausa.setAttribute("aria-pressed", String(v));
    pausa.setAttribute("aria-label", v ? root.dataset.labelResume! : root.dataset.labelPause!);
    root.dataset.pausado = String(v);
    agendar();
  };

  root.querySelector("[data-car-prev]")!.addEventListener("click", () => ir(i - 1));
  root.querySelector("[data-car-next]")!.addEventListener("click", () => ir(i + 1));
  dots.forEach((d, k) => d.addEventListener("click", () => ir(k)));
  pausa.addEventListener("click", () => setPausa(!pausadoPeloUsuario));
  // Em RTL (árabe) a ordem de leitura é da direita para a esquerda: seta/deslize invertem o sentido
  const rtl = () => getComputedStyle(root).direction === "rtl";
  root.addEventListener("keydown", (e) => {
    const s = rtl() ? -1 : 1;
    if (e.key === "ArrowLeft") { e.preventDefault(); ir(i - s); }
    if (e.key === "ArrowRight") { e.preventDefault(); ir(i + s); }
  });

  // Deslize (toque ou mouse arrastando)
  let x0: number | null = null, y0 = 0;
  palco.addEventListener("pointerdown", (e) => { x0 = e.clientX; y0 = e.clientY; });
  palco.addEventListener("pointerup", (e) => {
    if (x0 === null) return;
    const dx = e.clientX - x0, dy = e.clientY - y0;
    x0 = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) ir((dx < 0) !== rtl() ? i + 1 : i - 1);
  });
  palco.addEventListener("pointercancel", () => { x0 = null; });

  new IntersectionObserver(([e]) => { visivel = e.isIntersecting; agendar(); }, { threshold: 0.25 }).observe(root);
  document.addEventListener("visibilitychange", agendar);
  setPausa(pausadoPeloUsuario);
  mostrar(0);
}
