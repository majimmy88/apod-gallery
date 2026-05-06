"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface DetailImageProps {
  src: string;
  alt: string;
}

export default function DetailImage({ src, alt }: DetailImageProps) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // `priority` causes a <link rel="preload"> so the image may finish loading
  // before React attaches onLoad. Check img.complete after mount to catch that.
  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  return (
    <div className="relative min-h-[40vh] w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-900">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-gray-700 dark:border-gray-800 dark:border-t-white"
            role="status"
            aria-label="Loading image"
          />
        </div>
      )}
      <Image
        ref={imgRef}
        src={src}
        alt={alt}
        width={1200}
        height={800}
        className={`h-auto w-full object-contain transition-opacity duration-500 motion-reduce:transition-none ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        priority
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
