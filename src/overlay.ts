const OVERLAY_CLASS = "nqb-badges";

export function renderOverlay(host: HTMLElement, labels: readonly string[]): void {
  const key = labels.join(" ");
  const current = host.querySelector<HTMLElement>(`:scope > .${OVERLAY_CLASS}`);
  if ((current?.dataset.key ?? "") === key) return;

  current?.remove();
  if (labels.length > 0) host.append(createOverlay(labels, key));
}

function createOverlay(labels: readonly string[], key: string): HTMLElement {
  const overlay = document.createElement("div");
  overlay.className = OVERLAY_CLASS;
  overlay.dataset.key = key;
  overlay.append(...labels.map(createLabel));
  return overlay;
}

function createLabel(text: string): HTMLElement {
  const label = document.createElement("span");
  label.dataset.label = text;
  label.textContent = text;
  return label;
}
