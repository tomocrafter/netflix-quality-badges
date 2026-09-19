import type { BadgeEntry } from "./badges";

export function capturePlaybackBadges(onCapture: (entries: Iterable<BadgeEntry>) => void): void {
  const nativeFetch = window.fetch;

  window.fetch = (input, init) =>
    nativeFetch(input, init).then((response) => {
      if (isGraphQL(input)) {
        response
          .clone()
          .json()
          .then((body) => onCapture(extract(body)))
          .catch(() => {});
      }
      return response;
    });
}

function isGraphQL(input: RequestInfo | URL): boolean {
  const url = input instanceof Request ? input.url : String(input);
  return new URL(url, location.href).pathname.endsWith("/graphql");
}

function* extract(node: unknown): Generator<BadgeEntry> {
  if (Array.isArray(node)) {
    for (const item of node) yield* extract(item);
    return;
  }
  if (!isRecord(node)) return;

  const { videoId, playbackBadges } = node;
  if (typeof videoId === "number" && isStringArray(playbackBadges)) yield [videoId, playbackBadges];

  for (const value of Object.values(node)) yield* extract(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}
