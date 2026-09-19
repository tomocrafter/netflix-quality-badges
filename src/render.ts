const PANEL_CLASS = "nqb-panel";
const NETFLIX_QUALITY_BADGES = ".player-feature-badge, .spatial-audio";

const MESSAGES = {
  ja: { available: "作品の対応", playableHere: "この環境で再生" },
  en: { available: "Available in", playableHere: "Playable here" },
};

const rendered = new WeakMap<HTMLElement, HTMLElement>();

export function renderCardOverlay(artwork: HTMLElement, labels: readonly string[]): void {
  renderInto(artwork, labels.join(" "), () => {
    if (labels.length === 0) return undefined;
    const overlay = document.createElement("div");
    overlay.className = "nqb-overlay";
    overlay.append(...labels.map(createBadge));
    return overlay;
  });
}

export function renderDetailPanel(container: HTMLElement, labels: readonly string[]): void {
  const playable = [...container.querySelectorAll(NETFLIX_QUALITY_BADGES)].filter((badge) => !badge.closest(`.${PANEL_CLASS}`));
  const key = [...labels, "|", ...playable.map((badge) => badge.textContent || badge.className)].join(" ");

  renderInto(container, key, () => {
    if (labels.length === 0) return undefined;
    const text = document.documentElement.lang.startsWith("ja") ? MESSAGES.ja : MESSAGES.en;
    const panel = document.createElement("dl");
    panel.className = PANEL_CLASS;
    panel.append(...row(text.available, labels.map(createBadge)));
    if (playable.length > 0) panel.append(...row(text.playableHere, playable.map((badge) => badge.cloneNode(true))));
    return panel;
  });
}

function renderInto(host: HTMLElement, key: string, create: () => HTMLElement | undefined): void {
  const current = rendered.get(host);
  const attached = current?.parentElement === host ? current : undefined;
  if ((attached?.dataset.key ?? "") === key) return;

  attached?.remove();
  const next = create();
  if (!next) {
    rendered.delete(host);
    return;
  }
  next.dataset.key = key;
  host.append(next);
  rendered.set(host, next);
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
