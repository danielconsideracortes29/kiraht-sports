/* Vídeo “Encerramento da janela”: botão de reprodução sobre o vídeo e botão de tela cheia. */
export function initVideo(fig: HTMLElement) {
  const video = fig.querySelector("video")!;
  const play = fig.querySelector<HTMLButtonElement>("[data-video-play]");
  const fs = fig.querySelector<HTMLButtonElement>("[data-video-fs]");

  const sync = () => fig.classList.toggle("tocando", !video.paused && !video.ended);
  ["play", "playing", "pause", "ended"].forEach((ev) => video.addEventListener(ev, sync));
  play?.addEventListener("click", () => { video.play().catch(() => {}); });

  fs?.addEventListener("click", () => {
    const v = video as HTMLVideoElement & { webkitEnterFullscreen?: () => void };
    if (video.requestFullscreen) video.requestFullscreen().catch(() => v.webkitEnterFullscreen?.());
    else v.webkitEnterFullscreen?.(); // iPhone
  });

  // Pausa o vídeo se o visitante rolar para longe dele
  new IntersectionObserver(([e]) => { if (!e.isIntersecting && !video.paused && !document.fullscreenElement) video.pause(); }, { threshold: 0 }).observe(fig);
}
