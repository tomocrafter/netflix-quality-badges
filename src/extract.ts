import type { PlaybackBadges } from "./playback-badges";

export type BadgeEntry = readonly [videoId: number, badges: PlaybackBadges];

export function* extractPlaybackBadges(node: unknown): Generator<BadgeEntry> {
  if (Array.isArray(node)) {
    for (const item of node) yield* extractPlaybackBadges(item);
    return;
  }
  if (!isRecord(node)) return;

  const { videoId, playbackBadges } = node;
  if (typeof videoId === "number" && isStringArray(playbackBadges)) yield [videoId, playbackBadges];

  for (const value of Object.values(node)) yield* extractPlaybackBadges(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}
