# Whiskey Runner Rob

Living world and mechanics bible for a browser-playable isometric motorcycle mission game.

## Core Pitch

Rob is a self-declared post-paycheque entrepreneur living near the farms of Prince Edward Island. He likes motorcycles, cigars, whiskey, strange gadgets, model kits, half-plausible business ideas, and doing favours for an ever-expanding cast of friends.

Now liberated from conventional paycheques and other adult supervision, Rob has developed a questionable but enthusiastic side business: running whiskey, cigars, and other odd goods from one end of PEI to the other on a big Suzuki-style cruiser motorcycle. Every run becomes a small mission. Every friend has a problem. Every road contains something ridiculous.

The game is an isometric, mission-based browser game with simple controls, cartoon graphics, crude absurd humour, and a growing island map full of recurring characters, hazards, shops, farm roads, ferry-adjacent chaos, beaches, red dirt, suspicious garages, and roadside nonsense.

## Design Pillars

1. **Simple to Play**
   - Runs in a browser from a URL.
   - Keyboard-first controls.
   - Short missions that are easy to understand.
   - Fast restarts and low friction.

2. **PEI as a Toy Island**
   - Not a realistic map simulator.
   - PEI is compressed into a funny, readable, isometric world.
   - Red dirt roads, farms, fishing villages, coastal roads, bridges, potato fields, cottages, gas stops, and odd local landmarks create the feel.

3. **Post-Paycheque Mission Chaos**
   - Rob is not saving the world.
   - Rob is delivering cigars, trading whiskey, fetching parts, helping buddies, and collecting things he finds deeply important.
   - The stakes are funny, personal, and increasingly absurd.

4. **Recognizable Characters**
   - Rob's friends should become recurring mission-givers, rivals, customers, helpers, and obstacles.
   - Characters should be visually simple but distinct: silhouette, color, vehicle, hat, posture, or prop.

5. **Crude, Absurd, But Warm**
   - The humour can be rough, petty, weird, and mildly profane.
   - Rob and friends are ridiculous, but not mean-spirited caricatures.
   - The island should feel fondly exaggerated.

## Tone

The tone is somewhere between:

- A rural errand simulator after two drinks.
- A Saturday morning cartoon for adults who forgot to grow up.
- A motorcycle delivery game where the main reward is acquiring junk Rob insists is "investment-grade."
- A cozy island game that occasionally swerves into nonsense.

Humour should come from:

- Overconfident bad plans.
- Tiny problems treated as major operations.
- Local gossip.
- Post-paycheque obsessions.
- Motorcycle inconvenience.
- Suspiciously specific errands.
- Objects Rob values far more than anyone else does.

## World

### Setting

The world is a compressed version of Prince Edward Island. It should feel coastal, agricultural, windy, red-dirt, and full of small communities connected by roads that are just dangerous enough to be funny.

### Visual Identity

- Isometric camera.
- Cartoon-like proportions.
- Simple shapes and readable silhouettes.
- Bright rural colors with PEI red dirt as a key map color.
- Roads, farm lanes, beach paths, driveways, and small-town streets.
- Buildings should read quickly from above: farmhouse, barn, garage, liquor-adjacent shop, cigar contact, diner, wharf, cottage, repair shed.
- Rob's strongest silhouette: big cruiser motorcycle, oversized clear acrylic shoulder dome, and two pet parrots perched inside the dome.

### Reference Assets

- `assets/reference/rob-parrot-dome-reference.jpeg`: Rob riding through PEI countryside with a special acrylic motorcycle dome that protects his two pet parrots, one perched on each shoulder.

### Starting Hub

**Rob's Place**

Rob's home base is a modest rural property near farms. It includes:

- House.
- Garage/workshop.
- Motorcycle parking spot.
- Whiskey and cigar stash.
- Collection shelves for acquired treasures.
- Mission board or answering machine.
- Driveway leading to the island road network.

The home base is where the player:

