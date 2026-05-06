export type ApodEntry = {
  date: string;
  title: string;
  explanation: string;
  media_type: "image" | "video" | "other";
  url: string;
  hdurl?: string;
  thumbnail_url?: string;
  copyright?: string;
};

export async function getApods(
  startDate: string,
  endDate: string
): Promise<ApodEntry[]> {
  const key = process.env.NASA_API_KEY ?? "DEMO_KEY";
  const url =
    `https://api.nasa.gov/planetary/apod` +
    `?api_key=${key}` +
    `&start_date=${startDate}` +
    `&end_date=${endDate}` +
    `&thumbs=true`;

  try {
    const res = await fetch(url, { next: { revalidate: 21600 } });

    if (!res.ok) {
      console.error(`APOD API error: ${res.status} ${res.statusText}`);
      return [];
    }

    const data = await res.json();

    // API may return a single object instead of an array for a single day
    const entries: ApodEntry[] = Array.isArray(data) ? data : [data];

    // Sort descending by date (newest first)
    return entries.sort((a, b) => (a.date > b.date ? -1 : 1));
  } catch (err) {
    console.error("APOD fetch failed:", err);
    return [];
  }
}
