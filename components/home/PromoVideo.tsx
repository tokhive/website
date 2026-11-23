"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { PROMO_VIDEO } from "@/lib/links";

// The promo film. Until someone presses play the page loads only the poster,
// so the 12 MB film costs nothing to visitors who scroll past it.
export function PromoVideo() {
  const t = useTranslations("Home.promo");
  const video = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  function play() {
    setStarted(true);
    void video.current?.play();
  }

  return (
    <section className="home-promo site-container flex flex-col items-center gap-8 py-24 text-center max-[899px]:gap-6 max-[899px]:py-20">
      <div className="flex flex-col items-center gap-4">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h2 className="h2 text-balance">{t("title")}</h2>
      </div>
      {/* Capped by the viewport height too, so the heading and the film fit on one screen. */}
      <div className="relative aspect-video w-full max-w-[min(1040px,calc((100svh-200px)*16/9))] overflow-hidden rounded-card-lg border border-line bg-surface max-md:rounded-card">
        <video
          ref={video}
          className="absolute inset-0 h-full w-full"
          src={PROMO_VIDEO.src}
          poster={PROMO_VIDEO.poster}
          width={1920}
          height={1080}
          preload="none"
          playsInline
          controls={started}
          onPlay={() => setStarted(true)}
        />
        {!started && (
          <button
            type="button"
            onClick={play}
            aria-label={t("play")}
            className="group absolute inset-0 cursor-pointer"
          >
            {/* Bottom left, clear of the poster's centred title. */}
            <span className="absolute bottom-6 left-6 flex items-center gap-3 max-md:bottom-3 max-md:left-3 max-md:gap-2">
              <span className="clip-hex flex h-16 w-14 items-center justify-center bg-volt transition-transform duration-200 group-hover:scale-110 group-focus-visible:scale-110 max-md:h-11 max-md:w-[38px]">
                <svg viewBox="0 0 24 24" className="ml-0.5 h-6 w-6 fill-ink max-md:h-4 max-md:w-4" aria-hidden="true">
                  <path d="M7 4.5v15l12.5-7.5z" />
                </svg>
              </span>
              <span className="rounded-badge bg-bg/70 px-2 py-1 font-mono text-xs text-paper">{PROMO_VIDEO.length}</span>
            </span>
          </button>
        )}
      </div>
    </section>
  );
}
