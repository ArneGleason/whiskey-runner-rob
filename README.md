# Whiskey Runner Rob

A browser-playable rural PEI motorcycle prototype about Rob, a self-declared post-paycheque entrepreneur, his cruiser, his questionable delivery ambitions, and the acrylic parrot dome that nobody asked for but everyone must respect.

## Play Locally

Open `web/index.html` in a browser.

Controls:

- `WASD` / arrow keys: move on foot, throttle and steer on the bike.
- `E`, `Space`, or `Enter`: step outside, mount, dismount, or honk while moving.
- `M`: open the mission browser and switch active errands.
- `R`: drop the selected inventory item.
- `F`: use the selected inventory item.
- `1` / `2` / `3`: select an inventory slot.
- `Shift`: move faster on foot.

## Current Prototype

- A flat scrolling intro sets up Rob, the parrots, the acrylic dome, the controls, and the first errand before play begins.
- Rob starts inside his house.
- He can walk out, get on the motorcycle, and ride up and down the rural road.
- Houses and river land sit on the left side of the road.
- Farm fields, barns, crop rows, and fencing sit on the right side.
- Mounted Rob includes the clear acrylic dome and two parrots.
- The first mission sends Rob to the local hardware store for acrylic dome polish, then back to his garage to clean bug splatter off the parrot dome.
- Finishing the dome polish run unlocks two follow-up errands: a damp model-kit rescue and apology cigars for a tractor-owning neighbour.
- The mission browser lets Rob switch the active errand, while the bottom mission dock gives wrapped guidance for the next pickup, drop-off, or nearby interaction.
- Rob has a small inventory and can pick up, drop, select, and use carried items.
- Rob has a more natural on-foot walk cycle with alternating arm/leg swing and a bit of body bob.
- Rob can talk to roadside neighbours and inspect small Easter eggs while walking around.
- Traffic, tractors, delivery vans, and working combines add a little motion and roadside life.
- Road vehicles now brake and steer around Rob; on-foot Rob panic-hops out of danger, and bike impacts can knock the cruiser down until Rob picks it back up.
- Procedural sound effects provide ambient countryside noise, bird chirps, motorcycle engine rumble, horn, and inventory/mission feedback.

## Design Notes

The living world and mechanics bible is in `GAME_BIBLE.md`.

Version history is tracked in `CHANGELOG.md`.
