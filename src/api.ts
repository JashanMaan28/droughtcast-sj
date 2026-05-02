import type { RawRow, Row } from "./types";

const ENDPOINT = "https://scoringapi.h2ohackathon.org/Challenge/json";

function parseDate(mdy: string): { date: Date; year: number; month: number } {
  const [m, d, yy] = mdy.split("/").map((p) => parseInt(p, 10));
  const year = 2000 + yy;
  return { date: new Date(year, m - 1, d), year, month: m };
}

export async function fetchRows(): Promise<Row[]> {
  const res = await fetch(ENDPOINT);
  if (!res.ok) throw new Error(`H2O API ${res.status}`);
  const raw = (await res.json()) as RawRow[];
  const rows: Row[] = raw.map((r) => {
    const { date, year, month } = parseDate(r.Date);
    return {
      date,
      year,
      month,
      snowpack: Number(r.Snowpack),
      precip: Number(r.Precip),
      reservoir: Number(r.Reservoir),
    };
  });
  rows.sort((a, b) => a.date.getTime() - b.date.getTime());
  return rows;
}
