import { notFound } from "next/navigation";
import { getApods } from "@/lib/apod";
import { dateRangeForPage, maxPage, todayIso } from "@/lib/dates";
import ApodGrid from "@/components/ApodGrid";
import Pagination from "@/components/Pagination";

interface Props {
  params: Promise<{ n: string }>;
}

export default async function ArchivePage({ params }: Props) {
  const { n } = await params;
  const page = parseInt(n, 10);

  if (!Number.isFinite(page) || page < 2) {
    notFound();
  }

  const today = todayIso();
  const total = maxPage(today);

  if (page > total) {
    notFound();
  }

  const { startDate, endDate } = dateRangeForPage(page, today);
  const entries = await getApods(startDate, endDate);

  return (
    <main
      id="main-content"
      className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 pb-36 md:pb-6"
    >
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        Astronomy Picture of the Day
      </h1>

      {entries.length === 0 && (
        <p className="rounded-xl bg-gray-100 p-8 text-center text-gray-500 dark:bg-gray-900 dark:text-gray-400">
          Could not load pictures from NASA. Please try again later.
        </p>
      )}

      <ApodGrid entries={entries} />

      <div className="mt-8">
        <Pagination
          currentPage={page}
          maxPage={total}
          startDate={startDate}
          endDate={endDate}
        />
      </div>
    </main>
  );
}
