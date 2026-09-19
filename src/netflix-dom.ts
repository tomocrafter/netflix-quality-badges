const STANDARD_CARD = '[data-uia="standard-card"]';
const TITLE_CARD = '[data-uia="titleCard--container"]';
const MODAL = '[data-uia^="modal-motion-container"]';
const METADATA = '[data-uia="videoMetadata--container"]';
const MODAL_INFO = '[data-uia="previewModal--info-container"]';
const TITLE_LINK = 'a[href*="/title/"]';
const TRACKING_CONTEXT = "data-ui-tracking-context";
const VIDEO_ID = /[?&]jbv=(\d+)|\/(?:title|watch)\/(\d+)/;

export interface Target {
  element: HTMLElement;
  videoId: number | undefined;
}

export function* cardArtworks(): Generator<Target> {
  for (const card of document.querySelectorAll<HTMLAnchorElement>(STANDARD_CARD)) {
    const element = card.querySelector("img")?.parentElement;
    if (element) yield { element, videoId: videoIdFromUrl(card.href) };
  }
}

export function* detailSections(): Generator<Target> {
  for (const modal of document.querySelectorAll<HTMLElement>(MODAL)) {
    const metadata = [...modal.querySelectorAll<HTMLElement>(METADATA)].find((el) => !el.closest(TITLE_CARD));
    const element = metadata ?? modal.querySelector<HTMLElement>(MODAL_INFO);
    if (element) yield { element, videoId: modalVideoId(modal) };
  }
  for (const card of document.querySelectorAll(TITLE_CARD)) {
    const element = card.querySelector<HTMLElement>(METADATA);
    if (element) yield { element, videoId: videoIdFromTrackingContext(card) };
  }
}

function modalVideoId(modal: HTMLElement): number | undefined {
  if (modal.dataset.uia?.endsWith("DETAIL_MODAL")) return videoIdFromUrl(location.href);
  const link = modal.querySelector<HTMLAnchorElement>(TITLE_LINK);
  return link ? videoIdFromUrl(link.href) : undefined;
}

function videoIdFromUrl(href: string): number | undefined {
  const match = VIDEO_ID.exec(href);
  const id = match?.[1] ?? match?.[2];
  return id ? Number(id) : undefined;
}

function videoIdFromTrackingContext(root: Element): number | undefined {
  const raw = root.querySelector(`[${TRACKING_CONTEXT}]`)?.getAttribute(TRACKING_CONTEXT);
  if (!raw) return undefined;
  try {
    const { video_id: videoId } = JSON.parse(decodeURIComponent(raw)) as { video_id?: unknown };
    return typeof videoId === "number" ? videoId : undefined;
  } catch {
    return undefined;
  }
}
