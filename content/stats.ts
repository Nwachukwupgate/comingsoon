/**
 * Stats counter. A stat with `value: null` is never shown.
 * Labels are in messages/<locale>.json under `stats.labels`.
 */
export type Stat = { key: "years" | "projects" | "trucks" | "properties"; value: number | null; suffix?: string };

export const stats: Stat[] = [
  { key: "years", value: 5, suffix: "+" },
  { key: "projects", value: null }, // TODO: confirm with client
  { key: "trucks", value: null }, // TODO: confirm with client
  { key: "properties", value: null }, // TODO: confirm with client
];
