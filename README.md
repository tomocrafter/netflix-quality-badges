# Netflix Quality Badges

A Chrome extension that shows which formats a Netflix title is available in — 4K, Dolby Vision, HDR, Dolby Atmos and 5.1 — right on the title cards, even on devices that cannot play them.

![4K / DV / HDR / Atmos / 5.1 badges on Netflix title cards](docs/screenshot.jpg)

## How it works

The Netflix web app already receives each title's `playbackBadges` in the GraphQL responses it fetches to render the browse and search pages. The extension observes those responses and draws the badges onto the matching title cards.

It never sends requests of its own, so Netflix sees exactly the same traffic as without the extension.

| Badge | Meaning |
| --- | --- |
| 4K / HD / SD | Highest available resolution |
| DV | Dolby Vision |
| HDR | HDR10 or HDR10+ |
| Atmos | Dolby Atmos |
| 5.1 | 5.1 surround |

The badges describe what the title is offered in. Actually watching in 4K or Atmos still requires a plan and a device that support it.

## Install

```sh
bun install
bun run build
```

Open `chrome://extensions`, enable Developer mode, choose **Load unpacked** and select the `dist` directory.

## Development

```sh
bun run lint       # oxlint
bun run typecheck  # tsc
bun run build      # bundle into dist/
bun run check      # all of the above
```

## Disclaimer

This project is not affiliated with or endorsed by Netflix.

## License

[MIT](LICENSE)
