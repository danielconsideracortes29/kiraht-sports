/*
 * Efeitos 3D sincronizados com a rolagem (GSAP + ScrollTrigger + CSS 3D), em todas as páginas.
 * - Tudo usa scrub: o movimento acompanha a rolagem nos dois sentidos (inclusive ao voltar para cima).
 * - Profundidade em camadas, parallax discreto e transições suaves entre as seções.
 * - Celular: amplitudes menores (fator k). Movimento reduzido: nenhum efeito (o conteúdo aparece direto).
 * - Fotos das fichas (.capa-foto): só reduzem levemente a escala e a opacidade ao sair; nunca cortam.
 * - Inclinação ao passar o cursor nos cards [data-tilt] (só mouse/trackpad).
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
const SCRUB = 0.6; // pequeno atraso suaviza o movimento sem descolar da rolagem
const $$ = <T extends Element = HTMLElement>(s: string) => gsap.utils.toArray<T>(s);

function efeitos(k: number) {
  const dir = document.documentElement.dir === "rtl" ? -1 : 1; // espelha deslocamentos horizontais no árabe
  /* ---------- Home: topo em camadas ---------- */
  const hero = document.querySelector(".hero");
  if (hero) {
    const st = { trigger: hero, start: "top top", end: "bottom top", scrub: SCRUB };
    gsap.to("[data-hero-bg]", { yPercent: 18 * k, scale: 1.08, ease: "none", scrollTrigger: st });
    gsap.to("[data-hero-txt]", { y: -70 * k, rotateX: 8 * k, autoAlpha: 0.25, transformPerspective: 1000, transformOrigin: "50% 100%", ease: "none", scrollTrigger: st });
    $$(".colagem [data-depth]").forEach((el) => {
      const d = Number(el.dataset.depth) || 0.5;
      gsap.to(el, { y: -160 * d * k, z: 120 * d * k, rotateY: (d - 0.55) * 18 * k * dir, ease: "none", scrollTrigger: st });
    });
    gsap.to(".numeros", { y: -30 * k, ease: "none", scrollTrigger: st });
    // entrada das camadas ao carregar (uma vez)
    gsap.from(".colagem [data-depth]", { y: 60 * k, rotateX: 14, autoAlpha: 0, duration: 1.1, ease: "power3.out", stagger: 0.12, delay: 0.15 });
  }

  /* ---------- Títulos e textos: sobem e ganham nitidez conforme entram ---------- */
  $$("[data-reveal]").forEach((el) => {
    if (el.closest(".hero")) return;
    gsap.fromTo(el, { y: 46 * k, autoAlpha: 0 }, {
      y: 0, autoAlpha: 1, ease: "none",
      scrollTrigger: { trigger: el, start: "top 96%", end: "top 70%", scrub: SCRUB },
    });
  });

  /* ---------- Cards dos atletas: deitados em perspectiva → de frente ---------- */
  $$("#elenco [data-depth-item]").forEach((el, i) => {
    const col = i % 4;
    gsap.fromTo(el, { rotateX: 24 * k, y: 80 * k, z: -140 * k, autoAlpha: 0.15, transformOrigin: "50% 100%" }, {
      rotateX: 0, y: 0, z: 0, autoAlpha: 1, ease: "none",
      scrollTrigger: { trigger: el, start: `top ${100 - col * 2}%`, end: "top 72%", scrub: SCRUB },
    });
  });

  /* ---------- Equipe: cards giram suavemente para o centro ---------- */
  $$("#equipe [data-depth-item]").forEach((el, i) => {
    const lado = i % 2 ? 1 : -1;
    gsap.fromTo(el, { rotateY: 22 * lado * k, z: -120 * k, y: 50 * k, autoAlpha: 0.2 }, {
      rotateY: 0, z: 0, y: 0, autoAlpha: 1, ease: "none",
      scrollTrigger: { trigger: el, start: "top 98%", end: "top 66%", scrub: SCRUB },
    });
  });

  /* ---------- Instagram: vídeo e carrossel ganham profundidade ---------- */
  $$(".ig-video, .carrossel").forEach((el) => {
    gsap.fromTo(el, { rotateX: 16 * k, scale: 0.9, y: 60 * k, autoAlpha: 0.3, transformPerspective: 1200, transformOrigin: "50% 100%" }, {
      rotateX: 0, scale: 1, y: 0, autoAlpha: 1, ease: "none",
      scrollTrigger: { trigger: el, start: "top 98%", end: "top 55%", scrub: SCRUB },
    });
  });

  /* ---------- Transição entre seções: a seção que sai recua levemente ---------- */
  $$("main > .secao > .wrap").forEach((el) => {
    gsap.to(el, {
      scale: 0.97, rotateX: -3 * k, autoAlpha: 0.55, transformPerspective: 1400, transformOrigin: "50% 0%", ease: "none",
      scrollTrigger: { trigger: el.parentElement, start: "bottom 40%", end: "bottom top", scrub: SCRUB },
    });
  });

  /* ---------- Fichas ---------- */
  const capa = document.querySelector(".capa");
  if (capa) {
    const st = { trigger: capa, start: "top top", end: "bottom top", scrub: SCRUB };
    gsap.to(".capa-foto", { scale: 0.9, autoAlpha: 0.5, y: 40 * k, ease: "none", scrollTrigger: st }); // reduz, nunca corta
    gsap.from(".capa-foto", { autoAlpha: 0, scale: 0.96, duration: 0.9, ease: "power2.out" });
  }
  const cab = document.querySelector(".cab-in");
  if (cab) {
    gsap.fromTo(".cab-in", { y: 30 * k }, { y: -20 * k, ease: "none", scrollTrigger: { trigger: ".cab", start: "top bottom", end: "bottom top", scrub: SCRUB } });
    gsap.from(".cab-txt > *, .rosto", { y: 24, autoAlpha: 0, duration: 0.7, ease: "power3.out", stagger: 0.06, delay: 0.1 });
  }
  $$(".fatos > div").forEach((el, i) => {
    gsap.fromTo(el, { rotateX: -28 * k, y: 30 * k, autoAlpha: 0, transformPerspective: 800, transformOrigin: "50% 0%" }, {
      rotateX: 0, y: 0, autoAlpha: 1, ease: "none",
      scrollTrigger: { trigger: el, start: `top ${98 - (i % 4) * 2}%`, end: "top 78%", scrub: SCRUB },
    });
  });
  $$(".bio, .bloco h2, .fonte").forEach((el) => {
    gsap.fromTo(el, { y: 36 * k, autoAlpha: 0 }, { y: 0, autoAlpha: 1, ease: "none", scrollTrigger: { trigger: el, start: "top 96%", end: "top 75%", scrub: SCRUB } });
  });
  $$(".linha li").forEach((el) => {
    gsap.fromTo(el, { x: -40 * k * dir, autoAlpha: 0 }, { x: 0, autoAlpha: 1, ease: "none", scrollTrigger: { trigger: el, start: "top 97%", end: "top 82%", scrub: SCRUB } });
  });
}

