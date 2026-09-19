const CARD_SELECTOR = '[data-uia="standard-card"]';
const VIDEO_PATH = /\/(?:title|watch)\/(\d+)/;

export function findTitleCards(): NodeListOf<HTMLAnchorElement> {
  return document.querySelectorAll<HTMLAnchorElement>(CARD_SELECTOR);
}

export function videoIdOf(card: HTMLAnchorElement): number | undefined {
  const url = new URL(card.href);
  const id = url.searchParams.get("jbv") ?? VIDEO_PATH.exec(url.pathname)?.[1];
  return id ? Number(id) : undefined;
}

export function artworkOf(card: HTMLAnchorElement): HTMLElement | undefined {
  return card.querySelector("img")?.parentElement ?? undefined;
}
