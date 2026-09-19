export type PlaybackBadges = readonly string[];
export type BadgeEntry = readonly [videoId: number, badges: PlaybackBadges];

const RESOLUTIONS = [
  ["VIDEO_ULTRA_HD", "4K"],
  ["VIDEO_HD", "HD"],
  ["VIDEO_SD", "SD"],
] as const;

const FEATURES = [
  { label: "DV", badges: ["VIDEO_DOLBY_VISION"] },
  { label: "HDR", badges: ["VIDEO_HDR", "VIDEO_HDR10_PLUS"] },
  { label: "Atmos", badges: ["AUDIO_DOLBY_ATMOS"] },
  { label: "5.1", badges: ["AUDIO_FIVE_DOT_ONE"] },
] as const;

const NO_LABELS: readonly string[] = [];

export class BadgeStore {
  readonly #labels = new Map<number, readonly string[]>();
  readonly #listeners = new Set<() => void>();

  labelsOf(videoId: number | undefined): readonly string[] {
    return videoId === undefined ? NO_LABELS : (this.#labels.get(videoId) ?? NO_LABELS);
  }

  addAll(entries: Iterable<BadgeEntry>): void {
    let added = false;
    for (const [videoId, badges] of entries) {
      this.#labels.set(videoId, toLabels(badges));
      added = true;
    }
    if (added) for (const listener of this.#listeners) listener();
  }

  subscribe(listener: () => void): void {
    this.#listeners.add(listener);
  }
}

function toLabels(badges: PlaybackBadges): string[] {
  const available = new Set(badges);
  const resolution = RESOLUTIONS.find(([badge]) => available.has(badge))?.[1];
  const features = FEATURES.filter((feature) => feature.badges.some((badge) => available.has(badge)));
  return [...(resolution ? [resolution] : []), ...features.map((feature) => feature.label)];
}
