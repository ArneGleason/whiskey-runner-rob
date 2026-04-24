# Whiskey Runner Rob

A browser-playable rural PEI motorcycle prototype about Rob, a self-declared post-paycheque entrepreneur with a Suzuki-style cruiser, two shoulder parrots, and an acrylic riding dome that turns every errand into a mobile bird terrarium with liability issues.

Rob runs small, deeply questionable jobs up and down a country road: fetching dome polish, rescuing damp model kits, apologizing with cigars, transporting suspicious Clamato, and conducting porta-loo diplomacy. It is part delivery game, part rural gossip simulator, and part warning label for retirement hobbies.

## Play

Public build:

[https://arnegleason.github.io/whiskey-runner-rob/](https://arnegleason.github.io/whiskey-runner-rob/)

Local build:

Open `web/index.html` in a browser.

## Controls

- `WASD` / arrow keys: move on foot, throttle and steer on the bike.
- `E`, `Space`, or `Enter`: step outside, interact, mount, dismount, honk, or pick up the bike after physics files a complaint.
- `M`: open the mission browser and switch active errands.
- `R`: drop the selected inventory item.
- `F`: use the selected inventory item.
- `1` / `2` / `3`: select an inventory slot.
- `Shift`: move faster on foot.
- `END` on the intro screen: jump straight to Rob's end-of-day animation for testing.

## Current Prototype

- A flat scrolling intro introduces Rob, the parrots, the acrylic dome, the controls, and the first errand before play begins.
- Rob starts inside his house, walks out, mounts the cruiser, and rides the rural road outside his place.
- The map has river-side homes on the left, farm fields and equipment on the right, red dirt driveways, traffic, combines, NPC neighbours, and inspectable roadside nonsense.
- Mounted Rob has his signature clear dome and two parrots perched inside it, because dignity has apparently left the island.
- The mission chain currently has five errands:
  - Dome Polish Run
  - Model Kit Hostage Situation
  - Apology Cigars for Burt
  - Clamato Ceasefire
  - Septic Diplomacy
- Completing two starter errands opens the south-road section, which adds multi-leg missions, Low Tide Bait & Regret, the Legion Hall of Folding Chair Justice, the Blue Rocket porta-loo, a scenic ditch lookout, and more bad decisions with labels.
- Completing all five missions starts the end-of-day finale: dusk rolls in, Rob is guided home, and entering the house shows an animated couch scene with old Japanese monster movies, parrots, glowing snacks, and no remaining interest in commerce.

## Systems

- Inventory supports pickup, drop, re-pick, select, and use actions.
- Missions can be single-step or multi-leg pickup/drop chains.
- The mission browser lets Rob switch active errands, while the bottom mission dock gives wrapped guidance for the current objective and nearby interactions.
- Target markers and offscreen arrows point toward pickups, delivery spots, dropped mission items, and the final trip home.
- Rob can swim in the river, then climb back onto land like a man who has learned nothing.
- NPC neighbours can be talked to on foot, and they sprint away with panic bubbles when Rob approaches too closely on the motorcycle.
- Traffic brakes and steers around Rob; on-foot Rob panic-dodges threats; bike impacts can knock the cruiser down until Rob stands beside it and picks it back up.
- Lower-road potholes add a speed-management challenge by wobbling the bike or dropping it if Rob hits them too fast.
- Procedural sound effects provide countryside ambience, bird chirps, motorcycle rumble, horn, pickup/drop/use cues, crash/lift sounds, and mission-complete fanfare.

## Design Notes

The living world and mechanics bible is in `GAME_BIBLE.md`.

Version history is tracked in `CHANGELOG.md`.
