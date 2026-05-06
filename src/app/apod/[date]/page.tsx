import { notFound } from "next/navigation";
import Link from "next/link";
import { getApods } from "@/lib/apod";
import {
  dateRangeForPage,
  formatDate,
  isValidApodDate,
  maxPage,
  PAGE_SIZE,
  shiftDate,
  todayIso,
} from "@/lib/dates";
import VideoEmbed from "@/components/VideoEmbed";
import DetailImage from "@/components/DetailImage";
import MarkVisited from "./MarkVisited";

interface Props {
  params: Promise<{ date: string }>;
}

function pageForDate(date: string, today: string): number {
  const todayMs = new Date(today).getTime();
  const dateMs = new Date(date).getTime();
  const daysAgo = Math.round((todayMs - dateMs) / 86_400_000);
  return Math.floor(daysAgo / PAGE_SIZE) + 1;
}

export default async function ApodDetailPage({ params }: Props) {
  const { date } = await params;
  const today = todayIso();

  if (!isValidApodDate(date, today)) notFound();

  const page = pageForDate(date, today);
  const total = maxPage(today);

  let startDate: string;
  let endDate: string;
  let backPage: number | null = null;

  if (page <= total) {
    ({ startDate, endDate } = dateRangeForPage(page, today));
    backPage = page;
  } else {
    endDate = date;
    startDate = shiftDate(date, -(PAGE_SIZE - 1));
  }

  const entries = await getApods(startDate, endDate);
  const entry = entries.find((e) => e.date === date);

  if (!entry) notFound();

  return (
    <main id="main-content" className="mx-auto w-full max-w-4xl flex-1 px-4 py-6">
      <MarkVisited date={date} />

      <Link
        href={backPage == null || backPage <= 1 ? "/" : `/page/${backPage}`}
        className="mb-6 inline-flex items-center gap-1 rounded text-sm text-gray-500 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-gray-400 dark:hover:text-white dark:focus-visible:ring-blue-400"
      >
        <ChevronLeftIcon />
        Back
      </Link>

      <article className="flex flex-col gap-6">
        <header>
          <h1 className="text-2xl font-bold leading-snug text-gray-900 dark:text-white sm:text-3xl">
            {entry.title}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{formatDate(entry.date)}</p>
          {entry.copyright && (
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">© {entry.copyright}</p>
          )}
        </header>

        {entry.media_type === "image" && (
          <DetailImage src={entry.hdurl ?? entry.url} alt={entry.title} />
        )}

        {entry.media_type === "video" && (
          <VideoEmbed url={entry.url} title={entry.title} />
        )}

        {entry.media_type !== "image" && entry.media_type !== "video" && (
          <div className="rounded-xl bg-gray-100 p-8 text-center dark:bg-gray-900">
            <p className="mb-4 text-gray-500 dark:text-gray-400">
              This entry uses an unsupported media type.
            </p>
            <a
              href={entry.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded text-blue-600 underline hover:text-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View on NASA ↗
            </a>
          </div>
        )}

        <section aria-label="Description">
          <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
            {entry.explanation}
          </p>
        </section>
      </article>
    </main>
  );
}

function ChevronLeftIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}