- Starts new missions.
- Reviews collected items.
- Upgrades the motorcycle.
- Meets recurring friends.
- Stores absurd trophies.

## Main Character

### Rob

Post-paycheque. Restless. Rides a large Suzuki-style cruiser motorcycle. Likes whiskey, cigars, mechanical tinkering, toy/model kits, strange electronics, and running errands that become business opportunities if explained with enough confidence.

Rob should feel:

- Capable but impulsive.
- Friendly but stubborn.
- Weirdly proud of bad ideas.
- Loyal to his friends.
- Mildly allergic to being told something is not worth the drive.

### The Parrot Dome

Rob has a custom clear acrylic motorcycle dome fitted around his riding position so his two pet parrots can ride on his shoulders. This is both a visual signature and a source of mechanics, jokes, and mission complications.

Design notes:

- The dome should read like a homemade luxury/safety invention, not sleek sci-fi gear.
- The parrots are always visible when Rob is in his iconic riding setup.
- The dome can catch glare, fog up, rattle, squeak, or collect bugs.
- NPCs should treat it as if Rob has explained it to them many, many times.
- Road signs, shop signs, and mission dialogue can reference "the dome" as local legend.

Possible uses:

- Protects fragile cargo from rain in some missions.
- Increases wind resistance or reduces handling in gusts.
- Makes Rob more recognizable, increasing attention.
- Lets parrots warn Rob about hazards.
- Causes trouble when parrots repeat things they should not.

### The Parrots

Rob's two parrots ride one on each shoulder inside the acrylic dome.

Working design direction:

- One is louder and more insulting.
- One is calmer but ominously observant.
- They can act as a comic chorus during missions.
- They may become lightweight gameplay helpers through warning chirps, item spotting, or distraction.

Open naming ideas:

- Needs names.
- Names should be short, funny to yell, and readable in dialogue bubbles.

### Rob's Core Loop

1. Wake up at home base.
2. Pick a mission from a friend, contact, or personal obsession.
3. Ride across the island.
4. Dodge obstacles, traffic, livestock, weather, bad roads, and rival nonsense.
5. Deliver, collect, barter, repair, or retrieve something.
6. Return home or chain into another mission.
7. Earn cash, favors, stash items, upgrades, and collectible junk.

## Motorcycle

Rob rides a big cruiser motorcycle inspired by a large Suzuki cruiser. It should feel heavy, loud, and slightly too much machine for quick errands.

### Desired Feel

- Easy arcade steering.
- Weighty turns.
- Skids or drift-like slides on dirt roads.
- Satisfying engine sound and visual lean.
- Funny low-speed handling around tight farm clutter.

### Possible Stats

- Speed.
- Handling.
- Cargo capacity.
- Durability.
- Noise.
- Style.
- Heat / attention.
- Dome condition.
- Parrot mood.

### Sound Direction

The first sound pass uses procedural browser audio instead of asset files.

Current sound cues:

- Ambient rural bed once play begins.
- Occasional bird chirps.
- Motorcycle engine rumble tied to riding speed.
- Horn while riding.
- Pickup, drop, use, mount, dismount, and mission-complete cues.

Keep early sound effects comic and readable rather than realistic. The horn should feel useful mostly as emotional support.

### Possible Upgrades

- Bigger saddlebags.
- Reinforced cargo rack.
- Mud tires.
- Better shocks.
- Louder pipes.
- Secret stash compartment.
- Cup holder nobody asked for.
- Decorative chrome.
- Sidecar, maybe as a late-game joke or mission modifier.
- Anti-fog dome coating.
- Dome bug deflector.
- Parrot perch stabilizers.
- Tiny in-dome snack tray.

## Core Gameplay

### Genre

Isometric arcade delivery / mission runner.

### Controls

Initial target:

- `W` / `Up`: accelerate or move north/up.
- `S` / `Down`: brake, reverse, or move south/down.
- `A` / `Left`: steer left.
- `D` / `Right`: steer right.
- `Space`: action / interact / honk / confirm.
- `Shift`: boost or careful-control modifier.
- Mouse: menu selection, mission selection, possible aiming for special actions.

