"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ApodEntry } from "@/lib/apod";
import { formatDate } from "@/lib/dates";

interface ApodCardProps {
  entry: ApodEntry;
  visited: boolean;
}

function isVideoFile(url: string) {
  return /\.(mp4|webm|ogv|mov)(\?|$)/i.test(url);
}

// ── Image thumbnail (photos + YouTube) ──────────────────────────────────────
function ImageThumbnail({ src, alt, visited }: { src: string; alt: string; visited: boolean }) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  useEffect(() => { if (imgRef.current?.complete) setLoaded(true); }, []);

  return (
    <>
      {!loaded && <Spinner />}
      <Image
        ref={imgRef}
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className={[
          "object-cover transition-[opacity,transform] duration-300 motion-reduce:transition-none group-hover:scale-105",
          visited ? "opacity-50" : "opacity-100",
          loaded ? "" : "opacity-0",
        ].join(" ")}
        onLoad={() => setLoaded(true)}
      />
    </>
  );
}

// ── Video-file thumbnail (mp4/webm) — seek to 2 s and freeze ────────────────
function VideoThumbnail({ src, visited }: { src: string; visited: boolean }) {
  const [ready, setReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onMeta = () => { v.currentTime = 2; };
    const onSeeked = () => setReady(true);
    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("seeked", onSeeked);
    return () => {
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("seeked", onSeeked);
    };
  }, [src]);

  return (
    <>
      {!ready && <Spinner />}
      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        preload="metadata"
        className={[
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-300 motion-reduce:transition-none",
          visited ? "opacity-50" : "opacity-100",
          ready ? "" : "opacity-0",
        ].join(" ")}
      />
    </>
  );
}

// ── Shared spinner ───────────────────────────────────────────────────────────
function Spinner() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-700 dark:border-gray-700 dark:border-t-white"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}

// ── Card ─────────────────────────────────────────────────────────────────────
export default function ApodCard({ entry, visited }: ApodCardProps) {
  const thumbnailUrl = entry.media_type === "video" ? entry.thumbnail_url : entry.url;
  const showVideoThumb = !thumbnailUrl && entry.media_type === "video" && isVideoFile(entry.url);

  return (
    <article>
      <Link
        href={`/apod/${entry.date}`}
        className={[
          "group relative flex flex-col overflow-hidden rounded-xl shadow transition-shadow hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400",
          visited
            ? "bg-indigo-50 ring-1 ring-indigo-200 dark:bg-indigo-950/40 dark:ring-indigo-800"
            : "bg-white dark:bg-gray-900",
        ].join(" ")}
      >
        <div className="relative aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-800">

          {thumbnailUrl ? (
            <ImageThumbnail src={thumbnailUrl} alt={entry.title} visited={visited} />
          ) : showVideoThumb ? (
            <VideoThumbnail src={entry.url} visited={visited} />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-950">
              <PlayIcon />
            </div>
          )}

          {/* Play badge — shown once media is visible */}
          {entry.media_type === "video" && (thumbnailUrl || showVideoThumb) && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-full bg-black/50 p-3">
                <PlayIcon />
              </div>
            </div>
          )}

          {visited && (
            <div className="pointer-events-none absolute inset-0 bg-indigo-500/20 dark:bg-indigo-400/15" />
          )}

          {visited && (
            <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-indigo-600/90 px-2 py-1 text-xs text-white">
              <CheckIcon />
              <span>Viewed</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1 p-3">
          <p className={["text-xs", visited ? "text-indigo-400 dark:text-indigo-400" : "text-gray-500 dark:text-gray-400"].join(" ")}>
            {formatDate(entry.date)}
          </p>
          <h2 className={["line-clamp-2 text-sm font-medium", visited ? "text-indigo-700 dark:text-indigo-300" : "text-gray-900 dark:text-white"].join(" ")}>
            {entry.title}
          </h2>
        </div>
      </Link>
    </article>
  );
}

function PlayIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24"
      fill="white" aria-hidden="true">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
