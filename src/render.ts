const OVERLAY_CLASS = "nqb-overlay";
const PANEL_CLASS = "nqb-panel";
const NETFLIX_QUALITY_BADGES = ".player-feature-badge, .spatial-audio";

const MESSAGES = {
  ja: { available: "作品の対応", playableHere: "この環境で再生" },
  en: { available: "Available in", playableHere: "Playable here" },
};

export function renderCardOverlay(artwork: HTMLElement, labels: readonly string[]): void {
  const key = labels.join(" ");
  const current = artwork.querySelector<HTMLElement>(`:scope > .${OVERLAY_CLASS}`);
  if ((current?.dataset.key ?? "") === key) return;

  current?.remove();
  if (labels.length === 0) return;

  const overlay = document.createElement("div");
  overlay.className = OVERLAY_CLASS;
  overlay.dataset.key = key;
  overlay.append(...labels.map(createBadge));
  artwork.append(overlay);
}

export function renderDetailPanel(container: HTMLElement, labels: readonly string[]): void {
  const playable = [...container.querySelectorAll(NETFLIX_QUALITY_BADGES)].filter((badge) => !badge.closest(`.${PANEL_CLASS}`));
  const key = [...labels, "|", ...playable.map((badge) => badge.textContent || badge.className)].join(" ");
  const current = container.querySelector<HTMLElement>(`:scope > .${PANEL_CLASS}`);
  if (current?.dataset.key === key) return;

  current?.remove();
  if (labels.length === 0) return;

  const text = document.documentElement.lang.startsWith("ja") ? MESSAGES.ja : MESSAGES.en;
  const panel = document.createElement("dl");
  panel.className = PANEL_CLASS;
  panel.dataset.key = key;
  panel.append(...row(text.available, labels.map(createBadge)));
  if (playable.length > 0) panel.append(...row(text.playableHere, playable.map((badge) => badge.cloneNode(true))));
  container.append(panel);
}

function createBadge(label: string): HTMLElement {
  const badge = document.createElement("span");
  badge.className = "nqb-badge";
  badge.dataset.label = label;
  badge.textContent = label;
  return badge;
}

function row(term: string, items: readonly Node[]): HTMLElement[] {
  const dt = document.createElement("dt");
  dt.textContent = term;
  const dd = document.createElement("dd");
  dd.append(...items);
  return [dt, dd];
}