Controls should remain simple enough that a player understands the game in 10 seconds.

### Mission Types

- Deliver whiskey.
- Deliver cigars.
- Pick up parts.
- Rescue a stalled friend.
- Race across the island before something melts, spills, dries out, or gets noticed.
- Retrieve a lost model kit, package, or mystery crate.
- Distract, avoid, or outrun a nuisance.
- Escort a fragile item.
- Find a person at a farm, wharf, cottage, or roadside stop.
- Trade one absurd item for another through a chain of friends.

### Obstacles

PEI-flavored hazards and interruptions:

- Tractors.
- Slow tourists.
- Gravel patches.
- Red mud.
- Potholes.
- Farm animals.
- Wind gusts.
- Construction cones.
- Seagulls at bad times.
- Confused rental cars.
- Sudden rain.
- Potato crates.
- Lobster traps near wharves.
- Ferry or bridge traffic backups.
- Roadside yard sales that tempt Rob off-mission.
- Dome glare.
- Dome fogging.
- Parrots yelling false alarms.
- Parrots yelling accurate alarms at inconvenient times.

### Failure States

Failure should be funny and forgiving.

Possible failures:

- Cargo breaks.
- Delivery timer expires.
- Motorcycle durability hits zero.
- Rob gets knocked off course.
- Rob loses too much stash.
- A friend gets annoyed and pays in insults instead of cash.

Avoid harsh punishment. Missions can restart quickly.

## Progression

Rob accumulates:

- Cash.
- Whiskey.
- Cigars.
- Favours.
- Motorcycle upgrades.
- Home base decorations.
- Collectible absurd objects.
- Reputation with friends and contacts.

### Collection Ideas

- Tesla coils.
- Plastic model kits.
- Rare whiskey bottles.
- Cigar boxes.
- Obsolete electronics.
- Motorcycle parts.
- Broken radios.
- Questionable antiques.
- Commemorative spoons.
- Tiny engines.
- Mystery tools.
- "Investment grade" junk.

Collections should appear visually at Rob's home base over time.

## Characters

This section will grow as we define Rob's friends.

Each character should eventually have:

- Name.
- Visual hook.
- Location.
- Personality.
- Relationship to Rob.
- Mission types.
- Favourite reward or trade item.
- Recurring joke.

### Character Template

```md
### Name

- **Location:**
- **Visual hook:**
- **Personality:**
- **Connection to Rob:**
- **Mission role:**
- **Recurring joke:**
```

## Map Regions

Early map regions can be exaggerated rather than geographically precise.

### Home Farms

Rob's rural home region. Farm roads, barns, red dirt, tractors, neighbours, and small back-road deliveries.

### Coastal Road

Curving roads, cliffs, cottages, wind, tourist traffic, beaches, and scenic hazards.

### Small Town Strip

Gas, diner, repair shop, questionable storefronts, parking-lot interactions, and errands involving gossip.

### Wharf

Fishing boats, crates, lobster traps, gull noise, wet boards, and characters who only appear at odd hours.

### Backwoods Garage

The upgrade and dubious engineering zone. Motorcycle work, weird parts, and experiments.

## Early Mission Sketches

### Mission 1: The Warm-Up Run

Rob needs to deliver a cigar box to a friend down the road. The route introduces steering, acceleration, interaction, and simple obstacles like potholes and a tractor.

### Mission 1A: Dome Polish Run

Rob needs acrylic dome polish from the local hardware store because the parrot dome has become a tragic museum of dead bugs. The player rides to MacLeod's Hardware-ish, picks up the polish, carries it in inventory, and brings it back to Rob's garage.

This mission exists to prove:

- Pickup.
- Inventory carry.
- Dropping and re-picking items.
- Using a selected item.
- Drop-off / delivery completion.
- A simple mission objective changing from pickup to return.

### Mission 1B: Model Kit Hostage Situation

