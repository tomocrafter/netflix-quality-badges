import { BadgeStore } from "./badge-store";
import { decorateTitleCards } from "./decorate";
import { extractPlaybackBadges } from "./extract";
import { observeGraphQLResponses } from "./graphql-interceptor";
import { oncePerFrame } from "./schedule";

const store = new BadgeStore();
const refresh = oncePerFrame(() => decorateTitleCards(store));

observeGraphQLResponses((body) => store.addAll(extractPlaybackBadges(body)));
store.subscribe(refresh);

document.addEventListener("DOMContentLoaded", () => {
  new MutationObserver(refresh).observe(document.body, {
    subtree: true,
    childList: true,
    attributeFilter: ["href"],
  });
  refresh();
});