function tilt() {
  document.querySelectorAll<HTMLElement>("[data-tilt]").forEach((el) => {
    let raf = 0;
    const max = el.classList.contains("membro") ? 5 : 7;
    el.addEventListener("pointermove", (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        el.style.setProperty("--ry", `${(px - 0.5) * 2 * max}deg`);
        el.style.setProperty("--rx", `${(0.5 - py) * 2 * max}deg`);
        el.style.setProperty("--mx", `${px * 100}%`);
        el.style.setProperty("--my", `${py * 100}%`);
        el.classList.add("inclinado");
      });
    });
    el.addEventListener("pointerleave", () => {
      cancelAnimationFrame(raf);
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
      el.classList.remove("inclinado");
    });
  });
}

const mm = gsap.matchMedia();
mm.add(
  {
    desktop: "(min-width: 761px) and (prefers-reduced-motion: no-preference)",
    mobile: "(max-width: 760px) and (prefers-reduced-motion: no-preference)",
    hover: "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
  },
  (ctx) => {
    const c = ctx.conditions as { desktop: boolean; mobile: boolean; hover: boolean };
    if (c.desktop || c.mobile) efeitos(c.desktop ? 1 : 0.5);
    if (c.hover) tilt();
  },
);

// Recalcula posições quando imagens e fontes terminam de carregar
addEventListener("load", () => ScrollTrigger.refresh());
(window as any).__kirahtST = ScrollTrigger;