Unlocked after Dome Polish Run. Rob hears that Gord's yard sale has a rare model kit sealed in damp cardboard and guarded by a man who thinks eBay is witchcraft. The player retrieves the Damp Model Kit and brings it back to Rob's garage before the cardboard fully returns to nature.

### Mission 1C: Apology Cigars for Burt

Unlocked after Dome Polish Run. Rob called Burt's tractor "a drunk fridge with tire disease." Diplomacy requires picking up Apology Cigars from Rob's garage and delivering them to Burt's tractor shed on the farm side.

### Mission 2: Red Dirt Express

A whiskey delivery has to cross farm roads after rain. Mud patches make the bike slide.

### Mission 3: The Model Kit Emergency

Rob hears about a rare plastic model kit at a yard sale. The player must detour, beat another collector, and return home without smashing the box.

### Mission 4: Cigar Chain

Rob trades cigars for a motorcycle part, then the part for a favour, then the favour for a weird gadget.

### Mission 5: Tesla Coil, Bad Idea

Rob transports a Tesla coil component across the island. It occasionally sparks, causing nearby traffic or animals to behave unpredictably.

### Mission 6: Dome Sweet Dome

Rob needs to test a fresh acrylic dome polish while carrying both parrots across windy farm roads. The dome keeps catching glare, but the parrots can spot hazards before Rob sees them.

### Mission 7: Polly Wants Contraband

One parrot learns a phrase from a cigar contact and starts repeating it at every stop. Rob has to complete deliveries while avoiding awkward conversations with nosy locals.

## Systems To Explore

### Cargo

Cargo can have properties:

- Fragile.
- Illegal-ish.
- Smelly.
- Heavy.
- Noisy.
- Time-sensitive.
- Tempting to Rob.

### Inventory

Rob has a small carried inventory for mission items and useful objects.

Current prototype behaviour:

- Rob can pick up world items.
- Rob can carry up to three inventory items.
- Rob can select an inventory slot.
- Rob can drop the selected item into the world.
- Rob can pick dropped items back up.
- Rob can use the selected item.
- Mission drop-offs can consume items from inventory.

Design direction:

- Keep the inventory small so the game stays about riding and errands, not menu management.
- Items should have funny use/drop messages even before they have deep mechanics.
- Mission items should use the same inventory functions as ordinary items wherever possible.

### Companions

Rob's parrots can become a light companion system.

Possible companion states:

- Calm.
- Excited.
- Annoyed.
- Hungry.
- Suspicious.
- Repeating something incriminating.

Possible effects:

- Early warning for obstacles.
- Bonus hints for hidden pickups.
- Temporary distraction for nearby characters.
- Extra mission dialogue.
- Handling penalty if they panic inside the dome.

### Reputation

Friends and communities may track simple reputation:

- Reliable.
- Reckless.
- Generous.
- Cheap.
- Loud.

Reputation can unlock missions, discounts, jokes, and alternate rewards.

### Heat / Attention

Not necessarily police-focused. "Heat" can mean the amount of attention Rob is attracting:

- Neighbours noticing.
- Tourists filming.
- Friends calling.
- Someone waiting impatiently.
- Rob's own bad explanation getting worse.

### Home Base Display

The home base should visibly change as Rob collects things:

- Shelves fill up.
- Garage gets cluttered.
- Bike upgrades appear.
- Trophy items get placed around the property.
- Friends occasionally hang around.

## Technical Direction

The game should run in a browser with no install. Early goal: a small web app that can be hosted statically.

### Candidate Approaches

1. **Plain HTML Canvas + JavaScript**
   - Best for keeping the first prototype simple.
   - Easy to host anywhere.
   - Good for hand-built arcade mechanics.

2. **Phaser**
   - Strong fit for 2D browser games.
   - Good asset, input, tilemap, animation, and camera support.
   - Likely best if the game grows beyond a tiny prototype.

3. **PixiJS**
   - Great renderer for custom 2D graphics.
   - More engine work required for gameplay systems.

