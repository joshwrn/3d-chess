# Chess AI Search Lab UI

## Reference capture

- Reference: [Chess.com Play Bots](https://www.chess.com/play/computer)
- Captured with Firecrawl on 2026-10-22 at 1440 × 900; the page displayed its introductory modal, so board-square measurements are visual estimates rather than sampled CSS values.
- The extracted Chess.com branding lists primary green `#5D9948`, dark interface background `#302E2B`, and Chess Sans headings. The local project keeps its existing Be Vietnam Pro typography and dark analysis sidebar.

## Board and interface tokens

| Role | Value | Status |
| --- | --- | --- |
| Default light square | `#EEEED2` | Proposed classic green/cream board palette |
| Default dark square | `#769656` | Proposed classic green/cream board palette |
| Last-move highlight | `#BACB48` | Local proposed accent |
| Main play surface | `#302E2B` with a subtle charcoal-green radial tint | Chess.com branding reference, adapted for the demo stage |
| 3D viewport backdrop | `#BAC4B8` | Muted sage gray, scoped to the 3D frame |
| 2D board mat | `#252421` | Local implementation choice |
| Sidebar | Existing charcoal and muted green tokens | Preserved from the project |

## Layout and controls

- Desktop uses a fixed viewport-height shell with the analysis sidebar scrolling independently when its trace grows.
- The board stage has its own light neutral surface; the 3D canvas backdrop is confined to the board frame.
- The 3D board keeps a 16:9 frame; the 2D board stays square. Both modes share the same color state.
- The compact toolbar provides Chess.com-inspired green, warm wood, blue, and purple presets, plus independent light-square and dark-square color inputs. The chosen colors persist in local storage.
- Existing shadcn Select and ToggleGroup components handle presets and board/view switching. Existing vector chess icons remain in the 2D board.

## Implementation notes

- Board-square color values are configurable and intentionally approximate a familiar green/cream chess theme; the reference capture did not expose a clean, unobstructed board for pixel sampling.
- The board background and the page background are separate design surfaces by request.
- The search badge sits over the board with a translucent green surface and stays above 2D pieces.
- No remote Chess.com imagery or font assets are embedded in the local UI.
