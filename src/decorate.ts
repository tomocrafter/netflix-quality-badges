import type { BadgeStore } from "./badge-store";
import { renderOverlay } from "./overlay";
import { toLabels } from "./playback-badges";
import { artworkOf, findTitleCards, videoIdOf } from "./title-cards";

export function decorateTitleCards(store: BadgeStore): void {
  for (const card of findTitleCards()) {
    const artwork = artworkOf(card);
    if (!artwork) continue;

    const videoId = videoIdOf(card);
    const badges = videoId === undefined ? undefined : store.get(videoId);
    renderOverlay(artwork, badges ? toLabels(badges) : []);
  }
}
