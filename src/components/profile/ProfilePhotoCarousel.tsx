import { useEffect, useMemo, useRef, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Camera } from "lucide-react";
import { motion } from "framer-motion";

type Props = {
  photos?: Array<string | null | undefined>;
  name?: string;
  gender?: string;
  className?: string;
  showDots?: boolean;
  showThumbnails?: boolean;
  onReady?: (args: { scrollTo: (i: number) => void; photos: string[]; total: number }) => void;
  onIndexChange?: (index: number) => void;
  // Add: opt-in autoplay to prevent flicker on modal open
  autoplay?: boolean;
};

function getGenderPlaceholder(gender?: string): string {
  const g = (gender || "").toLowerCase();
  const label = g.includes("female")
    ? "Female"
    : g.includes("male")
      ? "Male"
      : "Profile";
  // clean, reliable placeholder (ui-avatars)
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    label
  )}&background=E5E7EB&color=111827&size=512`;
}

export function ProfilePhotoCarousel({
  photos,
  name,
  gender,
  className,
  showDots = true,
  showThumbnails = true,
  onReady,
  onIndexChange,
  // Default off to avoid flicker
  autoplay = false,
}: Props) {
  // Sanitize, drop falsy, unique, limit 5
  const cleaned: string[] = useMemo(() => {
    const set = new Set<string>();
    for (const p of photos ?? []) {
      if (typeof p === "string" && p.trim().length > 0) {
        set.add(p.trim());
      }
      if (set.size >= 5) break;
    }
    return Array.from(set);
  }, [photos]);

  const noPhotos = cleaned.length === 0;

  // Ensure we always render up to 5 slides by cycling existing photos when fewer are provided
  const displayPhotos: string[] = useMemo(() => {
    if (noPhotos) return [""];
    const base = cleaned.slice(0, 5);
    const out: string[] = [...base];
    let i = 0;
    while (out.length < 5) {
      out.push(base[i % base.length]);
      i++;
    }
    return out.slice(0, 5);
  }, [cleaned, noPhotos]);

  // Track image loading
  const [loaded, setLoaded] = useState<Record<number, boolean>>({});
  // Add: cache by URL to avoid re-skeleton when the same photo repeats across slides
  const [loadedSrc, setLoadedSrc] = useState<Record<string, boolean>>({});

  const handleLoad = (idx: number, src: string) => {
    setLoaded((s) => ({ ...s, [idx]: true }));
    setLoadedSrc((m) => ({ ...m, [src]: true }));
  };

  // Dots / autoplay management
  const [api, setApi] = useState<any>(null);
  const [current, setCurrent] = useState(0);
  const total = displayPhotos.length;

  useEffect(() => {
    if (!api) return;
    const onSelect = () => {
      const idx = api.selectedScrollSnap() ?? 0;
      setCurrent(idx);
      onIndexChange?.(idx);
    };
    api.on("select", onSelect);
    onSelect();
    return () => {
      api.off("select", onSelect);
    };
  }, [api, onIndexChange]);

  // NEW: expose controls + photos to parent when ready (call only once to avoid re-renders)
  const didReadyRef = useRef(false);
  useEffect(() => {
    if (!api || didReadyRef.current) return;
    didReadyRef.current = true;
    onReady?.({
      scrollTo: (i: number) => api.scrollTo(i),
      photos: displayPhotos,
      total,
    });
  }, [api]);

  // Auto-slide every 4.5s
  const timer = useRef<number | null>(null);
  useEffect(() => {
    // Guard with autoplay to prevent rapid reflows/flicker
    if (!api || !autoplay) return;
    timer.current = window.setInterval(() => {
      if (!api) return;
      if (api.canScrollNext()) api.scrollNext();
      else api.scrollTo(0);
    }, 4500);
    return () => {
      if (timer.current) {
        clearInterval(timer.current);
        timer.current = null;
      }
    };
  }, [api, autoplay]);

  // Lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [zoom, setZoom] = useState(1);

  const openLightbox = (idx: number) => {
    setLightboxIndex(idx);
    setZoom(1);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);
  const prev = () => setLightboxIndex((i) => (i - 1 + total) % total);
  const next = () => setLightboxIndex((i) => (i + 1) % total);
  const toggleZoom = () =>
    setZoom((z) => (z >= 2 ? 1 : Math.min(2, z + 0.5)));

  return (
    <div className={cn("w-full", className)}>
      <div className="relative rounded-xl bg-gradient-to-r from-primary/10 via-transparent to-secondary/10 p-2 md:p-3">
        <Carousel setApi={setApi} className="w-full" opts={{ align: "start", loop: false, containScroll: "trimSnaps" }}>
          <CarouselContent>
            {displayPhotos.map((src, idx) => (
              <CarouselItem key={src + idx}>
                <div
                  className="relative"
                >
                  <div className="w-full aspect-[4/5] md:aspect-[3/4] overflow-hidden rounded-xl shadow-sm bg-muted max-h-[60vh] flex items-center justify-center relative">
                    {noPhotos ? (
                      <div className="h-full w-full flex items-center justify-center border border-dashed text-muted-foreground">
                        <div className="flex flex-col items-center gap-1">
                          <Camera className="h-6 w-6 opacity-70" />
                          <span className="text-xs">No photos yet</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Keep skeleton mounted and fade it out to avoid layout shifts */}
                        <img
                          src={src}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              getGenderPlaceholder(gender);
                          }}
                          onLoad={() => handleLoad(idx, src)}
                          className="absolute inset-0 h-full w-full object-contain"
                          style={{
                            opacity: (loaded[idx] || loadedSrc[src]) ? 1 : 0,
                            transition: "opacity 200ms ease",
                            backfaceVisibility: "hidden",
                            transform: "translateZ(0)",
                            willChange: "opacity",
                          }}
                          alt={name ? `${name} Photo ${idx + 1}` : `Photo ${idx + 1}`}
                          onClick={() => !noPhotos && openLightbox(idx)}
                          loading={idx === 0 ? "eager" : "lazy"}
                          decoding="async"
                          draggable={false}
                        />
                        <div
                          className={cn(
                            "absolute inset-0 transition-opacity",
                            (loaded[idx] || loadedSrc[src]) ? "opacity-0" : "opacity-100"
                          )}
                          aria-hidden="true"
                        >
                          <Skeleton className="h-full w-full" />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Desktop arrows */}
          <div className="hidden md:block">
            <CarouselPrevious className="left-3 bg-background/70 backdrop-blur hover:bg-background" />
            <CarouselNext className="right-3 bg-background/70 backdrop-blur hover:bg-background" />
          </div>
        </Carousel>

        {showDots && (
          <div className="mt-3 flex items-center justify-center gap-2">
            {Array.from({ length: total }).map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                className={cn(
                  "h-2.5 w-2.5 rounded-full transition-all",
                  i === current ? "bg-primary w-6" : "bg-muted-foreground/30"
                )}
                onClick={() => api?.scrollTo(i)}
              />
            ))}
          </div>
        )}
      </div>

      {showThumbnails && total > 1 && !noPhotos && (
        <div className="mt-3 flex gap-2 overflow-x-auto px-4 py-2 bg-background/60 backdrop-blur-md rounded-xl shadow-sm">
          {displayPhotos.map((src, i) => (
            <button
              key={"thumb_" + src + i}
              onClick={() => api?.scrollTo(i)}
              className={cn(
                "shrink-0 h-12 w-12 md:h-16 md:w-16 rounded-lg overflow-hidden border",
                i === current ? "ring-2 ring-primary" : "opacity-90 hover:opacity-100"
              )}
              aria-label={`Thumbnail ${i + 1}`}
            >
              <img
                src={src}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = getGenderPlaceholder(gender);
                }}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && !noPhotos && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.img
              key={lightboxIndex}
              src={displayPhotos[lightboxIndex] || getGenderPlaceholder(gender)}
              initial={false}
              alt={`Photo ${lightboxIndex + 1}`}
              className="max-h-[85vh] max-w-[90vw] rounded-xl shadow-2xl object-contain"
              style={{ transform: `scale(${zoom})` }}
              draggable={false}
              decoding="async"
            />
          </div>

          {/* Controls */}
          <div className="absolute inset-x-0 top-4 flex items-center justify-between px-4">
            <button
              onClick={closeLightbox}
              className="rounded-md bg-white/90 px-3 py-1.5 text-sm font-medium text-black hover:bg-white"
            >
              Close
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleZoom}
                className="rounded-md bg-white/90 px-3 py-1.5 text-sm font-medium text-black hover:bg-white"
              >
                {zoom > 1 ? "Zoom out" : "Zoom in"}
              </button>
            </div>
          </div>

          <div className="absolute inset-y-0 left-2 hidden md:flex items-center">
            <button
              onClick={prev}
              className="rounded-md bg-white/90 px-3 py-1.5 text-sm font-medium text-black hover:bg-white"
            >
              Prev
            </button>
          </div>
          <div className="absolute inset-y-0 right-2 hidden md:flex items-center">
            <button
              onClick={next}
              className="rounded-md bg-white/90 px-3 py-1.5 text-sm font-medium text-black hover:bg-white"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePhotoCarousel;