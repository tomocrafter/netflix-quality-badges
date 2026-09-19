export type PlaybackBadges = readonly string[];

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

export function toLabels(badges: PlaybackBadges): string[] {
  const available = new Set(badges);
  const resolution = RESOLUTIONS.find(([badge]) => available.has(badge))?.[1];
  const features = FEATURES.filter((feature) => feature.badges.some((badge) => available.has(badge)));
  return [...(resolution ? [resolution] : []), ...features.map((feature) => feature.label)];
}
