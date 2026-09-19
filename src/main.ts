import { BadgeStore } from "./badges";
import { capturePlaybackBadges } from "./capture";
import { cardArtworks, detailSections } from "./netflix-dom";
import { renderCardOverlay, renderDetailPanel } from "./render";
import styles from "./styles.css" with { type: "text" };

const store = new BadgeStore();
const refresh = oncePerFrame(() => {
  for (const { element, videoId } of cardArtworks()) renderCardOverlay(element, store.labelsOf(videoId));
  for (const { element, videoId } of detailSections()) renderDetailPanel(element, store.labelsOf(videoId));
});

capturePlaybackBadges((entries) => store.addAll(entries));
store.subscribe(refresh);

document.addEventListener("DOMContentLoaded", () => {
  const style = document.createElement("style");
  style.textContent = styles;
  document.head.append(style);

  new MutationObserver(refresh).observe(document.body, {
    subtree: true,
    childList: true,
    attributeFilter: ["href"],
  });
  refresh();
});

function oncePerFrame(task: () => void): () => void {
  let pending = false;
  return () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
      pending = false;
      task();
    });
  };
}
