interface VideoEmbedProps {
  url: string;
  title: string;
}

type VideoKind =
  | { type: "youtube"; embedUrl: string }
  | { type: "vimeo"; embedUrl: string }
  | { type: "file" }
  | { type: "link" };

function classify(raw: string): VideoKind {
  const url = raw.startsWith("//") ? `https:${raw}` : raw;
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");

    if (host === "youtube.com" || host === "youtu.be") {
      let id: string | null = null;
      if (host === "youtu.be") {
        id = u.pathname.slice(1).split("?")[0];
      } else if (u.pathname.startsWith("/embed/")) {
        id = u.pathname.split("/")[2];
      } else {
        id = u.searchParams.get("v") ?? u.pathname.split("/").pop() ?? null;
      }
      if (id) return { type: "youtube", embedUrl: `https://www.youtube.com/embed/${id}?rel=0` };
    }

    if (host === "vimeo.com" || host === "player.vimeo.com") {
      const id = u.pathname.split("/").filter(Boolean).pop();
      if (id) return { type: "vimeo", embedUrl: `https://player.vimeo.com/video/${id}` };
    }

    if (/\.(mp4|webm|ogg|mov)(\?|$)/i.test(u.pathname)) {
      return { type: "file" };
    }
  } catch {
    // malformed URL
  }
  return { type: "link" };
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-black aspect-video">
      {children}
    </div>
  );
}

export default function VideoEmbed({ url, title }: VideoEmbedProps) {
  const src = url.startsWith("//") ? `https:${url}` : url;
  const kind = classify(url);

  if (kind.type === "youtube" || kind.type === "vimeo") {
    return (
      <Shell>
        <iframe
          src={kind.embedUrl}
          title={title}
          className="absolute inset-0 h-full w-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </Shell>
    );
  }

  if (kind.type === "file") {
    return (
      <Shell>
        <video
          src={src}
          title={title}
          controls
          className="absolute inset-0 h-full w-full object-contain"
        />
      </Shell>
    );
  }

  // Fallback: can't embed — open externally
  return (
    <Shell>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gray-100 p-10 text-center dark:bg-gray-900">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          This video can&apos;t be embedded directly.
        </p>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          Watch video ↗
        </a>
      </div>
    </Shell>
  );
}