Initial recommendation: start with a plain Canvas prototype or Phaser. If the goal is to move quickly into missions, maps, collisions, and menus, Phaser is probably the stronger choice.

## First Playable Prototype Target

The first playable version should prove:

- Isometric road scene.
- Rob on motorcycle.
- Keyboard movement.
- Simple camera follow.
- One pickup.
- One delivery destination.
- Timer or score.
- A few obstacles.
- Mission complete state.

### Minimum Content

- Rob's house.
- One farm road.
- One friend delivery point.
- A cigar box or whiskey crate.
- Tractor obstacle.
- Mud or pothole hazard.
- Mission-complete screen.

### Prototype 1: Home Road Slice

Implemented as a static browser prototype in `web/`.

Current playable scope:

- A flat scrolling intro sets up Rob, the parrot dome, basic controls, and the first objective before play begins.
- Rob starts inside his house.
- Rob can step out onto the property.
- Rob can walk to the parked cruiser in the driveway.
- Rob can mount and dismount the motorcycle.
- Rob can ride north and south on the rural road outside his house.
- Left side of the road has Rob's house, spaced rural homes, river edge, yards, and driveways.
- Right side of the road has fenced farm fields, barns, silos, and crop rows.
- Mounted Rob includes the clear acrylic dome and two parrots as his signature silhouette.
- The camera follows Rob on foot and on the bike.
- Dirt, yard, farm, road, and river-bank areas already have different handling implications.
- Rob has a three-slot inventory.
- Rob can pick up, drop, re-pick, and use carried items.
- First mission: fetch acrylic dome polish from MacLeod's Hardware-ish and bring it back to Rob's garage.
- Completing the first mission unlocks two branch missions: Model Kit Hostage Situation and Apology Cigars for Burt.
- A mission browser lets the player switch the active errand.
- A bottom mission dock provides wrapped guidance for the current mission and nearby walk-around interactions.
- The target marker points toward the current mission pickup, dropped mission item, or delivery point.
- On-foot Rob can talk to nearby neighbours and inspect small roadside Easter eggs.
- Moving pickup trucks, tractors, delivery vans, and field combines add early ambient life to the road slice.
- Road vehicles detect Rob, brake, and steer toward the shoulder to avoid him.
- On-foot Rob automatically panic-dodges out of the way when traffic or field equipment gets too close.
- Motorcycle impacts can knock the cruiser down; Rob must dismount, stand beside it, and press `E` to pick it back up.
- The river is now a swimmable terrain zone for on-foot Rob, with a separate head-and-arms swim animation and slower movement.
- On-foot NPCs detect Rob approaching on the motorcycle, run away with panic bubbles, and cannot be run over.
- Rob's on-foot walk cycle has alternating leg/arm swing and body bob.
- Procedural sound effects add ambience, birds, motorcycle engine rumble, horn, and inventory/mission cues.
- The speedometer displays a scaled rural-road `km/h` value instead of raw world units.

Prototype controls:

- `WASD` / arrow keys: move on foot, throttle and steer on bike.
- `E`, `Space`, or `Enter`: step out, mount, dismount, or honk while moving.
- `M`: open the mission browser and switch active errands.
- `R`: drop selected inventory item.
- `F`: use selected inventory item.
- `1`, `2`, `3`: select inventory slot.
- `Shift`: move faster on foot.

## Open Questions

- Is the motorcycle controlled like a vehicle with turning and acceleration, or like direct 8-way movement?
- How big should the island map feel in the first version?
- Should missions be selected from Rob's home, or should the player freely ride into them?
- How crude should the humour get?
- Should there be voice/text dialogue bubbles?
- Should Rob ever dismount, or is the whole game motorcycle-based?
- Should the art be tile-based, sprite-based, or simple procedural shapes at first?
- What are the first three friends we want to build?

## Development Notes

Keep this file alive. Add decisions as they become real, move rejected ideas into a parking lot, and let the game discover its funniest version through prototypes.
