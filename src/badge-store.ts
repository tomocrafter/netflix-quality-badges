import type { BadgeEntry } from "./extract";
import type { PlaybackBadges } from "./playback-badges";

export class BadgeStore {
  readonly #badges = new Map<number, PlaybackBadges>();
  readonly #listeners = new Set<() => void>();

  get(videoId: number): PlaybackBadges | undefined {
    return this.#badges.get(videoId);
  }

  addAll(entries: Iterable<BadgeEntry>): void {
    let added = false;
    for (const [videoId, badges] of entries) {
      this.#badges.set(videoId, badges);
      added = true;
    }
    if (added) for (const listener of this.#listeners) listener();
  }

  subscribe(listener: () => void): void {
    this.#listeners.add(listener);
  }
}
