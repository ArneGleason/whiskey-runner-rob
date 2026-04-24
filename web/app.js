(() => {
  const canvas = document.querySelector("#game");
  const ctx = canvas.getContext("2d");

  const modeLabel = document.querySelector("#modeLabel");
  const speedLabel = document.querySelector("#speedLabel");
  const placeLabel = document.querySelector("#placeLabel");
  const missionLabel = document.querySelector("#missionLabel");
  const missionDockTitle = document.querySelector("#missionDockTitle");
  const inventoryLabel = document.querySelector("#inventoryLabel");
  const guideLabel = document.querySelector("#guideLabel");
  const toast = document.querySelector("#toast");
  const introOverlay = document.querySelector("#introOverlay");
  const introStart = document.querySelector("#introStart");
  const introScroll = document.querySelector("#introCopy");
  const missionButton = document.querySelector("#missionButton");
  const missionOverlay = document.querySelector("#missionOverlay");
  const missionList = document.querySelector("#missionList");
  const missionClose = document.querySelector("#missionClose");
  const endingOverlay = document.querySelector("#endingOverlay");
  const endingClose = document.querySelector("#endingClose");
  const endingCanvas = document.querySelector("#endingCanvas");
  const endingCtx = endingCanvas.getContext("2d");

  const world = {
    minX: -760,
    maxX: 760,
    minY: -2450,
    maxY: 3250,
    roadX: 0,
    roadWidth: 156,
    roadShoulder: 36,
    riverLeft: -760,
    riverRight: -585,
    riverBankWidth: 22,
  };

  const homeDoor = { x: -292, y: 46 };
  const drivewayY = 72;
  const bike = {
    x: -64,
    y: drivewayY,
    heading: -Math.PI / 2,
    speed: 0,
    fallen: false,
    fallSide: 1,
    lastHazardAt: 0,
  };

  const speedometerScale = 0.16;

  const rob = {
    mode: "home",
    x: homeDoor.x,
    y: homeDoor.y,
    heading: -Math.PI / 2,
    footSpeed: 148,
    walkTime: 0,
    isWalking: false,
    panicUntil: 0,
    panicVectorX: 0,
    panicVectorY: 0,
    lastPanicSayAt: 0,
    wasSwimming: false,
  };

  const camera = {
    x: -170,
    y: 40,
  };

  const input = {
    up: false,
    down: false,
    left: false,
    right: false,
    run: false,
    actionQueued: false,
    dropQueued: false,
    useQueued: false,
    selectedQueued: null,
  };

  const homes = [
    { x: -338, y: 36, wall: "#f0d9b8", roof: "#a9422d", primary: true, garage: true },
    { x: -390, y: -610, wall: "#e5efe4", roof: "#416d82" },
    { x: -318, y: -1180, wall: "#f4edd9", roof: "#7c3d32", shed: true },
    { x: -410, y: -1830, wall: "#d9e8f2", roof: "#42576f" },
    { x: -370, y: 650, wall: "#fff0cf", roof: "#866038" },
    { x: -315, y: 1315, wall: "#e8d2c7", roof: "#693838", shed: true },
    { x: -430, y: 2025, wall: "#d6e7d5", roof: "#4f6a45" },
    { x: -382, y: 2860, wall: "#f1dfc1", roof: "#5f4b6e", shed: true },
  ];

  const fields = [
    { x: 146, y: -2350, w: 470, h: 430, fill: "#c99743", rows: "#9f7630" },
    { x: 166, y: -1810, w: 520, h: 500, fill: "#82ad55", rows: "#638d3c", barn: true },
    { x: 150, y: -1160, w: 430, h: 440, fill: "#d1b75c", rows: "#a6903d" },
    { x: 172, y: -510, w: 510, h: 500, fill: "#70a84f", rows: "#4f8435", silo: true },
    { x: 158, y: 110, w: 480, h: 460, fill: "#c68c41", rows: "#96692e" },
    { x: 178, y: 755, w: 500, h: 540, fill: "#8dbd59", rows: "#6f9d42", barn: true },
    { x: 148, y: 1515, w: 460, h: 500, fill: "#d8bd63", rows: "#a78b38" },
    { x: 170, y: 2180, w: 505, h: 410, fill: "#73a84c", rows: "#588536" },
    { x: 152, y: 2730, w: 520, h: 430, fill: "#c78c46", rows: "#93652e", silo: true },
  ];

  const hardwareStore = {
    x: -362,
    y: -840,
    counterX: -262,
    counterY: -792,
    name: "MacLeod's Hardware-ish",
  };

  const yardSale = {
    x: -388,
    y: 930,
    tableX: -250,
    tableY: 1000,
    name: "Gord's Yard Sale of Damp Regret",
  };

  const tractorShed = {
    x: 370,
    y: 720,
    r: 82,
    name: "Burt's Tractor Shed",
  };

  const southGate = {
    y: 1460,
    name: "Road Crew Barricade of Selective Progress",
  };

  const baitShack = {
    x: -382,
    y: 1710,
    counterX: -256,
    counterY: 1784,
    name: "Low Tide Bait & Regret",
  };

  const legionHall = {
    x: -374,
    y: 2390,
    counterX: -244,
    counterY: 2466,
    r: 86,
    name: "Legion Hall of Folding Chair Justice",
  };

  const blueRocket = {
    x: 326,
    y: 1988,
    r: 78,
    name: "The Blue Rocket Porta-Loo",
  };

  const ferryLookout = {
    x: 346,
    y: 2820,
    r: 82,
    name: "Ferry Lookout That Is Mostly Ditch",
  };

  const garageDrop = {
    x: -150,
    y: 112,
    r: 72,
    name: "Rob's garage",
  };

  const garageShelf = {
    x: -155,
    y: 118,
    r: 70,
    name: "Rob's garage shelf",
  };

  const itemTypes = {
    domePolish: {
      id: "domePolish",
      name: "Dome Polish",
      shortName: "Dome Polish",
      tag: "BUG",
      color: "#9ee8ff",
      accent: "#fff7a8",
      useText: "Rob buffs one perfect little circle. The parrots can now see every bug that died for this commute.",
      dropText: "Rob sets down the dome polish like it is evidence.",
    },
    modelKit: {
      id: "modelKit",
      name: "Damp Model Kit",
      shortName: "Model Kit",
      tag: "KIT",
      color: "#f5d36e",
      accent: "#315f8f",
      useText: "Rob sniffs the box. It smells like basement, glue, and a custody dispute over hobby supplies.",
      dropText: "Rob gently sets down the model kit. Somewhere, a tiny unbuilt battleship feels abandoned.",
    },
    apologyCigars: {
      id: "apologyCigars",
      name: "Apology Cigars",
      shortName: "Cigars",
      tag: "OWE",
      color: "#8b5738",
      accent: "#ffd18a",
      useText: "Rob opens the box and calls it aromatherapy for men avoiding accountability.",
      dropText: "Rob drops the apology cigars. That is either generosity or evidence tampering.",
    },
    clamatoJug: {
      id: "clamatoJug",
      name: "Suspicious Clamato Jug",
      shortName: "Clamato",
      tag: "CLM",
      color: "#d45d4c",
      accent: "#ffd9a6",
      useText: "Rob sniffs the jug and immediately loses an argument with shellfish and tomato.",
      dropText: "Rob sets down the Clamato with the caution normally reserved for unstable science.",
    },
    parrotMints: {
      id: "parrotMints",
      name: "Industrial Parrot Mints",
      shortName: "Mints",
      tag: "MNT",
      color: "#baf0d8",
      accent: "#356f61",
      useText: "Rob considers feeding the parrots industrial mints, then remembers they know where he sleeps.",
      dropText: "Rob drops the mints. The ground briefly smells like dental regret.",
    },
    septicTabs: {
      id: "septicTabs",
      name: "Blue Rocket Septic Tabs",
      shortName: "Septic Tabs",
      tag: "TAB",
      color: "#82c2ef",
      accent: "#f7ef9a",
      useText: "Rob reads the label: 'Do not combine with pride.' Finally, clear instructions.",
      dropText: "Rob drops the septic tabs and pretends that was part of the treatment plan.",
    },
    dignityReceipt: {
      id: "dignityReceipt",
      name: "Dignity Receipt",
      shortName: "Receipt",
      tag: "RCP",
      color: "#f4e2a8",
      accent: "#7c4b37",
      useText: "The receipt proves dignity happened nearby, briefly, under protest.",
      dropText: "Rob drops the dignity receipt. The receipt appreciates the thematic consistency.",
    },
  };

  const inventory = {
    capacity: 3,
    slots: [],
    selected: 0,
  };

  const missionDefs = {
    domePolishRun: {
      id: "domePolishRun",
      title: "Dome Polish Run",
      summary: "Fetch acrylic dome polish so the parrots can once again see the bugs coming before they become paste.",
      item: "domePolish",
      pickup: { x: hardwareStore.counterX, y: hardwareStore.counterY, r: 74, label: "Dome polish", place: hardwareStore.name },
      drop: { x: garageDrop.x, y: garageDrop.y, r: garageDrop.r, label: "Rob's garage", place: garageDrop.name },
      pickupGuide: "Ride north to MacLeod's Hardware-ish and grab the dome polish.",
      returnGuide: "Bring the dome polish back to Rob's garage before the birds unionize.",
      completeGuide: "The dome is cleaner. Rob is spiritually worse. Press M to pick the next errand.",
      pickupText: "Picked up Dome Polish. The clerk says it is 'probably safe on acrylic.'",
      completeText: "Mission complete: Rob drops off the polish. Two parrots admire a bug-free future and immediately smudge the dome.",
      unlocks: ["modelKitSnatch", "apologyCigars"],
    },
    modelKitSnatch: {
      id: "modelKitSnatch",
      title: "Model Kit Hostage Situation",
      summary: "A yard sale has a rare model kit sealed in damp cardboard and guarded by a man who thinks eBay is witchcraft.",
      item: "modelKit",
      pickup: { x: yardSale.tableX, y: yardSale.tableY, r: 78, label: "Damp model kit", place: yardSale.name },
      drop: { x: garageDrop.x, y: garageDrop.y, r: garageDrop.r, label: "Rob's garage", place: garageDrop.name },
      pickupGuide: "Ride south to Gord's yard sale and rescue the damp model kit.",
      returnGuide: "Bring the model kit back to Rob's garage before the cardboard fully returns to nature.",
      completeGuide: "The model kit is safe, which is more than anyone can say for Rob's priorities.",
      pickupText: "Picked up the Damp Model Kit. It has forty-seven pieces and one smell.",
      completeText: "Mission complete: Rob shelves the kit and whispers 'investment grade' at a box of old plastic.",
      unlocks: [],
    },
    apologyCigars: {
      id: "apologyCigars",
      title: "Apology Cigars for Burt",
      summary: "Rob called Burt's tractor 'a drunk fridge with tire disease.' Now diplomacy requires cigars.",
      item: "apologyCigars",
      pickup: { x: garageShelf.x, y: garageShelf.y, r: garageShelf.r, label: "Apology cigars", place: garageShelf.name },
      drop: { x: tractorShed.x, y: tractorShed.y, r: tractorShed.r, label: "Burt's tractor shed", place: tractorShed.name },
      pickupGuide: "Grab the apology cigars from Rob's garage shelf.",
      returnGuide: "Deliver the cigars to Burt's tractor shed on the farm side. Try not to editorialize.",
      completeGuide: "Burt accepts the cigars. The tractor remains a crime against forward motion.",
      pickupText: "Picked up Apology Cigars. Rob insists they are cheaper than personal growth.",
      completeText: "Mission complete: Burt accepts the cigars and upgrades Rob from 'jackass' to 'useful jackass.'",
      unlocks: [],
    },
    clamatoCeasefire: {
      id: "clamatoCeasefire",
      title: "Clamato Ceasefire",
      summary: "Two stops: haul a suspicious jug to the Legion, then bring home industrial parrot mints before the birds weaponize their breath.",
      lockedText: "Locked until two starter errands are complete and the south road stops pretending it is municipal infrastructure",
      legs: [
        {
          item: "clamatoJug",
          pickup: { x: baitShack.counterX, y: baitShack.counterY, r: 78, label: "Clamato jug", place: baitShack.name },
          drop: { x: legionHall.counterX, y: legionHall.counterY, r: legionHall.r, label: "Legion hall", place: legionHall.name },
          pickupGuide: "Ride south past the newly opened barricade to Low Tide Bait & Regret and pick up the suspicious Clamato jug.",
          returnGuide: "Deliver the Clamato to the Legion Hall before poker night becomes a tomato-forward crime scene.",
          pickupText: "Picked up the Suspicious Clamato Jug. It sloshes like it knows a lawyer.",
          dropText: "Stage complete: the Legion accepts the jug and pays Rob in industrial parrot mints, because cash has standards.",
        },
        {
          item: "parrotMints",
          pickup: { x: legionHall.counterX + 26, y: legionHall.counterY - 8, r: 76, label: "Parrot mints", place: legionHall.name },
          drop: { x: garageDrop.x, y: garageDrop.y, r: garageDrop.r, label: "Rob's garage", place: garageDrop.name },
          pickupGuide: "Grab the industrial parrot mints from the Legion counter. They are beside the ashtray labelled 'heritage.'",
          returnGuide: "Bring the mints back to Rob's garage before the parrots breathe directly onto the acrylic dome.",
          pickupText: "Picked up Industrial Parrot Mints. The tin says 'not tested on birds with grudges.'",
          dropText: "Mission complete: Rob stores the mints near the dome polish. The parrots plan a mint-assisted insult campaign.",
        },
      ],
      completeGuide: "The mints are home. Rob's business now has seafood tomato exposure and breath-risk mitigation.",
      completeText: "Mission complete: Rob neutralizes the parrot breath situation with something that smells like a hospital married a candy cane.",
      unlocks: [],
    },
    septicDiplomacy: {
      id: "septicDiplomacy",
      title: "Septic Diplomacy",
      summary: "Two stops: dose the Blue Rocket porta-loo, then bring the dignity receipt to the scenic ditch lookout like a normal adult.",
      lockedText: "Locked until two starter errands are complete and Rob earns access to lower-road consequences",
      legs: [
        {
          item: "septicTabs",
          pickup: { x: baitShack.counterX - 22, y: baitShack.counterY + 34, r: 76, label: "Septic tabs", place: baitShack.name },
          drop: { x: blueRocket.x, y: blueRocket.y, r: blueRocket.r, label: "Blue Rocket", place: blueRocket.name },
          pickupGuide: "Pick up septic tabs at Low Tide Bait & Regret. The clerk calls them 'blue mercy biscuits.'",
          returnGuide: "Take the septic tabs to the Blue Rocket porta-loo on the farm side, then stand back spiritually.",
          pickupText: "Picked up Blue Rocket Septic Tabs. Rob tries not to read the ingredients because he enjoys hope.",
          dropText: "Stage complete: Rob doses the Blue Rocket. Something inside burps with municipal confidence and prints a receipt.",
        },
        {
          item: "dignityReceipt",
          pickup: { x: blueRocket.x + 34, y: blueRocket.y + 26, r: 74, label: "Dignity receipt", place: blueRocket.name },
          drop: { x: ferryLookout.x, y: ferryLookout.y, r: ferryLookout.r, label: "ditch lookout", place: ferryLookout.name },
          pickupGuide: "Collect the dignity receipt from beside the Blue Rocket. Use two fingers and emotional distance.",
          returnGuide: "Deliver the dignity receipt to the ferry lookout that is mostly ditch. The island demands closure.",
          pickupText: "Picked up the Dignity Receipt. It is damp, stamped, and legally upsetting.",
          dropText: "Mission complete: Rob files the dignity receipt at the scenic ditch. The ditch declines to comment.",
        },
      ],
      completeGuide: "The porta-loo accord is complete. Civilization survives, though nobody is proud of the paperwork.",
      completeText: "Mission complete: Rob saves the Blue Rocket and files the receipt in a ditch with better governance than expected.",
      unlocks: [],
    },
  };

  const missionStates = {
    domePolishRun: { state: "pickup", unlocked: true, complete: false },
    modelKitSnatch: { state: "locked", unlocked: false, complete: false },
    apologyCigars: { state: "locked", unlocked: false, complete: false },
    clamatoCeasefire: { state: "locked", unlocked: false, complete: false, legIndex: 0 },
    septicDiplomacy: { state: "locked", unlocked: false, complete: false, legIndex: 0 },
  };

  let activeMissionId = "domePolishRun";

  const starterMissionIds = ["domePolishRun", "modelKitSnatch", "apologyCigars"];
  const southMissionIds = ["clamatoCeasefire", "septicDiplomacy"];
  const allMissionIds = Object.keys(missionDefs);

  const worldItems = [
    createWorldItem("domePolish", hardwareStore.counterX, hardwareStore.counterY, "hardware", "domePolishRun"),
  ];

  const npcs = [
    {
      id: "mavis",
      name: "Mavis",
      baseX: -286,
      baseY: -530,
      x: -286,
      y: -530,
      radiusX: 36,
      radiusY: 24,
      phase: 0.4,
      color: "#623f7f",
      accent: "#ffdf9a",
      skin: "#d79b72",
      hat: "#f5e7b8",
      talkIndex: 0,
      bubbleText: "",
      bubbleUntil: 0,
      lines: [
        "Tell your dome I can still see last Tuesday's bug on it.",
        "If your parrots repeat what I said at bingo, I am suing the beak.",
        "That motorcycle sounds like a chainsaw farting into a soup can.",
      ],
    },
    {
      id: "gord",
      name: "Gord",
      baseX: -265,
      baseY: 960,
      x: -265,
      y: 960,
      radiusX: 28,
      radiusY: 18,
      phase: 2.1,
      color: "#2f5b7a",
      accent: "#d8b35d",
      skin: "#c88962",
      hat: "#4c3528",
      talkIndex: 0,
      bubbleText: "",
      bubbleUntil: 0,
      lines: [
        "Cash only. Also trades for batteries, lies, and tires with most of the tire left.",
        "That model kit is rare because everyone with sense threw it out.",
        "If it smells damp, that means it has character and probably mold.",
      ],
    },
    {
      id: "burt",
      name: "Burt",
      baseX: 325,
      baseY: 742,
      x: 325,
      y: 742,
      radiusX: 42,
      radiusY: 22,
      phase: 4.3,
      color: "#5f7f36",
      accent: "#2d3228",
      skin: "#ce9067",
      hat: "#cfd36b",
      talkIndex: 0,
      bubbleText: "",
      bubbleUntil: 0,
      lines: [
        "If those are apology cigars, I want apology matches too.",
        "My tractor is not a drunk fridge. It is a sober fridge with a difficult past.",
        "Your dome has more polish budget than my wedding.",
      ],
    },
    {
      id: "darlene",
      name: "Darlene",
      baseX: -300,
      baseY: 690,
      x: -300,
      y: 690,
      radiusX: 32,
      radiusY: 26,
      phase: 5.6,
      color: "#9c5846",
      accent: "#f5d58c",
      skin: "#d9a06f",
      hat: "#355d57",
      talkIndex: 0,
      bubbleText: "",
      bubbleUntil: 0,
      lines: [
        "Rob, your bike woke my bread dough, and now it has opinions.",
        "One parrot called my casserole 'structural.' I want an apology.",
        "If that dome fogs up again, just follow the smell of poor decisions home.",
      ],
    },
    {
      id: "cecil",
      name: "Cecil",
      baseX: -286,
      baseY: 1748,
      x: -286,
      y: 1748,
      radiusX: 34,
      radiusY: 22,
      phase: 1.35,
      color: "#5b493e",
      accent: "#a8d3d2",
      skin: "#c98c64",
      hat: "#273b43",
      talkIndex: 0,
      bubbleText: "",
      bubbleUntil: 0,
      lines: [
        "If the jug hisses, charge extra and don't make eye contact.",
        "Bait, regret, and tomato clam slurry all go on the same invoice here.",
        "Your parrots keep asking if I sell tiny helmets. I respect their fear.",
      ],
    },
    {
      id: "miriam",
      name: "Miriam",
      baseX: -278,
      baseY: 2438,
      x: -278,
      y: 2438,
      radiusX: 38,
      radiusY: 20,
      phase: 3.75,
      color: "#485f8f",
      accent: "#f2d28d",
      skin: "#d99a6c",
      hat: "#7a2734",
      talkIndex: 0,
      bubbleText: "",
      bubbleUntil: 0,
      lines: [
        "The Legion hall has rules. None are good, but several are laminated.",
        "Those mints are for parrots, uncles, and anyone who says 'just one more story.'",
        "If Rob calls this logistics, I am calling bingo a paramilitary operation.",
      ],
    },
  ];

  const discoveries = [
    {
      id: "ditchCooler",
      kind: "cooler",
      x: -135,
      y: -310,
      label: "Ditch Cooler",
      seen: false,
      color: "#4b8ea8",
      accent: "#f0f5d8",
      text: "Rob opens the ditch cooler. It contains one warm ginger ale and a note that says 'not evidence.'",
      repeatText: "The ditch cooler remains legally ambiguous and thermally disappointing.",
    },
    {
      id: "mailboxManifesto",
      kind: "sign",
      x: -224,
      y: 638,
      label: "Mailbox Manifesto",
      seen: false,
      color: "#fff3b5",
      accent: "#623723",
      text: "A mailbox note reads: 'Stop revving at 7 AM unless you are delivering coffee or shame.'",
      repeatText: "The mailbox has nothing new to say, which makes it the most mature person on the road.",
    },
    {
      id: "bugSmear",
      kind: "bucket",
      x: -118,
      y: 170,
      label: "Bug Smear Bucket",
      seen: false,
      color: "#91b85e",
      accent: "#432d24",
      text: "Rob finds a bucket labelled 'premium bug slurry.' He decides this is either wax or a hate crime against windshields.",
      repeatText: "The bug slurry still smells like a picnic lost a knife fight.",
    },
    {
      id: "potatoWarning",
      kind: "sign",
      x: 138,
      y: -1080,
      label: "Potato Warning",
      seen: false,
      color: "#f8dda2",
      accent: "#5a4326",
      text: "A hand-painted sign reads: 'NO TRESPASSING. POTATOES ARE LISTENING.' Rob nods like this explains taxes.",
      repeatText: "The potatoes continue listening. Rob lowers his voice around root vegetables.",
    },
    {
      id: "bridgeTollJar",
      kind: "cooler",
      x: -138,
      y: 1628,
      label: "Bridge Toll Jar",
      seen: false,
      color: "#b8dce2",
      accent: "#f7e2a5",
      text: "A mayo jar says 'Confederation Bridge toll, cash only.' It contains six buttons, a tooth, and aggressive optimism.",
      repeatText: "The fake toll jar remains open for business and closed to shame.",
    },
    {
      id: "emergencyPotatoPhone",
      kind: "sign",
      x: 134,
      y: 1884,
      label: "Emergency Potato Phone",
      seen: false,
      color: "#f1d289",
      accent: "#5a452e",
      text: "A sign points to a potato wired to a handset: 'FOR CROP EMERGENCIES ONLY.' Rob wonders if it takes collect calls.",
      repeatText: "The potato phone has no dial tone, but it has excellent starch coverage.",
    },
    {
      id: "blueBarrel",
      kind: "bucket",
      x: 402,
      y: 2096,
      label: "Suspicious Blue Barrel",
      seen: false,
      color: "#3a77a6",
      accent: "#bbd7e7",
      text: "The barrel is labelled 'NOT FERRY SAUCE.' Rob chooses not to learn what that means, which is personal growth.",
      repeatText: "The barrel still denies being ferry sauce with suspicious confidence.",
    },
    {
      id: "deadFerrySchedule",
      kind: "sign",
      x: 382,
      y: 2766,
      label: "Dead Ferry Schedule",
      seen: false,
      color: "#fff0bd",
      accent: "#69402f",
      text: "A ferry schedule from 1989 promises departure 'when someone important finishes a sandwich.'",
      repeatText: "The old ferry schedule remains more reliable than Rob's business model.",
    },
  ];

  const roadVehicles = [
    {
      kind: "pickup",
      x: -32,
      laneX: -32,
      y: -1980,
      baseSpeed: 108,
      speed: 108,
      color: "#a94d3c",
      accent: "#f0d287",
      length: 58,
      alertUntil: 0,
      lastQuipAt: 0,
      quip: "A pickup rattles past with one heroic bungee cord doing the work of a whole engineering degree.",
    },
    {
      kind: "tractor",
      x: 34,
      laneX: 34,
      y: 1160,
      baseSpeed: -46,
      speed: -46,
      color: "#6f943d",
      accent: "#e5c95a",
      length: 66,
      alertUntil: 0,
      lastQuipAt: 0,
      quip: "A tractor crawls by at the official PEI speed of 'eventually.'",
    },
    {
      kind: "van",
      x: -28,
      laneX: -28,
      y: 420,
      baseSpeed: 78,
      speed: 78,
      color: "#d7d9cf",
      accent: "#3d728d",
      length: 62,
      alertUntil: 0,
      lastQuipAt: 0,
      quip: "A dented delivery van goes past smelling faintly of bait, coffee, and consequences.",
    },
    {
      kind: "tourist",
      x: 34,
      laneX: 34,
      y: 2610,
      baseSpeed: -64,
      speed: -64,
      color: "#efcf78",
      accent: "#5d8aae",
      length: 66,
      alertUntil: 0,
      lastQuipAt: 0,
      quip: "A tourist car drifts by at map-reading speed, signalling a turn it made emotionally three minutes ago.",
    },
  ];

  const combines = [
    { x: 230, y: -1610, minX: 205, maxX: 555, baseSpeed: 34, speed: 34, dir: 1, alertUntil: 0, color: "#d5a43c", accent: "#6b4427" },
    { x: 245, y: 920, minX: 215, maxX: 565, baseSpeed: 27, speed: 27, dir: -1, alertUntil: 0, color: "#b7bd46", accent: "#4c5d2f" },
    { x: 250, y: 2840, minX: 220, maxX: 575, baseSpeed: 31, speed: 31, dir: 1, alertUntil: 0, color: "#c99b36", accent: "#5c3f28" },
  ];

  const roadHazards = [
    { x: -42, y: 1668, r: 18, label: "budget pothole" },
    { x: 38, y: 2078, r: 20, label: "frost heave" },
    { x: -30, y: 2548, r: 17, label: "culvert burp" },
    { x: 42, y: 2920, r: 22, label: "heritage crater" },
  ];

  const trees = makeTrees();
  const laneMarks = makeLaneMarks();
  let gameStarted = false;
  let introReady = false;
  let introSkipClicks = 0;
  let introLastSkipClickAt = 0;
  let introCheatBuffer = "";
  let introLastCheatAt = 0;
  let introUnlockTimer = 0;
  let introSkipResetTimer = 0;
  let lastTime = performance.now();
  let toastUntil = 0;
  let lastSouthGateScoldAt = 0;
  let endgameReady = false;
  let dayEnded = false;
  let duskStartedAt = 0;

  const audio = {
    context: null,
    disabled: false,
    master: null,
    ambienceGain: null,
    engineGain: null,
    engineOsc: null,
    enginePulse: null,
    nextChirpAt: 0,
  };

  function resize() {
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function normalizeKey(event) {
    if (event.code === "ArrowUp" || event.code === "KeyW") return "up";
    if (event.code === "ArrowDown" || event.code === "KeyS") return "down";
    if (event.code === "ArrowLeft" || event.code === "KeyA") return "left";
    if (event.code === "ArrowRight" || event.code === "KeyD") return "right";
    if (event.code === "ShiftLeft" || event.code === "ShiftRight") return "run";
    if (event.code === "KeyE" || event.code === "Space" || event.code === "Enter") return "action";
    if (event.code === "KeyR") return "drop";
    if (event.code === "KeyF") return "use";
    if (event.code === "KeyM") return "mission";
    if (event.code === "Escape") return "escape";
    if (event.code === "Digit1") return "slot0";
    if (event.code === "Digit2") return "slot1";
    if (event.code === "Digit3") return "slot2";
    return "";
  }

  window.addEventListener("resize", resize);
  window.addEventListener("keydown", (event) => {
    if (!gameStarted && tryHandleIntroCheat(event)) return;

    const key = normalizeKey(event);
    if (!key) return;
    event.preventDefault();
    if (!gameStarted) {
      if (key === "action") {
        if (introReady) startGame();
        else handleIntroImpatience();
      }
      return;
    }
    if (!endingOverlay.hidden) {
      if (key === "action" || key === "escape") closeEndingOverlay();
      return;
    }
    if (key === "mission") {
      toggleMissionBrowser();
      return;
    }
    if (!missionOverlay.hidden) {
      if (key === "escape") closeMissionBrowser();
      return;
    }
    if (key === "action") {
      if (!event.repeat) input.actionQueued = true;
      return;
    }
    if (key === "drop") {
      if (!event.repeat) input.dropQueued = true;
      return;
    }
    if (key === "use") {
      if (!event.repeat) input.useQueued = true;
      return;
    }
    if (key === "escape") {
      closeMissionBrowser();
      return;
    }
    if (key.startsWith("slot")) {
      if (!event.repeat) input.selectedQueued = Number(key.slice(4));
      return;
    }
    input[key] = true;
  });

  window.addEventListener("keyup", (event) => {
    const key = normalizeKey(event);
    if (!key || key === "action" || key === "drop" || key === "use" || key === "mission" || key === "escape" || key.startsWith("slot")) return;
    event.preventDefault();
    if (!gameStarted) return;
    input[key] = false;
  });

  introStart.addEventListener("click", handleIntroStartClick);
  introScroll.addEventListener("animationend", unlockIntro, { once: true });
  missionButton.addEventListener("click", openMissionBrowser);
  missionClose.addEventListener("click", closeMissionBrowser);
  endingClose.addEventListener("click", closeEndingOverlay);

  resize();
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    introUnlockTimer = window.setTimeout(unlockIntro, 900);
  } else {
    introUnlockTimer = window.setTimeout(unlockIntro, 24500);
  }
  requestAnimationFrame(loop);

  function loop(now) {
    const dt = Math.min(0.033, (now - lastTime) / 1000);
    lastTime = now;
    update(dt, now);
    draw(now);
    drawEndingScene(now);
    requestAnimationFrame(loop);
  }

  function tryHandleIntroCheat(event) {
    const letter = event.key && event.key.length === 1 ? event.key.toUpperCase() : "";
    if (!letter) return false;

    const cheat = "END";
    const now = performance.now();
    if (now - introLastCheatAt > 1800) introCheatBuffer = "";

    introLastCheatAt = now;
    introCheatBuffer = `${introCheatBuffer}${letter}`.slice(-cheat.length);

    if (introCheatBuffer.endsWith(cheat)) {
      event.preventDefault();
      introCheatBuffer = "";
      triggerEndingCheat();
      return true;
    }

    const pendingCheat = cheat.startsWith(introCheatBuffer) || letter === cheat[0];
    if (pendingCheat) event.preventDefault();
    return pendingCheat;
  }

  function triggerEndingCheat() {
    window.clearTimeout(introUnlockTimer);
    window.clearTimeout(introSkipResetTimer);
    initAudio();
    gameStarted = true;
    introReady = true;
    introOverlay.hidden = true;
    closeMissionBrowser();
    clearMovementInput();
    inventory.slots = [];
    inventory.selected = 0;

    for (const [missionId, state] of Object.entries(missionStates)) {
      const def = missionDefs[missionId];
      state.unlocked = true;
      state.complete = true;
      state.state = "complete";
      if (state.legIndex !== undefined) state.legIndex = missionLegCount(def) - 1;
    }

    for (const item of worldItems) {
      item.carried = false;
      item.delivered = true;
    }

    activeMissionId = "septicDiplomacy";
    endgameReady = true;
    dayEnded = true;
    duskStartedAt = performance.now() - 12000;
    rob.mode = "home";
    rob.x = homeDoor.x;
    rob.y = homeDoor.y;
    bike.x = -64;
    bike.y = drivewayY;
    bike.heading = -Math.PI / 2;
    bike.speed = 0;
    bike.fallen = false;
    camera.x = -170;
    camera.y = 40;

    renderMissionBrowser();
    playMissionCompleteSound();
    showEndingOverlay();
    say("END accepted: Rob bypasses commerce and reports directly to the couch-based monster movie incident.", 4.8);
  }

  function handleIntroStartClick() {
    if (introReady) {
      startGame();
      return;
    }

    handleIntroImpatience();
  }

  function handleIntroImpatience() {
    const now = performance.now();
    introSkipClicks = now - introLastSkipClickAt < 1250 ? introSkipClicks + 1 : 1;
    introLastSkipClickAt = now;
    window.clearTimeout(introSkipResetTimer);
    introSkipResetTimer = window.setTimeout(() => {
      introSkipClicks = 0;
    }, 1350);

    jiggleIntroButton();
    speedUpIntroScroll(introSkipClicks);

    if (introSkipClicks >= 3) {
      introScroll.classList.add("is-skipped");
      introStart.textContent = "Fine. Start Rob's Day.";
      say("Fine. Rob skims the paperwork like a man signing a waiver beside a running motorcycle.", 3);
      unlockIntro({ skipped: true });
      return;
    }

    introStart.textContent = introSkipClicks === 1
      ? "Reading Inspector Says No"
      : "Click Faster, Coward";
    say(
      introSkipClicks === 1
        ? "The intro clears its throat and pretends this is legally binding."
        : "The text speeds up. The lawyers are sweating.",
      2.2,
    );
  }

  function jiggleIntroButton() {
    introStart.classList.remove("is-irritated");
    void introStart.offsetWidth;
    introStart.classList.add("is-irritated");
  }

  function speedUpIntroScroll(clicks) {
    const animations = introScroll.getAnimations ? introScroll.getAnimations() : [];
    const animation = animations[0];
    if (animation && animation.playbackRate !== undefined) {
      animation.updatePlaybackRate(Math.min(4, 1 + clicks * 0.85));
    }
  }

  function unlockIntro(options = {}) {
    if (introReady) return;
    window.clearTimeout(introUnlockTimer);
    window.clearTimeout(introSkipResetTimer);
    introReady = true;
    introStart.classList.remove("is-reading", "is-irritated");
    introStart.textContent = options.skipped ? "Start Rob's Day, You Menace" : "Start Rob's Day";
    introStart.focus();
  }

  function startGame() {
    if (!introReady || gameStarted) return;
    initAudio();
    gameStarted = true;
    introOverlay.hidden = true;
    renderMissionBrowser();
    playTone({ frequency: 330, duration: 0.18, type: "triangle", gain: 0.08 });
    say("Mission: fetch acrylic dome polish before the parrots start naming individual bug splats.", 4.2);
  }

  function toggleMissionBrowser() {
    if (missionOverlay.hidden) openMissionBrowser();
    else closeMissionBrowser();
  }

  function openMissionBrowser() {
    if (!gameStarted) return;
    clearMovementInput();
    renderMissionBrowser();
    missionOverlay.hidden = false;
    missionButton.textContent = "Close";
  }

  function closeMissionBrowser() {
    missionOverlay.hidden = true;
    missionButton.textContent = "Missions";
  }

  function renderMissionBrowser() {
    missionList.replaceChildren();
    for (const missionId of Object.keys(missionDefs)) {
      const def = missionDefs[missionId];
      const state = missionStates[missionId];
      const card = document.createElement("button");
      card.type = "button";
      card.className = "mission-card";
      if (missionId === activeMissionId) card.classList.add("is-active");
      if (state.complete) card.classList.add("is-complete");
      card.disabled = !state.unlocked || state.complete;

      const title = document.createElement("h3");
      title.textContent = def.title;
      const summary = document.createElement("p");
      summary.textContent = def.summary;
      const status = document.createElement("span");
      status.className = "mission-card-status";
      status.textContent = missionCardStatus(missionId);

      card.append(title, summary, status);
      card.addEventListener("click", () => {
        if (!state.unlocked || state.complete) return;
        activeMissionId = missionId;
        closeMissionBrowser();
        playUseSound();
        say(`Active mission: ${def.title}. ${missionGuideText()}`, 4);
      });
      missionList.append(card);
    }
  }

  function clearMovementInput() {
    input.up = false;
    input.down = false;
    input.left = false;
    input.right = false;
    input.run = false;
  }

  function update(dt, now) {
    if (!gameStarted) {
      input.actionQueued = false;
      input.dropQueued = false;
      input.useQueued = false;
      input.selectedQueued = null;
      updateHud(now);
      return;
    }

    handleInventoryShortcuts();
    updateWorldLife(dt, now);

    if (rob.mode === "home") {
      bike.speed *= 0.9;
      if (input.actionQueued) {
        rob.mode = "foot";
        rob.x = homeDoor.x;
        rob.y = homeDoor.y + 28;
        say("Rob steps out. The parrots are already judging the dome polish.", 3.5);
      }
    } else if (rob.mode === "foot") {
      updateOnFoot(dt, now);
      if (input.actionQueued) {
        const interacted = handleInteractionAction();
        if (!interacted && !bike.fallen && distance(rob, bike) < 56) {
          rob.mode = "bike";
          bike.speed = 0;
          bike.heading = -Math.PI / 2;
          playBikeStartSound();
          say("Rob climbs onto the Suzuki. Acrylic dome status: deeply unnecessary.", 3.5);
        } else if (!interacted && distance(rob, homeDoor) < 52) {
          enterHome();
        }
      }
    } else {
      updateBike(dt, now);
      if (rob.mode === "bike" && input.actionQueued) {
        if (Math.abs(bike.speed) < 34 && handleInteractionAction()) {
          bike.speed = 0;
        } else if (Math.abs(bike.speed) < 24) {
          rob.mode = "foot";
          rob.x = bike.x - Math.cos(bike.heading + Math.PI / 2) * 30;
          rob.y = bike.y - Math.sin(bike.heading + Math.PI / 2) * 30;
          rob.heading = bike.heading;
          bike.speed = 0;
          playDismountSound();
          say("Rob dismounts with post-paycheque confidence.", 2.8);
        } else {
          playHornSound();
          say("HONK. The parrots file a formal complaint.", 1.5);
        }
      }
    }

    input.actionQueued = false;
    input.dropQueued = false;
    input.useQueued = false;
    input.selectedQueued = null;
    updateCamera(dt);
    updateHud(now);
    updateAudio(now);
  }

  function handleInventoryShortcuts() {
    if (input.selectedQueued !== null) {
      selectInventorySlot(input.selectedQueued);
    }

    if (input.dropQueued) {
      dropSelectedItem();
    }

    if (input.useQueued) {
      useSelectedItem();
    }
  }

  function handleInteractionAction() {
    const actor = actorPoint();
    if (rob.mode === "foot" && tryUprightBike(actor)) return true;
    if (tryDeliverActiveMission(actor)) return true;
    if (tryPickupNearbyItem(actor)) return true;
    if (rob.mode === "foot" && tryTalkToNearbyNpc(actor)) return true;
    if (rob.mode === "foot" && tryInspectNearbyDiscovery(actor)) return true;
    return false;
  }

  function enterHome() {
    rob.mode = "home";
    rob.x = homeDoor.x;
    rob.y = homeDoor.y;

    if (endgameReady && !dayEnded) {
      finishRobDay();
      return;
    }

    say(dayEnded ? "Rob remains indoors. The monster movies have subtitles and the snacks have opinions." : "Rob goes back inside. Probably forgot something suspiciously specific.", 3);
  }

  function finishRobDay() {
    dayEnded = true;
    closeMissionBrowser();
    clearMovementInput();
    bike.speed = 0;
    playMissionCompleteSound();
    showEndingOverlay();
    say("Day complete: Rob returns home to old Japanese monster movies and edible entertainment with questionable steering advice.", 5.2);
  }

  function showEndingOverlay() {
    endingOverlay.hidden = false;
    endingClose.focus();
  }

  function closeEndingOverlay() {
    endingOverlay.hidden = true;
    say("Rob keeps loitering in the afterglow. Somewhere on the TV, a rubber-suit monster sues a lighthouse.", 3.8);
  }

  function tryUprightBike(actor) {
    if (!bike.fallen || distance(actor, bike) > 78) return false;
    bike.fallen = false;
    bike.speed = 0;
    playBikeLiftSound();
    say("Rob heaves the Suzuki upright with the dignity of a man wrestling a vending machine.", 3.6);
    return true;
  }

  function tryPickupNearbyItem(actor) {
    const item = nearestWorldItem(actor, 74);
    if (!item) return false;
    if (inventory.slots.length >= inventory.capacity) {
      say("Rob pats every pocket and finds only receipts, lint, and poor planning.", 2.8);
      return true;
    }

    item.carried = true;
    inventory.slots.push(item.type);
    inventory.selected = inventory.slots.length - 1;
    playPickupSound();
    const relatedMission = missionForItem(item.type);
    const relatedState = relatedMission ? missionStates[relatedMission.id] : null;
    const relatedLeg = relatedMission ? currentMissionLeg(relatedMission, relatedState) : null;
    if (relatedMission) {
      if (relatedState.unlocked && !relatedState.complete && relatedState.state === "pickup" && relatedLeg && relatedLeg.item === item.type) {
        relatedState.state = "return";
      }
    }

    say(relatedMission && relatedLeg ? relatedLeg.pickupText : `Picked up ${itemTypes[item.type].name}.`, 3.5);

    return true;
  }

  function tryTalkToNearbyNpc(actor) {
    const npc = nearestNpc(actor, 70);
    if (!npc) return false;

    const line = npc.lines[npc.talkIndex % npc.lines.length];
    npc.talkIndex += 1;
    npc.bubbleText = line;
    npc.bubbleUntil = performance.now() + 3600;
    playUseSound();
    say(`${npc.name}: "${line}"`, 4.2);
    return true;
  }

  function tryInspectNearbyDiscovery(actor) {
    const discovery = nearestDiscovery(actor, 66);
    if (!discovery) return false;

    const firstLook = !discovery.seen;
    discovery.seen = true;
    playUseSound();
    say(firstLook ? `Discovered ${discovery.label}: ${discovery.text}` : discovery.repeatText, firstLook ? 4.8 : 3.3);
    return true;
  }

  function tryDeliverActiveMission(actor) {
    const def = activeMissionDef();
    const state = activeMissionState();
    const leg = currentMissionLeg(def, state);
    if (!def || !state || !leg || state.complete || state.state !== "return") return false;
    if (distance(actor, leg.drop) > leg.drop.r || !hasItem(leg.item)) return false;

    removeItemFromInventory(leg.item);

    if (state.legIndex !== undefined && state.legIndex < missionLegCount(def) - 1) {
      state.legIndex += 1;
      state.state = "pickup";
      ensureMissionItem(def.id);
      renderMissionBrowser();
      playUseSound();
      say(`${leg.dropText} ${missionGuideText()}`, 5.2);
      return true;
    }

    state.state = "complete";
    state.complete = true;
    playMissionCompleteSound();
    const unlocked = unlockMissions(def.unlocks);
    const openedSouth = maybeUnlockSouthRoad();
    const startedEvening = maybeBeginEndgame();
    renderMissionBrowser();
    if (startedEvening) {
      closeMissionBrowser();
    } else if (unlocked.length || openedSouth) {
      window.setTimeout(openMissionBrowser, 900);
    }
    say(`${def.completeText}${openedSouth ? " The road crew grudgingly opens the south road, unlocking two lower-road errands with worse smells and better paperwork." : ""}${startedEvening ? " The day starts sagging into evening. Head home for monster movies and snacks that make the couch feel advisory." : ""}`, openedSouth || startedEvening ? 6.5 : 5);
    return true;
  }

  function selectInventorySlot(index) {
    if (index >= inventory.capacity) return;
    inventory.selected = index;
    if (inventory.slots[index]) {
      say(`Selected ${itemTypes[inventory.slots[index]].name}.`, 1.4);
    }
  }

  function dropSelectedItem() {
    if (!inventory.slots.length) {
      say("Inventory empty. Rob is traveling light, spiritually and financially.", 2.4);
      return;
    }

    const actor = actorPoint();
    if (rob.mode === "bike" && Math.abs(bike.speed) > 22) {
      say("Rob refuses to throw cargo off a moving cruiser. This is what he calls maturity.", 2.6);
      return;
    }

    const selected = clamp(inventory.selected, 0, inventory.slots.length - 1);
    const type = inventory.slots.splice(selected, 1)[0];
    inventory.selected = clamp(selected, 0, Math.max(0, inventory.slots.length - 1));
    const dropped = createWorldItem(type, actor.x + 26, actor.y + 18, "dropped");
    worldItems.push(dropped);
    playDropSound();
    say(itemTypes[type].dropText, 2.8);
  }

  function useSelectedItem() {
    if (!inventory.slots.length) {
      say("Rob has nothing to use except confidence, and that is already equipped.", 2.4);
      return;
    }

    if (rob.mode === "bike" && Math.abs(bike.speed) > 10) {
      say("Using supplies while riding is how you become a story told at the hardware store.", 2.6);
      return;
    }

    const type = inventory.slots[clamp(inventory.selected, 0, inventory.slots.length - 1)];
    const actor = actorPoint();
    const active = activeMissionDef();
    const activeLeg = currentMissionLeg(active, activeMissionState());
    if (activeLeg && type === activeLeg.item && distance(actor, activeLeg.drop) <= activeLeg.drop.r) {
      tryDeliverActiveMission(actor);
      return;
    }

    playUseSound();
    say(itemTypes[type].useText, 3.4);
  }

  function actorPoint() {
    if (rob.mode === "bike") return bike;
    if (rob.mode === "home") return homeDoor;
    return rob;
  }

  function nearestWorldItem(actor, radius) {
    let nearest = null;
    let nearestDistance = radius;
    for (const item of worldItems) {
      if (item.carried || item.delivered) continue;
      const itemDistance = distance(actor, item);
      if (itemDistance < nearestDistance) {
        nearest = item;
        nearestDistance = itemDistance;
      }
    }
    return nearest;
  }

  function nearestNpc(actor, radius) {
    let nearest = null;
    let nearestDistance = radius;
    for (const npc of npcs) {
      const npcDistance = distance(actor, npc);
      if (npcDistance < nearestDistance) {
        nearest = npc;
        nearestDistance = npcDistance;
      }
    }
    return nearest;
  }

  function nearestDiscovery(actor, radius) {
    let nearest = null;
    let nearestDistance = radius;
    for (const discovery of discoveries) {
      const discoveryDistance = distance(actor, discovery);
      if (discoveryDistance < nearestDistance) {
        nearest = discovery;
        nearestDistance = discoveryDistance;
      }
    }
    return nearest;
  }

  function hasItem(type) {
    return inventory.slots.includes(type);
  }

  function removeItemFromInventory(type) {
    const index = inventory.slots.indexOf(type);
    if (index === -1) return false;
    inventory.slots.splice(index, 1);
    inventory.selected = clamp(inventory.selected, 0, Math.max(0, inventory.slots.length - 1));
    return true;
  }

  function activeMissionDef() {
    return missionDefs[activeMissionId];
  }

  function activeMissionState() {
    return missionStates[activeMissionId];
  }

  function missionLegCount(def) {
    return def && def.legs ? def.legs.length : 1;
  }

  function missionLegs(def) {
    if (!def) return [];
    return def.legs || [def];
  }

  function currentMissionLeg(def, state) {
    if (!def) return null;
    if (!def.legs) return def;
    const index = clamp(state && state.legIndex !== undefined ? state.legIndex : 0, 0, def.legs.length - 1);
    return def.legs[index];
  }

  function missionForItem(type) {
    for (const [missionId, def] of Object.entries(missionDefs)) {
      const state = missionStates[missionId];
      const leg = currentMissionLeg(def, state);
      if (state && state.unlocked && !state.complete && leg && leg.item === type) return def;
    }

    return Object.values(missionDefs).find((def) => missionLegs(def).some((leg) => leg.item === type)) || null;
  }

  function activeMissionTarget() {
    if (endgameReady && !dayEnded) {
      return { x: homeDoor.x, y: homeDoor.y, r: 64, label: "Go home", place: "Rob's house" };
    }

    const def = activeMissionDef();
    const state = activeMissionState();
    const leg = currentMissionLeg(def, state);
    if (!def || !state || !state.unlocked || state.complete) return null;
    if (!leg) return null;
    if (state.state === "return" && !hasItem(leg.item)) {
      const looseItem = worldItems.find((item) => item.type === leg.item && !item.carried && !item.delivered);
      if (looseItem) return { x: looseItem.x, y: looseItem.y, r: 74, label: itemTypes[leg.item].shortName, place: "Wherever Rob left it" };
    }
    if (state.state === "return") return leg.drop;
    return leg.pickup;
  }

  function canDeliverActiveMission(actor) {
    const def = activeMissionDef();
    const state = activeMissionState();
    const leg = currentMissionLeg(def, state);
    return Boolean(def && state && leg && state.state === "return" && hasItem(leg.item) && distance(actor, leg.drop) <= leg.drop.r);
  }

  function unlockMissions(ids) {
    const unlocked = [];
    for (const id of ids) {
      const state = missionStates[id];
      const def = missionDefs[id];
      if (!state || !def || state.unlocked) continue;
      state.unlocked = true;
      state.state = "pickup";
      if (state.legIndex !== undefined) state.legIndex = 0;
      ensureMissionItem(id);
      unlocked.push(id);
    }
    return unlocked;
  }

  function completedStarterMissionCount() {
    return starterMissionIds.filter((id) => missionStates[id] && missionStates[id].complete).length;
  }

  function isSouthRoadUnlocked() {
    return completedStarterMissionCount() >= 2;
  }

  function maybeUnlockSouthRoad() {
    if (!isSouthRoadUnlocked()) return false;
    return unlockMissions(southMissionIds).length > 0;
  }

  function allMissionsComplete() {
    return allMissionIds.every((id) => missionStates[id] && missionStates[id].complete);
  }

  function maybeBeginEndgame() {
    if (endgameReady || !allMissionsComplete()) return false;
    endgameReady = true;
    duskStartedAt = performance.now();
    return true;
  }

  function ensureMissionItem(missionId) {
    const def = missionDefs[missionId];
    const state = missionStates[missionId];
    if (!def || !state) return;
    const leg = currentMissionLeg(def, state);
    if (!leg || state.state !== "pickup") return;
    const alreadyInWorld = worldItems.some((item) => item.type === leg.item && !item.delivered);
    if (alreadyInWorld || hasItem(leg.item) || state.complete) return;
    worldItems.push(createWorldItem(leg.item, leg.pickup.x, leg.pickup.y, "mission", missionId));
  }

  function missionStatusText() {
    if (dayEnded) return "Evening achieved";
    if (endgameReady) return "Head home";

    const def = activeMissionDef();
    const state = activeMissionState();
    if (!def || !state) return "No mission";
    if (state.complete) return `${def.title}: done`;
    if (missionLegCount(def) > 1) return `${def.title} ${((state.legIndex || 0) + 1)}/${missionLegCount(def)}`;
    return def.title;
  }

  function missionGuideText() {
    if (dayEnded) return "Rob is home with old monster movies, edible entertainment, and no remaining respect for daylight.";
    if (endgameReady) return "All five errands are done. Head back to Rob's house and press E at the front door to surrender to the evening.";

    const def = activeMissionDef();
    const state = activeMissionState();
    const leg = currentMissionLeg(def, state);
    if (!def || !state || !state.unlocked) return "Press M to pick an available errand.";
    if (state.complete) return def.completeGuide;
    if (!leg) return "Rob has found a mission without instructions, which is technically still a business plan.";
    if (state.state === "return" && !hasItem(leg.item)) return `Pick ${itemTypes[leg.item].shortName} back up. Rob cannot deliver a memory.`;
    if (state.state === "return") return leg.returnGuide;
    return leg.pickupGuide;
  }

  function currentGuideText() {
    if (!gameStarted) return "Read the intro";
    const context = nearbyInteractionGuide();
    return context ? `${context} ${missionGuideText()}` : missionGuideText();
  }

  function nearbyInteractionGuide() {
    const actor = actorPoint();
    if (rob.mode === "foot") {
      if (rob.panicUntil > performance.now()) return "Rob is moving himself out of traffic before his obituary becomes a roadside anecdote.";
      if (isInRiver(rob)) return "Rob is swimming. Aim for the red bank unless he wants his boots classified as soup.";
      if (!isSouthRoadUnlocked() && Math.abs(rob.y - southGate.y) < 140) return `South road blocked: finish ${2 - completedStarterMissionCount()} more starter errand${2 - completedStarterMissionCount() === 1 ? "" : "s"} to open it.`;
      if (endgameReady && !dayEnded && distance(rob, homeDoor) < 76) return "Home is right here. Press E to retire from commerce and enter the monster-movie snack dimension.";
      if (canDeliverActiveMission(actor)) return "Drop-off is right here.";

      const item = nearestWorldItem(actor, 74);
      if (item) return `Pickup nearby: ${itemTypes[item.type].name}.`;

      const npc = nearestNpc(actor, 70);
      if (npc) return `Nearby: talk to ${npc.name}; they look under-caffeinated and over-informed.`;

      const discovery = nearestDiscovery(actor, 66);
      if (discovery) return discovery.seen ? `Nearby: re-inspect ${discovery.label}.` : `Nearby: inspect ${discovery.label}.`;

      if (bike.fallen && distance(rob, bike) < 92) return "The Suzuki is lying down like a tired vending machine. Press E to stand it back up.";
      if (distance(rob, bike) < 72) return "The cruiser is within climbing distance.";
      if (endgameReady && !dayEnded) return "All errands are done. The couch is summoning Rob with supernatural upholstery.";
      if (distance(rob, homeDoor) < 64) return "The front door is close if Rob needs to retreat from consequences.";
    }

    if (rob.mode === "bike" && Math.abs(bike.speed) < 34) {
      if (!isSouthRoadUnlocked() && Math.abs(bike.y - southGate.y) < 150) return `South road blocked: finish ${2 - completedStarterMissionCount()} more starter errand${2 - completedStarterMissionCount() === 1 ? "" : "s"} to open it.`;
      if (endgameReady && !dayEnded && distance(bike, homeDoor) < 92) return "Home is close. Park the cruiser, dismount, and go receive couch-based cinema therapy.";
      if (canDeliverActiveMission(actor)) return "The drop-off is close enough for Rob to make it official.";
      const item = nearestWorldItem(actor, 74);
      if (item) return `Cargo is close: ${itemTypes[item.type].name}.`;
    }

    return "";
  }

  function missionCardStatus(missionId) {
    const state = missionStates[missionId];
    const def = missionDefs[missionId];
    if (!state.unlocked) return def.lockedText || "Locked until Rob proves he can finish one stupid thing";
    if (state.complete) return "Complete";
    if (missionId === activeMissionId) return "Active";
    if (missionLegCount(def) > 1) return `Available - ${missionLegCount(def)} stage nonsense`;
    return "Available";
  }

  function inventoryText() {
    if (!inventory.slots.length) return "Empty";
    return inventory.slots
      .map((type, index) => `${index === inventory.selected ? ">" : ""}${itemTypes[type].shortName}`)
      .join(" / ");
  }

  function formatSpeed(speed) {
    return `${Math.round(Math.abs(speed) * speedometerScale)} km/h`;
  }

  function initAudio() {
    if (audio.disabled) return;

    try {
      if (!audio.context) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) {
          audio.disabled = true;
          return;
        }

        const context = new AudioContextClass();
        const master = context.createGain();
        master.gain.value = 0.26;
        master.connect(context.destination);

        const ambienceGain = context.createGain();
        ambienceGain.gain.value = 0.13;
        ambienceGain.connect(master);

        const windFilter = context.createBiquadFilter();
        windFilter.type = "lowpass";
        windFilter.frequency.value = 520;

        const windSource = context.createBufferSource();
        windSource.buffer = createNoiseBuffer(context, 2);
        windSource.loop = true;
        windSource.connect(windFilter);
        windFilter.connect(ambienceGain);
        windSource.start();

        const engineGain = context.createGain();
        engineGain.gain.value = 0;
        engineGain.connect(master);

        const engineFilter = context.createBiquadFilter();
        engineFilter.type = "lowpass";
        engineFilter.frequency.value = 210;
        engineFilter.Q.value = 1.4;
        engineFilter.connect(engineGain);

        const engineOsc = context.createOscillator();
        engineOsc.type = "sawtooth";
        engineOsc.frequency.value = 44;
        engineOsc.connect(engineFilter);
        engineOsc.start();

        const enginePulse = context.createOscillator();
        enginePulse.type = "square";
        enginePulse.frequency.value = 24;
        enginePulse.connect(engineFilter);
        enginePulse.start();

        audio.context = context;
        audio.master = master;
        audio.ambienceGain = ambienceGain;
        audio.engineGain = engineGain;
        audio.engineOsc = engineOsc;
        audio.enginePulse = enginePulse;
        audio.nextChirpAt = performance.now() + 1800;
      }

      if (audio.context.state === "suspended") {
        audio.context.resume().catch(() => {
          audio.disabled = true;
        });
      }
    } catch {
      audio.disabled = true;
    }
  }

  function createNoiseBuffer(context, seconds) {
    const length = Math.floor(context.sampleRate * seconds);
    const buffer = context.createBuffer(1, length, context.sampleRate);
    const data = buffer.getChannelData(0);
    let drift = 0;
    for (let i = 0; i < length; i += 1) {
      drift = drift * 0.96 + (Math.random() * 2 - 1) * 0.04;
      data[i] = drift;
    }
    return buffer;
  }

  function updateAudio(now) {
    if (!audio.context || audio.disabled) return;
    const context = audio.context;
    const speedRatio = clamp(Math.abs(bike.speed) / 315, 0, 1);
    const mounted = rob.mode === "bike";
    const targetGain = mounted ? 0.025 + speedRatio * 0.09 : 0;
    const baseFrequency = mounted ? 42 + speedRatio * 95 : 36;

    audio.engineGain.gain.setTargetAtTime(targetGain, context.currentTime, 0.08);
    audio.engineOsc.frequency.setTargetAtTime(baseFrequency, context.currentTime, 0.06);
    audio.enginePulse.frequency.setTargetAtTime(baseFrequency * 0.48, context.currentTime, 0.08);
    audio.ambienceGain.gain.setTargetAtTime(0.11 + speedRatio * 0.05, context.currentTime, 0.18);

    if (now > audio.nextChirpAt) {
      playChirpSound();
      audio.nextChirpAt = now + 3200 + Math.random() * 5200;
    }
  }

  function playTone({ frequency, duration, type = "sine", gain = 0.05, slideTo = null }) {
    if (!audio.context || audio.disabled) return;

    const context = audio.context;
    const oscillator = context.createOscillator();
    const toneGain = context.createGain();
    const now = context.currentTime;

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);
    if (slideTo !== null) {
      oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, slideTo), now + duration);
    }

    toneGain.gain.setValueAtTime(0.0001, now);
    toneGain.gain.exponentialRampToValueAtTime(gain, now + 0.015);
    toneGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    oscillator.connect(toneGain);
    toneGain.connect(audio.master);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.03);
  }

  function playHornSound() {
    playTone({ frequency: 220, slideTo: 205, duration: 0.34, type: "square", gain: 0.12 });
    window.setTimeout(() => playTone({ frequency: 294, slideTo: 278, duration: 0.26, type: "square", gain: 0.08 }), 55);
  }

  function playBikeStartSound() {
    playTone({ frequency: 62, slideTo: 118, duration: 0.42, type: "sawtooth", gain: 0.08 });
    window.setTimeout(() => playTone({ frequency: 96, slideTo: 72, duration: 0.2, type: "triangle", gain: 0.05 }), 220);
  }

  function playDismountSound() {
    playTone({ frequency: 92, slideTo: 44, duration: 0.22, type: "triangle", gain: 0.04 });
  }

  function playCrashSound() {
    playTone({ frequency: 92, slideTo: 44, duration: 0.28, type: "sawtooth", gain: 0.09 });
    window.setTimeout(() => playTone({ frequency: 168, slideTo: 74, duration: 0.18, type: "square", gain: 0.06 }), 90);
  }

  function playBikeLiftSound() {
    playTone({ frequency: 84, slideTo: 132, duration: 0.22, type: "triangle", gain: 0.055 });
    window.setTimeout(() => playTone({ frequency: 190, duration: 0.08, type: "sine", gain: 0.035 }), 180);
  }

  function playPickupSound() {
    playTone({ frequency: 520, slideTo: 760, duration: 0.14, type: "triangle", gain: 0.055 });
    window.setTimeout(() => playTone({ frequency: 880, duration: 0.08, type: "sine", gain: 0.04 }), 85);
  }

  function playDropSound() {
    playTone({ frequency: 190, slideTo: 110, duration: 0.16, type: "triangle", gain: 0.05 });
  }

  function playUseSound() {
    playTone({ frequency: 680, slideTo: 530, duration: 0.18, type: "sine", gain: 0.045 });
  }

  function playMissionCompleteSound() {
    playTone({ frequency: 392, duration: 0.12, type: "triangle", gain: 0.06 });
    window.setTimeout(() => playTone({ frequency: 523, duration: 0.12, type: "triangle", gain: 0.06 }), 120);
    window.setTimeout(() => playTone({ frequency: 784, duration: 0.22, type: "triangle", gain: 0.055 }), 250);
  }

  function playChirpSound() {
    const base = 980 + Math.random() * 440;
    playTone({ frequency: base, slideTo: base * 1.35, duration: 0.07, type: "sine", gain: 0.026 });
    window.setTimeout(() => playTone({ frequency: base * 0.8, slideTo: base * 1.1, duration: 0.06, type: "sine", gain: 0.02 }), 90);
  }

  function updateWorldLife(dt, now) {
    for (const npc of npcs) {
      updateNpc(npc, dt, now);
    }
    updateNpcBikeThreats(dt, now);

    for (const vehicle of roadVehicles) {
      updateRoadVehicle(vehicle, dt, now);

      if (rob.mode === "bike" && now > toastUntil && now - vehicle.lastQuipAt > 9000 && distance(bike, vehicle) < 94) {
        vehicle.lastQuipAt = now;
        say(vehicle.quip, 2.8);
      }
    }

    for (const combine of combines) {
      updateCombine(combine, dt, now);
    }
  }

  function updateNpc(npc, dt, now) {
    if (npc.panicUntil > now) {
      const speed = 238;
      npc.x += (npc.panicVectorX || 0) * speed * dt;
      npc.y += (npc.panicVectorY || 0) * speed * dt;
      constrainPoint(npc, 10);
      return;
    }

    const driftX = Math.sin(now / 1700 + npc.phase) * npc.radiusX;
    const driftY = Math.cos(now / 2100 + npc.phase * 1.7) * npc.radiusY;
    npc.x += (npc.baseX + driftX - npc.x) * Math.min(1, dt * 1.8);
    npc.y += (npc.baseY + driftY - npc.y) * Math.min(1, dt * 1.8);
  }

  function updateNpcBikeThreats(dt, now) {
    if (rob.mode !== "bike" || bike.fallen) return;

    const forwardX = Math.cos(bike.heading);
    const forwardY = Math.sin(bike.heading);
    const bikeSpeed = Math.abs(bike.speed);

    for (const npc of npcs) {
      const dx = npc.x - bike.x;
      const dy = npc.y - bike.y;
      const ahead = dx * forwardX + dy * forwardY;
      const lateral = Math.abs(dx * forwardY - dy * forwardX);
      const npcDistance = Math.hypot(dx, dy);
      const inPath = ahead > -20 && ahead < 190 && lateral < 66;
      const tooClose = npcDistance < 86;

      if ((bikeSpeed > 16 && inPath) || tooClose) {
        const urgency = clamp((190 - Math.max(0, ahead)) / 190, 0.2, 1);
        triggerNpcPanic(npc, urgency, now);
      }

      if (npcDistance < 38) {
        nudgeBikeAwayFromNpc(npc, dt, now);
      }
    }
  }

  function triggerNpcPanic(npc, urgency, now) {
    const awayX = npc.x - bike.x;
    const awayY = npc.y - bike.y;
    const fallbackX = Math.sin(bike.heading);
    const fallbackY = -Math.cos(bike.heading);
    const mag = Math.hypot(awayX, awayY);
    const runX = mag > 0.001 ? awayX / mag : fallbackX;
    const runY = mag > 0.001 ? awayY / mag : fallbackY;

    npc.panicVectorX = runX;
    npc.panicVectorY = runY;
    npc.panicUntil = Math.max(npc.panicUntil || 0, now + 1100 + urgency * 650);
    npc.bubbleText = npcPanicText(npc);
    npc.bubbleUntil = now + 1150;

    if (!npc.lastPanicSayAt || now - npc.lastPanicSayAt > 2800) {
      npc.lastPanicSayAt = now;
      say(`${npc.name} evacuates Rob's projected dumbass radius.`, 2.2);
    }
  }

  function nudgeBikeAwayFromNpc(npc, dt, now) {
    const dx = bike.x - npc.x;
    const dy = bike.y - npc.y;
    const mag = Math.hypot(dx, dy) || 1;
    bike.x += (dx / mag) * 48 * dt;
    bike.y += (dy / mag) * 48 * dt;
    bike.speed *= 0.42;
    npc.x -= (dx / mag) * 42 * dt;
    npc.y -= (dy / mag) * 42 * dt;
    npc.panicUntil = Math.max(npc.panicUntil || 0, now + 1400);
    npc.bubbleText = "AAAAAAAA!";
    npc.bubbleUntil = now + 1200;
    constrainPoint(npc, 10);
    constrainPoint(bike, 24);

    if (!npc.lastNearMissAt || now - npc.lastNearMissAt > 2200) {
      npc.lastNearMissAt = now;
      playDropSound();
      say(`Near miss: ${npc.name} refuses to become a hood ornament on a motorcycle with no hood.`, 3);
    }
  }

  function npcPanicText(npc) {
    const lines = {
      mavis: "NOT TODAY, DOME BOY!",
      gord: "I'M TOO DAMP TO DIE!",
      burt: "BRAKES, YOU CHROME IDIOT!",
      darlene: "MY BREAD DOUGH SAW THAT!",
      cecil: "SAVE THE CLAMATO!",
      miriam: "NOT IN MY PARKING LOT!",
    };
    return lines[npc.id] || "AAAAAAAA!";
  }

  function updateRoadVehicle(vehicle, dt, now) {
    const dir = signNonZero(vehicle.baseSpeed);
    const threat = nearestRoadThreat(vehicle, dir);
    const roadLeft = world.roadX - world.roadWidth / 2;
    const roadRight = world.roadX + world.roadWidth / 2;
    let targetX = vehicle.laneX;
    let targetSpeed = vehicle.baseSpeed;

    if (threat) {
      const ahead = dir * (threat.y - vehicle.y);
      const dx = threat.x - vehicle.x;
      const urgency = clamp((230 - ahead) / 230, 0, 1) * clamp((100 - Math.abs(dx)) / 100, 0, 1);
      const avoidSide = dx <= 0 ? 1 : -1;
      targetX = clamp(vehicle.laneX + avoidSide * (44 + urgency * 44), roadLeft - 18, roadRight + 18);
      targetSpeed = vehicle.baseSpeed * (ahead < 92 && Math.abs(dx) < 58 ? 0.04 : 0.35 + (1 - urgency) * 0.35);
      vehicle.alertUntil = now + 420;

      if (threat.kind === "robFoot" && ahead < 155 && Math.abs(dx) < 76) {
        triggerFootDodge(vehicle, dt, now);
      }
    }

    vehicle.speed += (targetSpeed - vehicle.speed) * Math.min(1, dt * 4);
    vehicle.x += (targetX - vehicle.x) * Math.min(1, dt * 5.5);
    vehicle.y += vehicle.speed * dt;

    if (dir > 0 && vehicle.y > world.maxY + 180) {
      vehicle.y = world.minY - 180;
      vehicle.x = vehicle.laneX;
      vehicle.speed = vehicle.baseSpeed;
    }
    if (dir < 0 && vehicle.y < world.minY - 180) {
      vehicle.y = world.maxY + 180;
      vehicle.x = vehicle.laneX;
      vehicle.speed = vehicle.baseSpeed;
    }
  }

  function updateCombine(combine, dt, now) {
    const threat = nearestCombineThreat(combine);
    const targetSpeed = threat ? 0 : combine.baseSpeed;
    combine.speed += (targetSpeed - combine.speed) * Math.min(1, dt * (threat ? 5 : 1.6));
    if (threat) {
      combine.alertUntil = now + 400;
      if (threat.kind === "robFoot" && distance(rob, combine) < 92) {
        triggerFootDodge(combine, dt, now);
      }
    }

    combine.x += combine.speed * combine.dir * dt;
      if (combine.x > combine.maxX) {
        combine.x = combine.maxX;
        combine.dir = -1;
      } else if (combine.x < combine.minX) {
        combine.x = combine.minX;
        combine.dir = 1;
      }
  }

  function nearestRoadThreat(vehicle, dir) {
    const candidates = [];
    if (rob.mode === "foot") {
      candidates.push({ kind: "robFoot", x: rob.x, y: rob.y });
    } else if (rob.mode === "bike" && !bike.fallen) {
      candidates.push({ kind: "robBike", x: bike.x, y: bike.y });
    }

    if (bike.fallen) {
      candidates.push({ kind: "fallenBike", x: bike.x, y: bike.y });
    }

    let nearest = null;
    let nearestAhead = Infinity;
    for (const candidate of candidates) {
      const ahead = dir * (candidate.y - vehicle.y);
      const lateral = Math.abs(candidate.x - vehicle.x);
      if (ahead < -36 || ahead > 245 || lateral > 115) continue;
      const surface = surfaceAt(candidate.x, candidate.y);
      if (surface !== "road" && surface !== "driveway") continue;
      if (ahead < nearestAhead) {
        nearest = candidate;
        nearestAhead = ahead;
      }
    }
    return nearest;
  }

  function nearestCombineThreat(combine) {
    const candidates = [];
    if (rob.mode === "foot") candidates.push({ kind: "robFoot", x: rob.x, y: rob.y });
    if (rob.mode === "bike" && !bike.fallen) candidates.push({ kind: "robBike", x: bike.x, y: bike.y });

    let nearest = null;
    let nearestDistance = 125;
    for (const candidate of candidates) {
      if (surfaceAt(candidate.x, candidate.y) !== "farm") continue;
      const candidateDistance = distance(candidate, combine);
      if (candidateDistance < nearestDistance) {
        nearest = candidate;
        nearestDistance = candidateDistance;
      }
    }
    return nearest;
  }

  function triggerFootDodge(vehicle, dt, now) {
    if (rob.mode !== "foot") return;
    const roadLeft = world.roadX - world.roadWidth / 2;
    const roadRight = world.roadX + world.roadWidth / 2;
    let side = rob.x < world.roadX ? -1 : 1;
    if (rob.x > roadLeft - 26 && rob.x < roadRight + 26) {
      side = rob.x < world.roadX ? -1 : 1;
      if (Math.abs(rob.x - world.roadX) < 18) side = vehicle.x <= world.roadX ? 1 : -1;
    } else if (vehicle.x < rob.x) {
      side = 1;
    } else {
      side = -1;
    }

    const dir = vehicle.dir ? vehicle.dir : signNonZero(vehicle.baseSpeed || 1);
    const vx = side;
    const vy = dir * 0.16;
    const mag = Math.hypot(vx, vy) || 1;
    rob.panicVectorX = vx / mag;
    rob.panicVectorY = vy / mag;
    rob.panicUntil = Math.max(rob.panicUntil, now + 760);

    if (now - rob.lastPanicSayAt > 2600) {
      rob.lastPanicSayAt = now;
      say("Rob panic-shuffles out of traffic with all the grace of a man who just remembered physics.", 2.6);
    }

    rob.x += rob.panicVectorX * rob.footSpeed * 2.2 * dt;
    rob.y += rob.panicVectorY * rob.footSpeed * 2.2 * dt;
    constrainPoint(rob, 12, { allowRiver: true });
  }

  function checkBikeImpact(now) {
    if (rob.mode !== "bike" || bike.fallen) return;

    for (const npc of npcs) {
      if (distance(bike, npc) > 36) continue;
      triggerNpcPanic(npc, 1, now);
      nudgeBikeAwayFromNpc(npc, 1 / 30, now);
      return;
    }

    for (const vehicle of roadVehicles) {
      if (!isVehicleCollision(bike, vehicle, 42, 35)) continue;
      vehicle.speed *= 0.12;
      vehicle.alertUntil = now + 1100;
      fallBike(vehicle, "Rob clips traffic and the Suzuki flops over like an expensive bad decision.", now);
      return;
    }

    for (const combine of combines) {
      if (!isVehicleCollision(bike, combine, 52, 42)) continue;
      combine.speed = 0;
      combine.alertUntil = now + 1100;
      fallBike(combine, "Rob introduces the cruiser to farm machinery. The machinery wins on paperwork alone.", now);
      return;
    }
  }

  function checkRoadHazards(now) {
    if (rob.mode !== "bike" || bike.fallen || !isSouthRoadUnlocked() || surfaceAt(bike.x, bike.y) !== "road") return;
    if (now - bike.lastHazardAt < 850) return;

    for (const hazard of roadHazards) {
      if (distance(bike, hazard) > hazard.r + 23) continue;
      bike.lastHazardAt = now;

      if (Math.abs(bike.speed) > 252) {
        fallBike(hazard, `Rob hits a ${hazard.label} at speed and learns the road has a cancellation policy.`, now);
        return;
      }

      const wobble = bike.x < hazard.x ? -0.32 : 0.32;
      bike.heading += wobble * signNonZero(bike.speed || 1);
      bike.speed *= 0.58;
      playDropSound();
      say(`Rob bounces through a ${hazard.label}. The dome wobbles; the parrots invent three new slurs for asphalt.`, 3.3);
      return;
    }
  }

  function applySouthGate(point, radius, now) {
    if (isSouthRoadUnlocked()) return;
    const limit = southGate.y - radius;
    if (point.y <= limit) return;

    point.y = limit;
    if (point === bike) bike.speed *= -0.16;

    if (now - lastSouthGateScoldAt > 2600) {
      lastSouthGateScoldAt = now;
      say("The south road is still blocked by a barricade and one deeply satisfied traffic cone. Finish two starter errands first.", 3.5);
    }
  }

  function fallBike(obstacle, text, now) {
    bike.fallen = true;
    bike.fallSide = bike.x >= obstacle.x ? 1 : -1;
    bike.speed = 0;
    rob.mode = "foot";
    rob.x = bike.x + bike.fallSide * 46;
    rob.y = bike.y + signNonZero(bike.y - obstacle.y) * 24;
    rob.heading = Math.atan2(rob.y - bike.y, rob.x - bike.x);
    rob.panicVectorX = bike.fallSide;
    rob.panicVectorY = 0.2;
    rob.panicUntil = now + 520;
    clearMovementInput();
    constrainPoint(rob, 12, { allowRiver: true });
    playCrashSound();
    say(`${text} Press E beside the bike to stand it back up.`, 4.2);
  }

  function isVehicleCollision(a, b, width, height) {
    return Math.abs(a.x - b.x) < width && Math.abs(a.y - b.y) < height;
  }

  function updateSwimmingState() {
    const swimming = isInRiver(rob);
    if (swimming && !rob.wasSwimming) {
      say("Rob enters the river. The parrots are not certified lifeguards, but they are screaming like management.", 3.2);
    } else if (!swimming && rob.wasSwimming) {
      say("Rob sloshes back onto land smelling like ambition and river mud.", 2.8);
    }
    rob.wasSwimming = swimming;
  }

  function updateOnFoot(dt, now) {
    const swimming = isInRiver(rob);
    if (rob.panicUntil > now) {
      const speed = rob.footSpeed * 1.95;
      rob.x += rob.panicVectorX * speed * dt;
      rob.y += rob.panicVectorY * speed * dt;
      rob.heading = Math.atan2(rob.panicVectorY, rob.panicVectorX);
      rob.isWalking = true;
      rob.walkTime += dt * 17;
      constrainPoint(rob, 12, { allowRiver: true });
      applySouthGate(rob, 12, now);
      return;
    }

    const xAxis = Number(input.right) - Number(input.left);
    const yAxis = Number(input.down) - Number(input.up);
    const mag = Math.hypot(xAxis, yAxis);
    rob.isWalking = mag > 0;
    if (mag > 0) {
      const speed = rob.footSpeed * (swimming ? 0.62 : input.run ? 1.35 : 1);
      rob.x += (xAxis / mag) * speed * dt;
      rob.y += (yAxis / mag) * speed * dt;
      rob.heading = Math.atan2(yAxis, xAxis);
      rob.walkTime += dt * (swimming ? 8.5 : input.run ? 13 : 10);
    } else {
      rob.walkTime += (0 - rob.walkTime) * Math.min(1, dt * 3);
    }
    constrainPoint(rob, 12, { allowRiver: true });
    applySouthGate(rob, 12, now);
    updateSwimmingState();
  }

  function updateBike(dt, now) {
    if (bike.fallen) {
      bike.speed = 0;
      return;
    }

    const throttle = Number(input.up) - Number(input.down);
    const steering = Number(input.right) - Number(input.left);
    const surface = surfaceAt(bike.x, bike.y);
    const onRoad = surface === "road" || surface === "driveway";
    const maxSpeed = onRoad ? 315 : 145;
    const reverseMax = -84;
    const accel = onRoad ? 270 : 160;
    const drag = onRoad ? 0.985 : 0.955;

    if (throttle > 0) {
      bike.speed += accel * dt;
    } else if (throttle < 0) {
      bike.speed -= (bike.speed > 0 ? 420 : 190) * dt;
    } else {
      bike.speed *= Math.pow(drag, dt * 60);
      if (Math.abs(bike.speed) < 3) bike.speed = 0;
    }

    bike.speed = clamp(bike.speed, reverseMax, maxSpeed);
    const speedRatio = clamp(Math.abs(bike.speed) / maxSpeed, 0, 1);
    const turnRate = (1.35 + speedRatio * 1.55) * (bike.speed >= 0 ? 1 : -1);
    bike.heading += steering * turnRate * dt;

    bike.x += Math.cos(bike.heading) * bike.speed * dt;
    bike.y += Math.sin(bike.heading) * bike.speed * dt;
    constrainPoint(bike, 24);
    applySouthGate(bike, 24, now);

    if (bike.x < world.riverRight + world.riverBankWidth) {
      bike.x = world.riverRight + world.riverBankWidth;
      bike.speed *= -0.15;
      say("The river bank votes no.", 1.7);
    }

    checkRoadHazards(now);
    checkBikeImpact(now);
  }

  function updateCamera(dt) {
    const target = rob.mode === "bike" ? bike : rob.mode === "home" ? homeDoor : rob;
    const follow = rob.mode === "bike" ? 8.5 : 6.5;
    camera.x += (target.x - camera.x) * Math.min(1, dt * follow);
    camera.y += (target.y - camera.y) * Math.min(1, dt * follow);
  }

  function updateHud(now) {
    if (rob.mode === "home") {
      modeLabel.textContent = "At home";
      speedLabel.textContent = "0 km/h";
      placeLabel.textContent = "Rob's house";
    } else if (rob.mode === "foot") {
      modeLabel.textContent = isInRiver(rob) ? "Swimming" : bike.fallen && distance(rob, bike) < 84 ? "Bike down" : distance(rob, bike) < 56 ? "By the bike" : "On foot";
      speedLabel.textContent = "0 km/h";
      placeLabel.textContent = placeName(rob.x, rob.y);
    } else {
      modeLabel.textContent = surfaceAt(bike.x, bike.y) === "road" ? "Riding" : "Off road";
      speedLabel.textContent = formatSpeed(bike.speed);
      placeLabel.textContent = placeName(bike.x, bike.y);
    }

    missionLabel.textContent = missionStatusText();
    missionDockTitle.textContent = missionStatusText();
    inventoryLabel.textContent = inventoryText();
    guideLabel.textContent = currentGuideText();

    if (toastUntil && now > toastUntil) {
      toast.hidden = true;
      toastUntil = 0;
    }
  }

  function draw(now) {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    ctx.clearRect(0, 0, width, height);
    drawGround(width, height);
    drawRiver();
    drawFields();
    drawRoad();
    drawSouthGate(now);
    drawDriveways();
    drawRoadVehicles(now);
    drawHardwareStore();
    drawYardSale();
    drawBaitShack();
    drawLegionHall();
    drawBlueRocket();
    drawFerryLookout();
    drawHouses();
    drawTrees();
    drawFarmDetails();
    drawCombines(now);
    drawTractorShed();
    drawDiscoveries(now);
    drawNpcs(now);
    drawWorldItems(now);
    drawMissionMarkers(now);
    drawBikeAndRob(now);
    drawPrompts(now);
    drawEveningTint(width, height, now);
    drawVignette(width, height);
  }

  function drawGround(width, height) {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#84c86f");
    gradient.addColorStop(0.45, "#73b962");
    gradient.addColorStop(1, "#5aa354");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.globalAlpha = 0.14;
    ctx.strokeStyle = "#e4f3bc";
    ctx.lineWidth = 1;
    for (let y = screenY(world.minY) - 120; y < screenY(world.maxY) + 160; y += 42) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y - 30);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawRiver() {
    const x = screenX(world.riverLeft);
    const y = screenY(world.minY);
    const h = world.maxY - world.minY;
    const riverWidth = world.riverRight - world.riverLeft;
    const river = ctx.createLinearGradient(x, 0, x + riverWidth, 0);
    river.addColorStop(0, "#3f8fc7");
    river.addColorStop(1, "#76c2d7");
    ctx.fillStyle = river;
    ctx.fillRect(x, y, riverWidth, h);

    ctx.save();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.42)";
    ctx.lineWidth = 2;
    for (let wy = world.minY; wy < world.maxY; wy += 190) {
      ctx.beginPath();
      for (let i = 0; i <= 8; i += 1) {
        const wx = world.riverLeft + 26 + i * ((riverWidth - 52) / 8);
        const sy = screenY(wy + Math.sin(i * 0.8) * 10);
        const sx = screenX(wx);
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.stroke();
    }
    ctx.restore();

    drawStrip(world.riverRight, world.minY, world.riverBankWidth, h, "#b55b32");
  }

  function drawFields() {
    for (const field of fields) {
      const sx = screenX(field.x);
      const sy = screenY(field.y);
      ctx.fillStyle = field.fill;
      ctx.fillRect(sx, sy, field.w, field.h);
      ctx.strokeStyle = "rgba(71, 76, 35, 0.35)";
      ctx.lineWidth = 3;
      ctx.strokeRect(sx + 2, sy + 2, field.w - 4, field.h - 4);

      ctx.save();
      ctx.strokeStyle = field.rows;
      ctx.globalAlpha = 0.72;
      ctx.lineWidth = 2;
      for (let row = 18; row < field.w; row += 26) {
        ctx.beginPath();
        ctx.moveTo(sx + row, sy + 10);
        ctx.lineTo(sx + row - 38, sy + field.h - 12);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  function drawRoad() {
    const roadLeft = world.roadX - world.roadWidth / 2;
    const roadY = screenY(world.minY);
    const roadH = world.maxY - world.minY;
    drawStrip(roadLeft - world.roadShoulder, world.minY, world.roadShoulder, roadH, "#b75731");
    drawStrip(roadLeft + world.roadWidth, world.minY, world.roadShoulder, roadH, "#b75731");

    ctx.fillStyle = "#5e6468";
    ctx.fillRect(screenX(roadLeft), roadY, world.roadWidth, roadH);

    ctx.save();
    ctx.strokeStyle = "rgba(255, 242, 172, 0.9)";
    ctx.lineWidth = 4;
    ctx.setLineDash([28, 30]);
    ctx.beginPath();
    ctx.moveTo(screenX(world.roadX), roadY - 20);
    ctx.lineTo(screenX(world.roadX), roadY + roadH + 20);
    ctx.stroke();
    ctx.restore();

    ctx.strokeStyle = "rgba(244, 244, 235, 0.85)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(screenX(roadLeft + 12), roadY);
    ctx.lineTo(screenX(roadLeft + 12), roadY + roadH);
    ctx.moveTo(screenX(roadLeft + world.roadWidth - 12), roadY);
    ctx.lineTo(screenX(roadLeft + world.roadWidth - 12), roadY + roadH);
    ctx.stroke();

    for (const mark of laneMarks) {
      drawPothole(mark.x, mark.y, mark.r);
    }

    for (const hazard of roadHazards) {
      drawRoadHazard(hazard);
    }
  }

  function drawSouthGate(now) {
    const roadLeft = world.roadX - world.roadWidth / 2;
    const sx = screenX(roadLeft - world.roadShoulder);
    const sy = screenY(southGate.y);
    const width = world.roadWidth + world.roadShoulder * 2;
    const open = isSouthRoadUnlocked();

    ctx.save();
    if (!open) {
      ctx.fillStyle = "rgba(33, 28, 22, 0.34)";
      ctx.fillRect(sx - 8, sy - 20, width + 16, 48);
      ctx.strokeStyle = "#f1d87d";
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(sx + 8, sy);
      ctx.lineTo(sx + width - 8, sy);
      ctx.stroke();
      ctx.strokeStyle = "#74362d";
      ctx.lineWidth = 4;
      for (let i = 0; i < 6; i += 1) {
        const x = sx + 18 + i * 34;
        ctx.beginPath();
        ctx.moveTo(x, sy - 16);
        ctx.lineTo(x + 24, sy + 16);
        ctx.stroke();
      }
      drawGateSign(world.roadX, southGate.y - 46, "ROAD CLOSED", "FINISH 2 ERRANDS");
    } else {
      const bob = Math.sin(now / 260) * 2;
      drawGateSign(world.roadX, southGate.y - 40 + bob, "SOUTH ROAD", "UNFORTUNATELY OPEN");
    }
    ctx.restore();
  }

  function drawGateSign(wx, wy, top, bottom) {
    const sx = screenX(wx);
    const sy = screenY(wy);
    ctx.strokeStyle = "#5e3f2b";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(sx, sy + 18);
    ctx.lineTo(sx, sy + 56);
    ctx.stroke();
    ctx.fillStyle = "#fff0b8";
    ctx.strokeStyle = "#5b332c";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(sx - 56, sy - 16, 112, 36, 5);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#4b3328";
    ctx.font = "900 9px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(top, sx, sy - 4);
    ctx.fillText(bottom, sx, sy + 8);
  }

  function drawDriveways() {
    for (const home of homes) {
      const y = home.primary ? drivewayY : home.y + 62;
      drawRedDirtPath(home.x + 54, y, -world.roadWidth / 2 - 10, y, home.primary ? 32 : 24);
    }
    drawRedDirtPath(hardwareStore.x + 96, hardwareStore.y + 92, -world.roadWidth / 2 - 8, hardwareStore.y + 92, 28);
    drawRedDirtPath(yardSale.x + 128, yardSale.y + 84, -world.roadWidth / 2 - 8, yardSale.y + 84, 26);
    drawRedDirtPath(baitShack.x + 128, baitShack.y + 92, -world.roadWidth / 2 - 8, baitShack.y + 92, 27);
    drawRedDirtPath(legionHall.x + 132, legionHall.y + 92, -world.roadWidth / 2 - 8, legionHall.y + 92, 30);
    drawRedDirtPath(world.roadWidth / 2 + 10, tractorShed.y, tractorShed.x - 40, tractorShed.y, 28);
    drawRedDirtPath(world.roadWidth / 2 + 10, blueRocket.y, blueRocket.x - 18, blueRocket.y, 24);
    drawRedDirtPath(world.roadWidth / 2 + 10, ferryLookout.y, ferryLookout.x - 26, ferryLookout.y, 22);
  }

  function drawHouses() {
    for (const home of homes) {
      drawHouse(home);
    }
  }

  function drawFarmDetails() {
    for (const field of fields) {
      if (field.barn) drawBarn(field.x + field.w - 110, field.y + 86);
      if (field.silo) drawSilo(field.x + field.w - 90, field.y + 120);
    }

    drawFence(116, world.minY, world.maxY);
  }

  function drawRoadVehicles(now) {
    for (const vehicle of roadVehicles) {
      const sx = screenX(vehicle.x);
      const sy = screenY(vehicle.y);
      if (sx < -90 || sx > canvas.clientWidth + 90 || sy < -110 || sy > canvas.clientHeight + 110) continue;
      drawRoadVehicle(vehicle, now);
    }
  }

  function drawRoadVehicle(vehicle, now) {
    const sx = screenX(vehicle.x);
    const sy = screenY(vehicle.y);
    const heading = vehicle.baseSpeed >= 0 ? Math.PI / 2 : -Math.PI / 2;
    const swerve = clamp((vehicle.x - vehicle.laneX) / 90, -0.28, 0.28) * signNonZero(vehicle.baseSpeed);
    const wobble = Math.sin(now / 180 + vehicle.y * 0.02) * 1.2;

    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(heading + swerve);

    ctx.fillStyle = "rgba(28, 28, 25, 0.26)";
    ctx.beginPath();
    ctx.ellipse(0, 10, vehicle.length * 0.58, 17, 0, 0, Math.PI * 2);
    ctx.fill();

    if (vehicle.kind === "tractor") {
      ctx.fillStyle = vehicle.color;
      ctx.beginPath();
      ctx.roundRect(-24, -16, 48, 32, 7);
      ctx.fill();
      ctx.fillStyle = vehicle.accent;
      ctx.fillRect(2, -22, 22, 18);
      ctx.fillStyle = "#1e221d";
      ctx.beginPath();
      ctx.arc(-23, -17, 9 + Math.sin(now / 140) * 0.5, 0, Math.PI * 2);
      ctx.arc(-23, 17, 9 + Math.sin(now / 140) * 0.5, 0, Math.PI * 2);
      ctx.arc(22, -18, 13, 0, Math.PI * 2);
      ctx.arc(22, 18, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 233, 142, 0.72)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(24, -9);
      ctx.lineTo(38, -12 + wobble);
      ctx.moveTo(24, 9);
      ctx.lineTo(38, 12 - wobble);
      ctx.stroke();
    } else {
      ctx.fillStyle = vehicle.color;
      ctx.beginPath();
      ctx.roundRect(-vehicle.length / 2, -16, vehicle.length, 32, 7);
      ctx.fill();
      ctx.fillStyle = vehicle.accent;
      ctx.beginPath();
      ctx.roundRect(2, -13, vehicle.length * 0.32, 26, 5);
      ctx.fill();
      ctx.fillStyle = "#1b1f21";
      ctx.beginPath();
      ctx.ellipse(-vehicle.length * 0.32, -17, 8, 5, 0, 0, Math.PI * 2);
      ctx.ellipse(vehicle.length * 0.32, -17, 8, 5, 0, 0, Math.PI * 2);
      ctx.ellipse(-vehicle.length * 0.32, 17, 8, 5, 0, 0, Math.PI * 2);
      ctx.ellipse(vehicle.length * 0.32, 17, 8, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      if (vehicle.kind === "pickup") {
        ctx.fillStyle = "rgba(80, 45, 31, 0.62)";
        ctx.fillRect(-vehicle.length / 2 + 7, -12, 20, 24);
      }
    }

    ctx.restore();

    if (vehicle.alertUntil > now) {
      drawAlertMark(vehicle.x, vehicle.y - 42, now);
    }
  }

  function drawAlertMark(wx, wy, now) {
    const sx = screenX(wx);
    const sy = screenY(wy) + Math.sin(now / 90) * 2;
    ctx.save();
    ctx.fillStyle = "rgba(255, 227, 140, 0.92)";
    ctx.strokeStyle = "rgba(34, 35, 27, 0.82)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(sx - 10, sy - 16, 20, 28, 6);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#2d2519";
    ctx.font = "900 18px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("!", sx, sy - 2);
    ctx.restore();
  }

  function drawCombines(now) {
    for (const combine of combines) {
      const sx = screenX(combine.x);
      const sy = screenY(combine.y);
      if (sx < -100 || sx > canvas.clientWidth + 100 || sy < -90 || sy > canvas.clientHeight + 90) continue;
      drawCombine(combine, now);
    }
  }

  function drawCombine(combine, now) {
    const sx = screenX(combine.x);
    const sy = screenY(combine.y + Math.sin(now / 360) * 3);

    ctx.save();
    ctx.translate(sx, sy);
    ctx.scale(combine.dir, 1);

    ctx.fillStyle = "rgba(36, 33, 26, 0.25)";
    ctx.beginPath();
    ctx.ellipse(0, 18, 56, 15, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = combine.color;
    ctx.beginPath();
    ctx.roundRect(-30, -16, 58, 32, 7);
    ctx.fill();
    ctx.fillStyle = combine.accent;
    ctx.fillRect(2, -25, 24, 20);
    ctx.fillStyle = "rgba(209, 235, 255, 0.72)";
    ctx.fillRect(7, -21, 14, 10);

    ctx.fillStyle = "#2a2c24";
    ctx.beginPath();
    ctx.arc(-18, 18, 11, 0, Math.PI * 2);
    ctx.arc(24, 18, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#d9be58";
    ctx.beginPath();
    ctx.arc(-18, 18, 4, 0, Math.PI * 2);
    ctx.arc(24, 18, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#5a3b25";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-42, -8);
    ctx.lineTo(-62, -14);
    ctx.moveTo(-42, 0);
    ctx.lineTo(-66, 3);
    ctx.moveTo(-42, 8);
    ctx.lineTo(-62, 16);
    ctx.stroke();
    ctx.restore();

    if (combine.alertUntil > now) {
      drawAlertMark(combine.x, combine.y - 42, now);
    }
  }

  function drawDiscoveries(now) {
    for (const discovery of discoveries) {
      const sx = screenX(discovery.x);
      const sy = screenY(discovery.y);
      if (sx < -70 || sx > canvas.clientWidth + 70 || sy < -80 || sy > canvas.clientHeight + 80) continue;
      drawDiscovery(discovery, now);
    }
  }

  function drawDiscovery(discovery, now) {
    const sx = screenX(discovery.x);
    const sy = screenY(discovery.y);

    ctx.save();
    if (!discovery.seen) {
      const pulse = 1 + Math.sin(now / 260) * 0.08;
      ctx.strokeStyle = "rgba(255, 238, 156, 0.62)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(sx, sy + 14, 26 * pulse, 12 * pulse, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.fillStyle = "rgba(35, 35, 28, 0.22)";
    ctx.beginPath();
    ctx.ellipse(sx + 3, sy + 18, 24, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    if (discovery.kind === "sign") {
      ctx.strokeStyle = "#5a3a25";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(sx, sy + 8);
      ctx.lineTo(sx, sy + 35);
      ctx.stroke();
      ctx.fillStyle = discovery.color;
      ctx.strokeStyle = discovery.accent;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(sx - 26, sy - 15, 52, 28, 4);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = discovery.accent;
      ctx.font = "800 9px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(discovery.seen ? "READ" : "???", sx, sy);
    } else if (discovery.kind === "cooler") {
      ctx.fillStyle = discovery.color;
      ctx.beginPath();
      ctx.roundRect(sx - 24, sy - 8, 48, 24, 5);
      ctx.fill();
      ctx.fillStyle = discovery.accent;
      ctx.fillRect(sx - 20, sy - 14, 40, 8);
      ctx.fillStyle = "#2d454c";
      ctx.fillRect(sx - 6, sy - 16, 12, 5);
    } else {
      ctx.fillStyle = discovery.color;
      ctx.beginPath();
      ctx.ellipse(sx, sy + 4, 20, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = discovery.accent;
      ctx.beginPath();
      ctx.ellipse(sx, sy, 16, 7, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawNpcs(now) {
    for (const npc of npcs) {
      const sx = screenX(npc.x);
      const sy = screenY(npc.y);
      if (sx < -70 || sx > canvas.clientWidth + 70 || sy < -100 || sy > canvas.clientHeight + 100) continue;
      drawNpc(npc, now);
      if (npc.bubbleUntil > now && npc.bubbleText) {
        drawSpeechBubble(npc.x, npc.y - 58, npc.bubbleText);
      }
    }
  }

  function drawNpc(npc, now) {
    const sx = screenX(npc.x);
    const sy = screenY(npc.y);
    const panicking = npc.panicUntil > now;
    const stride = Math.sin(now / (panicking ? 95 : 250) + npc.phase) * (panicking ? 6.2 : 2.6);
    const lean = panicking ? Math.atan2(npc.panicVectorY || 0, npc.panicVectorX || 1) * 0.08 : 0;

    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(lean);
    ctx.fillStyle = "rgba(30, 35, 28, 0.23)";
    ctx.beginPath();
    ctx.ellipse(2, 17, 16, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#22251f";
    ctx.lineCap = "round";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-4, 8);
    ctx.lineTo(-8 + stride, 18);
    ctx.moveTo(4, 8);
    ctx.lineTo(8 - stride, 18);
    ctx.stroke();

    ctx.fillStyle = npc.color;
    ctx.beginPath();
    ctx.roundRect(-9, -7, 18, 20, 5);
    ctx.fill();
    ctx.fillStyle = npc.accent;
    ctx.fillRect(-7, -4, 14, 4);
    ctx.fillStyle = npc.skin;
    ctx.beginPath();
    ctx.arc(0, -16, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = npc.hat;
    ctx.beginPath();
    ctx.ellipse(0, -23, 11, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(-7, -28, 14, 7);
    if (panicking) {
      ctx.fillStyle = "#fff6bf";
      ctx.font = "900 13px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("!", 0, -40);
    }
    ctx.restore();
  }

  function drawSpeechBubble(wx, wy, text) {
    const sx = screenX(wx);
    const sy = screenY(wy);
    ctx.save();
    ctx.font = "700 11px system-ui, sans-serif";
    const lines = wrapText(text, 172, 3);
    const width = Math.min(196, Math.max(96, ...lines.map((line) => ctx.measureText(line).width + 18)));
    const height = lines.length * 14 + 13;
    const x = clamp(sx - width / 2, 8, canvas.clientWidth - width - 8);
    const y = clamp(sy - height, 72, canvas.clientHeight - height - 140);

    ctx.fillStyle = "rgba(27, 38, 34, 0.88)";
    ctx.strokeStyle = "rgba(255, 249, 223, 0.72)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, 7);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#fff6bf";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    lines.forEach((line, index) => {
      ctx.fillText(line, x + 9, y + 7 + index * 14);
    });
    ctx.restore();
  }

  function wrapText(text, maxWidth, maxLines) {
    const words = text.split(" ");
    const lines = [];
    let line = "";

    for (const word of words) {
      const next = line ? `${line} ${word}` : word;
      if (ctx.measureText(next).width <= maxWidth) {
        line = next;
        continue;
      }

      if (line) lines.push(line);
      line = word;

      if (lines.length === maxLines - 1) break;
    }

    if (line && lines.length < maxLines) lines.push(line);
    const usedWords = lines.join(" ").split(" ").filter(Boolean).length;
    if (usedWords < words.length && lines.length) {
      lines[lines.length - 1] = `${lines[lines.length - 1].replace(/\.*$/, "")}...`;
    }
    return lines;
  }

  function drawTrees() {
    for (const tree of trees) {
      const sx = screenX(tree.x);
      const sy = screenY(tree.y);
      if (sx < -80 || sx > canvas.clientWidth + 80 || sy < -100 || sy > canvas.clientHeight + 100) continue;
      ctx.fillStyle = "rgba(39, 56, 35, 0.24)";
      ctx.beginPath();
      ctx.ellipse(sx + 5, sy + 12, tree.r * 1.1, tree.r * 0.42, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = tree.trunk;
      ctx.fillRect(sx - 3, sy + 5, 6, 14);
      ctx.fillStyle = tree.fill;
      ctx.beginPath();
      ctx.arc(sx, sy, tree.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.12)";
      ctx.beginPath();
      ctx.arc(sx - tree.r * 0.28, sy - tree.r * 0.26, tree.r * 0.36, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawBikeAndRob(now) {
    if (rob.mode !== "bike") {
      drawBike(bike.x, bike.y, bike.heading, false, now);
    }

    if (rob.mode === "foot") {
      if (isInRiver(rob)) drawRobSwimming(rob.x, rob.y, rob.heading, now);
      else drawRobOnFoot(rob.x, rob.y, rob.heading, now);
    } else if (rob.mode === "bike") {
      drawBike(bike.x, bike.y, bike.heading, true, now);
    }
  }

  function drawPrompts(now) {
    if (rob.mode === "home") {
      drawPrompt(homeDoor.x, homeDoor.y - 36, "E", now);
      return;
    }

    const actor = actorPoint();
    if (rob.mode === "foot" && bike.fallen && distance(rob, bike) < 84) {
      drawPrompt(bike.x, bike.y - 54, "E", now);
      return;
    }

    const nearbyItem = nearestWorldItem(actor, 74);
    if (nearbyItem && (rob.mode !== "bike" || Math.abs(bike.speed) < 34)) {
      drawPrompt(nearbyItem.x, nearbyItem.y - 42, "E", now);
      return;
    }

    if (canDeliverActiveMission(actor) && (rob.mode !== "bike" || Math.abs(bike.speed) < 34)) {
      const target = currentMissionLeg(activeMissionDef(), activeMissionState()).drop;
      drawPrompt(target.x, target.y - 50, "E", now);
      return;
    }

    if (rob.mode === "foot") {
      const npc = nearestNpc(rob, 70);
      if (npc) {
        drawPrompt(npc.x, npc.y - 42, "E", now);
        return;
      }

      const discovery = nearestDiscovery(rob, 66);
      if (discovery) {
        drawPrompt(discovery.x, discovery.y - 42, "E", now);
        return;
      }
    }

    if (rob.mode === "foot" && distance(rob, bike) < 72) {
      drawPrompt(bike.x, bike.y - 54, "E", now);
      return;
    }

    if (rob.mode === "foot" && distance(rob, homeDoor) < 64) {
      drawPrompt(homeDoor.x, homeDoor.y - 36, "E", now);
    }
  }

  function drawVignette(width, height) {
    const gradient = ctx.createRadialGradient(width / 2, height / 2, Math.min(width, height) * 0.2, width / 2, height / 2, Math.max(width, height) * 0.72);
    gradient.addColorStop(0, "rgba(10, 32, 24, 0)");
    gradient.addColorStop(1, "rgba(10, 32, 24, 0.22)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  function drawEveningTint(width, height, now) {
    if (!endgameReady && !dayEnded) return;

    const dusk = dayEnded ? 1 : clamp((now - duskStartedAt) / 12000, 0.18, 1);
    const glow = ctx.createLinearGradient(0, 0, width, height);
    glow.addColorStop(0, `rgba(255, 178, 98, ${0.1 * dusk})`);
    glow.addColorStop(0.55, `rgba(137, 74, 106, ${0.16 * dusk})`);
    glow.addColorStop(1, `rgba(18, 26, 48, ${0.3 * dusk})`);
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.globalAlpha = 0.34 * dusk;
    ctx.fillStyle = "#f1b96f";
    ctx.beginPath();
    ctx.arc(width - 86, 96, 34, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = 0.5 * dusk;
    ctx.fillStyle = "#fff0a8";
    ctx.beginPath();
    ctx.ellipse(screenX(homeDoor.x + 18), screenY(homeDoor.y + 6), 34, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawEndingScene(now) {
    if (endingOverlay.hidden) return;

    const width = endingCanvas.clientWidth;
    const height = endingCanvas.clientHeight;
    if (!width || !height) return;

    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const pixelWidth = Math.floor(width * dpr);
    const pixelHeight = Math.floor(height * dpr);
    if (endingCanvas.width !== pixelWidth || endingCanvas.height !== pixelHeight) {
      endingCanvas.width = pixelWidth;
      endingCanvas.height = pixelHeight;
    }

    const ec = endingCtx;
    ec.setTransform(dpr, 0, 0, dpr, 0, 0);
    ec.clearRect(0, 0, width, height);

    const flicker = 0.5 + Math.sin(now / 95) * 0.06 + Math.sin(now / 37) * 0.035;
    const room = ec.createLinearGradient(0, 0, width, height);
    room.addColorStop(0, "#352342");
    room.addColorStop(0.54, "#1d2e35");
    room.addColorStop(1, "#111b22");
    ec.fillStyle = room;
    ec.fillRect(0, 0, width, height);

    ec.fillStyle = "rgba(255, 184, 101, 0.18)";
    ec.beginPath();
    ec.arc(width * 0.11, height * 0.16, width * 0.1, 0, Math.PI * 2);
    ec.fill();

    ec.fillStyle = "#21313a";
    ec.fillRect(0, height * 0.69, width, height * 0.31);
    ec.strokeStyle = "rgba(255, 232, 164, 0.14)";
    ec.lineWidth = 1;
    for (let x = -20; x < width + 40; x += 34) {
      ec.beginPath();
      ec.moveTo(x, height);
      ec.lineTo(x + 74, height * 0.69);
      ec.stroke();
    }

    const tv = {
      x: width * 0.57,
      y: height * 0.13,
      w: width * 0.34,
      h: height * 0.4,
    };
    drawEndingTv(tv.x, tv.y, tv.w, tv.h, now, flicker);

    const couchX = width * 0.09;
    const couchY = height * 0.55;
    const couchW = width * 0.5;
    const couchH = height * 0.25;
    ec.fillStyle = "rgba(3, 8, 10, 0.32)";
    ec.beginPath();
    ec.ellipse(couchX + couchW * 0.52, couchY + couchH * 0.93, couchW * 0.52, couchH * 0.16, 0, 0, Math.PI * 2);
    ec.fill();

    ec.fillStyle = "#6b3e4d";
    ec.beginPath();
    ec.roundRect(couchX, couchY + couchH * 0.22, couchW, couchH * 0.6, 12);
    ec.fill();
    ec.fillStyle = "#8b5260";
    ec.beginPath();
    ec.roundRect(couchX + 12, couchY, couchW - 24, couchH * 0.4, 12);
    ec.fill();
    ec.fillStyle = "#4d2d38";
    ec.fillRect(couchX + 24, couchY + couchH * 0.72, couchW - 48, couchH * 0.12);

    drawEndingRob(couchX + couchW * 0.42, couchY + couchH * 0.25, couchW, couchH, now);
    drawEndingParrot(couchX + couchW * 0.12, couchY + couchH * 0.05, "#2d9e4e", "#d63e30", now);
    drawEndingParrot(couchX + couchW * 0.86, couchY + couchH * 0.02, "#b8b531", "#ede05b", now + 700);
    drawEndingSnackTray(width * 0.42, height * 0.79, width * 0.17, height * 0.1, now);

    ec.fillStyle = "rgba(255, 240, 184, 0.78)";
    ec.font = `800 ${Math.max(10, width * 0.024)}px system-ui, sans-serif`;
    ec.textAlign = "center";
    ec.textBaseline = "middle";
    ec.fillText("END OF DAY: NO FURTHER COMMERCE", width * 0.5, height * 0.93);

    ec.save();
    ec.globalAlpha = 0.14 + flicker * 0.08;
    ec.fillStyle = "#fff0a8";
    ec.fillRect(0, 0, width, height);
    ec.restore();
  }

  function drawEndingTv(x, y, w, h, now, flicker) {
    const ec = endingCtx;
    ec.fillStyle = "rgba(0, 0, 0, 0.36)";
    ec.beginPath();
    ec.ellipse(x + w * 0.5, y + h * 1.2, w * 0.55, h * 0.12, 0, 0, Math.PI * 2);
    ec.fill();

    ec.fillStyle = "#12171c";
    ec.beginPath();
    ec.roundRect(x - 10, y - 8, w + 20, h + 18, 12);
    ec.fill();
    ec.fillStyle = "#26343b";
    ec.beginPath();
    ec.roundRect(x, y, w, h, 8);
    ec.fill();

    const screenX = x + w * 0.07;
    const screenY = y + h * 0.08;
    const screenW = w * 0.86;
    const screenH = h * 0.73;
    const screen = ec.createLinearGradient(screenX, screenY, screenX + screenW, screenY + screenH);
    screen.addColorStop(0, `rgba(91, 172, 177, ${0.76 + flicker * 0.1})`);
    screen.addColorStop(1, `rgba(21, 38, 58, ${0.96})`);
    ec.fillStyle = screen;
    ec.beginPath();
    ec.roundRect(screenX, screenY, screenW, screenH, 5);
    ec.fill();

    ec.fillStyle = "#24313f";
    ec.fillRect(screenX, screenY + screenH * 0.62, screenW, screenH * 0.38);
    ec.fillStyle = "#d6c7a6";
    for (let i = 0; i < 7; i += 1) {
      const bx = screenX + i * screenW * 0.13 + Math.sin(now / 400 + i) * 2;
      const bh = screenH * (0.12 + (i % 3) * 0.07);
      ec.fillRect(bx, screenY + screenH * 0.62 - bh, screenW * 0.07, bh);
    }

    const stomp = Math.sin(now / 240);
    const mx = screenX + screenW * 0.55 + stomp * screenW * 0.05;
    const my = screenY + screenH * 0.52;
    ec.fillStyle = "#1b2b28";
    ec.beginPath();
    ec.ellipse(mx, my, screenW * 0.13, screenH * 0.28, 0.08, 0, Math.PI * 2);
    ec.fill();
    ec.beginPath();
    ec.arc(mx + screenW * 0.08, my - screenH * 0.22, screenW * 0.07, 0, Math.PI * 2);
    ec.fill();

    ec.strokeStyle = "#1b2b28";
    ec.lineWidth = Math.max(3, screenW * 0.02);
    ec.lineCap = "round";
    ec.beginPath();
    ec.moveTo(mx - screenW * 0.12, my + screenH * 0.1);
    ec.lineTo(mx - screenW * 0.3, my + screenH * 0.22 + stomp * 4);
    ec.moveTo(mx + screenW * 0.05, my - screenH * 0.06);
    ec.lineTo(mx + screenW * 0.22, my - screenH * 0.15 + stomp * 8);
    ec.moveTo(mx + screenW * 0.02, my + screenH * 0.2);
    ec.lineTo(mx - screenW * 0.03, my + screenH * 0.36);
    ec.moveTo(mx + screenW * 0.1, my + screenH * 0.18);
    ec.lineTo(mx + screenW * 0.18, my + screenH * 0.35);
    ec.stroke();

    ec.fillStyle = "#d9cf9e";
    for (let i = 0; i < 6; i += 1) {
      ec.beginPath();
      ec.moveTo(mx - screenW * 0.03 + i * screenW * 0.025, my - screenH * 0.25 + i * 1.2);
      ec.lineTo(mx + screenW * 0.02 + i * screenW * 0.025, my - screenH * 0.33 + i * 1.2);
      ec.lineTo(mx + screenW * 0.05 + i * screenW * 0.025, my - screenH * 0.23 + i * 1.2);
      ec.closePath();
      ec.fill();
    }

    ec.fillStyle = "rgba(255, 245, 200, 0.92)";
    ec.font = `900 ${Math.max(10, screenW * 0.09)}px system-ui, sans-serif`;
    ec.textAlign = "left";
    ec.textBaseline = "top";
    ec.fillText("ROAR!", screenX + screenW * 0.08, screenY + screenH * 0.08);

    ec.strokeStyle = `rgba(255, 255, 255, ${0.08 + flicker * 0.06})`;
    ec.lineWidth = 1;
    for (let sy = screenY + 5; sy < screenY + screenH; sy += 9) {
      ec.beginPath();
      ec.moveTo(screenX + 4, sy);
      ec.lineTo(screenX + screenW - 4, sy);
      ec.stroke();
    }

    ec.fillStyle = "#101416";
    ec.fillRect(x + w * 0.42, y + h + 10, w * 0.16, h * 0.12);
    ec.fillRect(x + w * 0.24, y + h * 1.08, w * 0.52, h * 0.07);
    ec.fillStyle = "#f1d77b";
    ec.font = `800 ${Math.max(8, w * 0.045)}px system-ui, sans-serif`;
    ec.textAlign = "center";
    ec.textBaseline = "middle";
    ec.fillText("MONSTER MOVIE", x + w * 0.5, y + h * 0.9);
  }

  function drawEndingRob(x, y, couchW, couchH, now) {
    const ec = endingCtx;
    const breathing = Math.sin(now / 520) * 2;
    ec.save();
    ec.translate(x, y + breathing);

    ec.fillStyle = "#23313a";
    ec.beginPath();
    ec.ellipse(0, couchH * 0.48, couchW * 0.18, couchH * 0.26, -0.12, 0, Math.PI * 2);
    ec.fill();
    ec.fillStyle = "#506574";
    ec.beginPath();
    ec.roundRect(-couchW * 0.14, couchH * 0.27, couchW * 0.24, couchH * 0.27, 10);
    ec.fill();

    ec.strokeStyle = "#1b2024";
    ec.lineCap = "round";
    ec.lineWidth = Math.max(5, couchW * 0.018);
    ec.beginPath();
    ec.moveTo(-couchW * 0.08, couchH * 0.5);
    ec.lineTo(-couchW * 0.2, couchH * 0.72);
    ec.moveTo(couchW * 0.04, couchH * 0.5);
    ec.lineTo(couchW * 0.17, couchH * 0.69);
    ec.stroke();

    ec.fillStyle = "#d7a173";
    ec.beginPath();
    ec.arc(-couchW * 0.04, couchH * 0.18, couchW * 0.06, 0, Math.PI * 2);
    ec.fill();
    ec.fillStyle = "#e7dfd3";
    ec.beginPath();
    ec.arc(-couchW * 0.02, couchH * 0.2, couchW * 0.034, 0, Math.PI * 2);
    ec.fill();
    ec.strokeStyle = "#e7dfd3";
    ec.lineWidth = 3;
    ec.beginPath();
    ec.arc(-couchW * 0.045, couchH * 0.21, couchW * 0.045, 0.25, 1.5);
    ec.stroke();

    ec.strokeStyle = "rgba(206, 236, 255, 0.62)";
    ec.fillStyle = "rgba(202, 236, 255, 0.12)";
    ec.lineWidth = 2;
    ec.beginPath();
    ec.arc(-couchW * 0.04, couchH * 0.18, couchW * 0.12 + Math.sin(now / 700) * 1.5, 0, Math.PI * 2);
    ec.fill();
    ec.stroke();

    ec.fillStyle = "#1a1d20";
    ec.beginPath();
    ec.ellipse(-couchW * 0.18, couchH * 0.75, couchW * 0.05, couchH * 0.035, 0, 0, Math.PI * 2);
    ec.ellipse(couchW * 0.18, couchH * 0.72, couchW * 0.05, couchH * 0.035, 0, 0, Math.PI * 2);
    ec.fill();
    ec.restore();
  }

  function drawEndingParrot(x, y, body, head, now) {
    const ec = endingCtx;
    const bob = Math.sin(now / 220) * 3;
    ec.save();
    ec.translate(x, y + bob);
    ec.fillStyle = "rgba(0, 0, 0, 0.18)";
    ec.beginPath();
    ec.ellipse(2, 24, 18, 6, 0, 0, Math.PI * 2);
    ec.fill();
    ec.fillStyle = body;
    ec.beginPath();
    ec.ellipse(0, 8, 10, 17, -0.25, 0, Math.PI * 2);
    ec.fill();
    ec.fillStyle = head;
    ec.beginPath();
    ec.arc(7, -6, 8, 0, Math.PI * 2);
    ec.fill();
    ec.fillStyle = "#222";
    ec.beginPath();
    ec.arc(10, -8, 1.6, 0, Math.PI * 2);
    ec.fill();
    ec.strokeStyle = body;
    ec.lineWidth = 4;
    ec.beginPath();
    ec.moveTo(-8, 5);
    ec.lineTo(-22, -2 + Math.sin(now / 120) * 4);
    ec.stroke();
    ec.restore();
  }

  function drawEndingSnackTray(x, y, w, h, now) {
    const ec = endingCtx;
    ec.fillStyle = "rgba(0, 0, 0, 0.26)";
    ec.beginPath();
    ec.ellipse(x + w * 0.5, y + h * 0.7, w * 0.6, h * 0.2, 0, 0, Math.PI * 2);
    ec.fill();
    ec.fillStyle = "#4a342c";
    ec.beginPath();
    ec.roundRect(x, y, w, h * 0.45, 8);
    ec.fill();
    ec.fillStyle = "#f3d187";
    ec.font = `900 ${Math.max(8, w * 0.12)}px system-ui, sans-serif`;
    ec.textAlign = "center";
    ec.textBaseline = "middle";
    ec.fillText("SNACKS", x + w * 0.5, y + h * 0.24);

    const colors = ["#ff6f91", "#ffe66d", "#76e0a3", "#8cc8ff", "#cf8cff"];
    for (let i = 0; i < 9; i += 1) {
      const gx = x + w * (0.14 + (i % 5) * 0.18);
      const gy = y - h * 0.14 + Math.floor(i / 5) * h * 0.22;
      const pulse = 1 + Math.sin(now / 180 + i) * 0.18;
      ec.fillStyle = colors[i % colors.length];
      ec.beginPath();
      ec.arc(gx, gy, Math.max(3, w * 0.035) * pulse, 0, Math.PI * 2);
      ec.fill();
      ec.strokeStyle = `rgba(255, 255, 255, ${0.3 + Math.sin(now / 150 + i) * 0.2})`;
      ec.beginPath();
      ec.arc(gx, gy, Math.max(6, w * 0.06) * pulse, 0, Math.PI * 2);
      ec.stroke();
    }
  }

  function drawHardwareStore() {
    const x = screenX(hardwareStore.x);
    const y = screenY(hardwareStore.y);
    ctx.fillStyle = "rgba(36, 38, 30, 0.24)";
    ctx.fillRect(x - 10, y + 12, 146, 96);

    ctx.fillStyle = "#d7c38e";
    ctx.fillRect(x, y + 28, 132, 82);
    ctx.strokeStyle = "rgba(74, 59, 38, 0.42)";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y + 28, 132, 82);

    ctx.fillStyle = "#456f68";
    ctx.beginPath();
    ctx.moveTo(x - 9, y + 34);
    ctx.lineTo(x + 66, y - 8);
    ctx.lineTo(x + 141, y + 34);
    ctx.lineTo(x + 124, y + 48);
    ctx.lineTo(x + 8, y + 48);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#58372a";
    ctx.fillRect(x + 16, y + 64, 30, 46);
    ctx.fillStyle = "#eaf1d7";
    ctx.fillRect(x + 62, y + 64, 48, 24);

    ctx.fillStyle = "#f9ebaa";
    ctx.strokeStyle = "#58372a";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x + 18, y + 12, 96, 24, 4);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#4b3328";
    ctx.font = "700 10px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("HARDWARE-ISH", x + 66, y + 25);

    drawCrate(hardwareStore.counterX + 6, hardwareStore.counterY + 4, "#83623d");
  }

  function drawYardSale() {
    const x = screenX(yardSale.x);
    const y = screenY(yardSale.y);
    ctx.fillStyle = "rgba(36, 33, 27, 0.22)";
    ctx.fillRect(x - 8, y + 12, 160, 92);

    ctx.fillStyle = "#e9d8af";
    ctx.fillRect(x, y + 28, 118, 72);
    ctx.fillStyle = "#825141";
    ctx.beginPath();
    ctx.moveTo(x - 8, y + 34);
    ctx.lineTo(x + 58, y - 4);
    ctx.lineTo(x + 126, y + 34);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#59362a";
    ctx.fillRect(x + 18, y + 62, 28, 38);
    ctx.fillStyle = "#fff1b8";
    ctx.font = "800 10px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("YARD", x + 88, y + 61);
    ctx.fillText("SALE", x + 88, y + 73);

    drawCrate(yardSale.tableX - 8, yardSale.tableY + 8, "#7a5b45");
    drawCrate(yardSale.tableX + 36, yardSale.tableY + 12, "#a36b4c");
  }

  function drawBaitShack() {
    const x = screenX(baitShack.x);
    const y = screenY(baitShack.y);
    ctx.fillStyle = "rgba(36, 33, 27, 0.23)";
    ctx.fillRect(x - 7, y + 16, 162, 92);

    ctx.fillStyle = "#d2e0d3";
    ctx.fillRect(x, y + 32, 128, 76);
    ctx.fillStyle = "#325c63";
    ctx.beginPath();
    ctx.moveTo(x - 10, y + 38);
    ctx.lineTo(x + 64, y - 2);
    ctx.lineTo(x + 139, y + 38);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#55372b";
    ctx.fillRect(x + 18, y + 66, 30, 42);
    ctx.fillStyle = "#d65143";
    ctx.beginPath();
    ctx.roundRect(x + 64, y + 62, 42, 26, 5);
    ctx.fill();

    ctx.fillStyle = "#fff0b8";
    ctx.strokeStyle = "#55372b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x + 22, y + 13, 88, 23, 4);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#48332a";
    ctx.font = "800 10px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("BAIT & REGRET", x + 66, y + 25);

    drawCrate(baitShack.counterX - 14, baitShack.counterY + 8, "#6f6045");
    drawCrate(baitShack.counterX + 30, baitShack.counterY + 26, "#3f7890");
  }

  function drawLegionHall() {
    const x = screenX(legionHall.x);
    const y = screenY(legionHall.y);
    ctx.fillStyle = "rgba(36, 33, 27, 0.24)";
    ctx.fillRect(x - 8, y + 12, 176, 104);

    ctx.fillStyle = "#dad0bc";
    ctx.fillRect(x, y + 34, 150, 84);
    ctx.fillStyle = "#74342f";
    ctx.beginPath();
    ctx.moveTo(x - 12, y + 42);
    ctx.lineTo(x + 75, y - 8);
    ctx.lineTo(x + 162, y + 42);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#40342d";
    ctx.fillRect(x + 56, y + 74, 38, 44);
    ctx.fillStyle = "rgba(255, 246, 185, 0.74)";
    ctx.fillRect(x + 18, y + 64, 24, 18);
    ctx.fillRect(x + 108, y + 64, 24, 18);

    ctx.fillStyle = "#fff0b8";
    ctx.strokeStyle = "#5b332c";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x + 28, y + 14, 94, 24, 4);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#4b3328";
    ctx.font = "800 10px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("LEGION-ish", x + 75, y + 27);

    drawCrate(legionHall.counterX - 8, legionHall.counterY + 6, "#8a573e");
  }

  function drawBlueRocket() {
    const x = screenX(blueRocket.x);
    const y = screenY(blueRocket.y);
    ctx.fillStyle = "rgba(34, 31, 27, 0.26)";
    ctx.beginPath();
    ctx.ellipse(x + 12, y + 36, 36, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#286aa5";
    ctx.strokeStyle = "#163f66";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x - 18, y - 24, 46, 72, 7);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#b8e1f2";
    ctx.fillRect(x - 8, y - 12, 26, 13);
    ctx.fillStyle = "#174164";
    ctx.font = "800 8px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("BLUE", x + 5, y + 14);
    ctx.fillText("ROCKET", x + 5, y + 25);
  }

  function drawFerryLookout() {
    const x = screenX(ferryLookout.x);
    const y = screenY(ferryLookout.y);
    ctx.fillStyle = "rgba(42, 34, 24, 0.22)";
    ctx.beginPath();
    ctx.ellipse(x + 22, y + 28, 62, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#b75c34";
    ctx.fillRect(x - 42, y + 18, 108, 10);
    ctx.fillStyle = "#6d4930";
    ctx.fillRect(x - 32, y + 24, 10, 28);
    ctx.fillRect(x + 48, y + 24, 10, 28);
    ctx.strokeStyle = "#65432e";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x - 18, y + 10);
    ctx.lineTo(x + 44, y - 22);
    ctx.stroke();
    ctx.fillStyle = "#fff0b8";
    ctx.strokeStyle = "#5b332c";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x - 30, y - 42, 104, 28, 4);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#4b3328";
    ctx.font = "800 9px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("SCENIC DITCH", x + 22, y - 28);
  }

  function drawTractorShed() {
    const x = screenX(tractorShed.x);
    const y = screenY(tractorShed.y);
    ctx.fillStyle = "rgba(36, 33, 27, 0.24)";
    ctx.fillRect(x + 8, y + 12, 120, 84);

    ctx.fillStyle = "#7f372e";
    ctx.fillRect(x, y + 28, 116, 76);
    ctx.fillStyle = "#4c2c25";
    ctx.beginPath();
    ctx.moveTo(x - 10, y + 34);
    ctx.lineTo(x + 58, y - 8);
    ctx.lineTo(x + 126, y + 34);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#2d362d";
    ctx.fillRect(x + 30, y + 60, 54, 44);

    ctx.fillStyle = "#5b8c3a";
    ctx.fillRect(x + 68, y + 80, 64, 24);
    ctx.fillStyle = "#1f241d";
    ctx.beginPath();
    ctx.arc(x + 82, y + 105, 10, 0, Math.PI * 2);
    ctx.arc(x + 122, y + 105, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#cfd47e";
    ctx.fillRect(x + 84, y + 68, 24, 18);
  }

  function drawWorldItems(now) {
    for (const item of worldItems) {
      if (item.carried || item.delivered) continue;
      const sx = screenX(item.x);
      const sy = screenY(item.y) + Math.sin(now / 210 + item.bobOffset) * 3;
      if (sx < -50 || sx > canvas.clientWidth + 50 || sy < -70 || sy > canvas.clientHeight + 70) continue;
      const type = itemTypes[item.type];

      ctx.save();
      ctx.fillStyle = "rgba(28, 35, 29, 0.22)";
      ctx.beginPath();
      ctx.ellipse(sx + 2, sy + 17, 20, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = type.color;
      ctx.strokeStyle = "#23414b";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(sx - 13, sy - 13, 26, 30, 5);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = type.accent;
      ctx.fillRect(sx - 8, sy - 7, 16, 10);
      ctx.fillStyle = "#25434a";
      ctx.font = "700 8px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(type.tag || type.shortName.slice(0, 3).toUpperCase(), sx, sy - 2);
      ctx.restore();
    }
  }

  function drawMissionMarkers(now) {
    const target = activeMissionTarget();
    if (!target) return;
    const tx = target.x;
    const ty = target.y;
    const pulse = 1 + Math.sin(now / 220) * 0.08;
    const sx = screenX(tx);
    const sy = screenY(ty);
    const visible = sx > 80 && sx < canvas.clientWidth - 80 && sy > 90 && sy < canvas.clientHeight - 90;

    if (!visible) {
      drawTargetArrow(tx, ty, target.label, now);
      return;
    }

    ctx.save();
    ctx.strokeStyle = activeMissionState().state === "pickup" ? "rgba(255, 236, 131, 0.85)" : "rgba(155, 235, 255, 0.85)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(sx, sy + 8, 40 * pulse, 20 * pulse, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "rgba(27, 38, 34, 0.78)";
    ctx.strokeStyle = "rgba(255, 249, 223, 0.72)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(sx - 58, sy - 62, 116, 26, 6);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#fff6bf";
    ctx.font = "700 11px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(target.label, sx, sy - 49);
    ctx.restore();
  }

  function drawTargetArrow(tx, ty, label, now) {
    const centerX = canvas.clientWidth / 2;
    const centerY = canvas.clientHeight / 2;
    const dx = screenX(tx) - centerX;
    const dy = screenY(ty) - centerY;
    const angle = Math.atan2(dy, dx);
    const radiusX = canvas.clientWidth / 2 - 58;
    const radiusY = canvas.clientHeight / 2 - 72;
    const sx = centerX + Math.cos(angle) * radiusX;
    const sy = centerY + Math.sin(angle) * radiusY;
    const bob = Math.sin(now / 180) * 4;

    ctx.save();
    ctx.translate(sx, sy + bob);
    ctx.rotate(angle);
    ctx.fillStyle = "rgba(255, 227, 140, 0.94)";
    ctx.strokeStyle = "rgba(26, 39, 33, 0.85)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(19, 0);
    ctx.lineTo(-10, -13);
    ctx.lineTo(-4, 0);
    ctx.lineTo(-10, 13);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.fillStyle = "rgba(27, 38, 34, 0.82)";
    ctx.strokeStyle = "rgba(255, 249, 223, 0.62)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(sx - 54, sy + bob + 22, 108, 24, 6);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#fff6bf";
    ctx.font = "700 10px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, sx, sy + bob + 34);
    ctx.restore();
  }

  function drawHouse(home) {
    const x = screenX(home.x);
    const y = screenY(home.y);
    const w = home.primary ? 112 : 92;
    const h = home.primary ? 86 : 68;

    ctx.fillStyle = "rgba(39, 38, 31, 0.22)";
    ctx.fillRect(x - 8, y + 8, w + 18, h + 14);

    ctx.fillStyle = home.wall;
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = "rgba(82, 62, 45, 0.28)";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    ctx.fillStyle = home.roof;
    ctx.beginPath();
    ctx.moveTo(x - 8, y + 18);
    ctx.lineTo(x + w / 2, y - 20);
    ctx.lineTo(x + w + 8, y + 18);
    ctx.lineTo(x + w, y + 42);
    ctx.lineTo(x, y + 42);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "rgba(255, 248, 196, 0.72)";
    ctx.fillRect(x + 18, y + 34, 18, 16);
    ctx.fillRect(x + w - 36, y + 34, 18, 16);
    ctx.fillStyle = "#4d3327";
    ctx.fillRect(x + w / 2 - 10, y + h - 26, 20, 26);

    if (home.primary) {
      ctx.fillStyle = "#594031";
      ctx.fillRect(x + w - 20, y - 26, 12, 25);
      ctx.fillStyle = "#2f433d";
      ctx.fillRect(x + w - 2, y + 58, 50, 32);
      ctx.fillStyle = "#7b8e84";
      ctx.fillRect(x + w + 8, y + 65, 30, 19);
      drawMailbox(home.x + 124, drivewayY - 12);
    }

    if (home.garage) {
      ctx.fillStyle = "#dfcfad";
      ctx.fillRect(x + w + 26, y + 32, 78, 58);
      ctx.fillStyle = "#6b3229";
      ctx.beginPath();
      ctx.moveTo(x + w + 18, y + 44);
      ctx.lineTo(x + w + 65, y + 18);
      ctx.lineTo(x + w + 108, y + 44);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#8a918b";
      ctx.fillRect(x + w + 42, y + 62, 38, 28);
    }

    if (home.shed) {
      ctx.fillStyle = "#876249";
      ctx.fillRect(x - 48, y + 40, 38, 32);
      ctx.fillStyle = "#543228";
      ctx.fillRect(x - 52, y + 32, 46, 16);
    }
  }

  function drawBike(wx, wy, heading, mounted, now) {
    const sx = screenX(wx);
    const sy = screenY(wy);
    const wobble = mounted ? Math.sin(now / 120) * clamp(Math.abs(bike.speed) / 250, 0, 1) : 0;
    const fallen = bike.fallen && !mounted;

    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(heading + wobble * 0.035);
    if (fallen) {
      ctx.rotate((bike.fallSide || 1) * 0.48);
      ctx.scale(1, 0.72);
    }

    ctx.fillStyle = "rgba(28, 28, 25, 0.3)";
    ctx.beginPath();
    ctx.ellipse(0, fallen ? 13 : 8, fallen ? 52 : 46, fallen ? 12 : 15, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#171a1e";
    ctx.beginPath();
    ctx.ellipse(-28, 0, 13, 6, 0, 0, Math.PI * 2);
    ctx.ellipse(30, 0, 13, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#c8d1d7";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-28, 0);
    ctx.lineTo(30, 0);
    ctx.moveTo(20, -12);
    ctx.lineTo(44, -18);
    ctx.moveTo(20, 12);
    ctx.lineTo(44, 18);
    ctx.stroke();

    ctx.fillStyle = "#123f6b";
    ctx.beginPath();
    ctx.roundRect(-24, -13, 46, 26, 7);
    ctx.fill();
    ctx.fillStyle = "#1d6f9f";
    ctx.beginPath();
    ctx.roundRect(-3, -17, 30, 34, 8);
    ctx.fill();

    if (mounted) {
      drawMountedRob(now);
    }

    ctx.restore();

    if (fallen) {
      ctx.save();
      ctx.strokeStyle = "rgba(255, 245, 185, 0.58)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(sx + 40 * bike.fallSide, sy - 16, 9, 0.2, 1.8);
      ctx.arc(sx + 54 * bike.fallSide, sy - 24, 7, 0.2, 1.8);
      ctx.stroke();
      ctx.restore();
    }
  }

  function drawMountedRob(now) {
    ctx.fillStyle = "#2c2f2c";
    ctx.beginPath();
    ctx.ellipse(-6, 0, 13, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#d7a173";
    ctx.beginPath();
    ctx.arc(-11, 0, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#e8e0cf";
    ctx.beginPath();
    ctx.arc(-15, -1, 6, 0, Math.PI * 2);
    ctx.arc(-7, -1, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(206, 236, 255, 0.74)";
    ctx.fillStyle = "rgba(202, 236, 255, 0.2)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(-8, 0, 29, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.58)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(-17, -9, 16, -0.7, 0.3);
    ctx.stroke();

    const flap = Math.sin(now / 160) * 2;
    drawParrot(-15, -19 + flap, "#2d9e4e", "#d63e30");
    drawParrot(-15, 19 - flap, "#b8b531", "#ede05b");
  }

  function drawParrot(x, y, body, head) {
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.ellipse(x, y, 5, 9, 0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = head;
    ctx.beginPath();
    ctx.arc(x + 4, y - 4, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#222";
    ctx.beginPath();
    ctx.arc(x + 5, y - 5, 1, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawRobSwimming(wx, wy, heading, now) {
    const sx = screenX(wx);
    const sy = screenY(wy);
    const phase = rob.walkTime;
    const stroke = Math.sin(phase);
    const splash = Math.abs(Math.cos(phase));
    const bob = Math.sin(now / 260) * 1.6;

    ctx.save();
    ctx.strokeStyle = "rgba(214, 247, 255, 0.58)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(sx - 2, sy + 8, 26 + splash * 5, 9 + splash * 2, 0, 0, Math.PI * 2);
    ctx.ellipse(sx - 18, sy + 9, 10 + splash * 4, 4, 0.2, 0, Math.PI * 2);
    ctx.ellipse(sx + 18, sy + 8, 9 + splash * 3, 4, -0.2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.translate(sx, sy + bob);
    applyRobFacingTransform(heading);

    ctx.strokeStyle = "#d7a173";
    ctx.lineCap = "round";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(-2, -7);
    ctx.lineTo(10 + stroke * 9, -18);
    ctx.moveTo(-2, 7);
    ctx.lineTo(10 - stroke * 9, 18);
    ctx.stroke();

    ctx.fillStyle = "rgba(24, 66, 82, 0.68)";
    ctx.beginPath();
    ctx.ellipse(-7, 0, 18, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#d7a173";
    ctx.beginPath();
    ctx.arc(8, 0, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#e7dfd3";
    ctx.beginPath();
    ctx.arc(11, 0, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.44)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, -1, 19 + splash * 2, -0.8, 0.8);
    ctx.stroke();
    ctx.restore();
  }

  function drawRobOnFoot(wx, wy, heading, now) {
    const sx = screenX(wx);
    const sy = screenY(wy);
    const phase = rob.walkTime;
    const walking = rob.isWalking;
    const stride = walking ? Math.sin(phase) : 0;
    const counterStride = walking ? Math.sin(phase + Math.PI) : 0;
    const armSwing = walking ? Math.sin(phase + Math.PI) : 0;
    const bob = walking ? Math.abs(Math.sin(phase)) * 2.2 : Math.sin(now / 520) * 0.5;

    ctx.save();
    ctx.translate(sx, sy - bob);
    applyRobFacingTransform(heading);
    ctx.fillStyle = "rgba(30, 35, 28, 0.24)";
    ctx.beginPath();
    ctx.ellipse(0, 10 + bob, 16, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.lineCap = "round";
    ctx.strokeStyle = "#1f211f";
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.moveTo(-4, -5);
    ctx.lineTo(5 + armSwing * 4, -14);
    ctx.moveTo(-4, 5);
    ctx.lineTo(5 - armSwing * 4, 14);
    ctx.stroke();

    ctx.strokeStyle = "#20211f";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(-5, -4);
    ctx.lineTo(-15 + stride * 8, -8);
    ctx.moveTo(-5, 4);
    ctx.lineTo(-15 + counterStride * 8, 8);
    ctx.stroke();

    ctx.fillStyle = "#111312";
    ctx.beginPath();
    ctx.ellipse(-16 + stride * 8, -8, 4, 3, 0, 0, Math.PI * 2);
    ctx.ellipse(-16 + counterStride * 8, 8, 4, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#26322f";
    ctx.beginPath();
    ctx.ellipse(0, 0, 8.5, 12.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#4d4f45";
    ctx.beginPath();
    ctx.ellipse(6, 0, 3, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#d7a173";
    ctx.beginPath();
    ctx.arc(10, 0, 7.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#e7dfd3";
    ctx.beginPath();
    ctx.arc(13, 0, 4.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function applyRobFacingTransform(heading) {
    const safeHeading = Number.isFinite(heading) ? heading : -Math.PI / 2;
    const normalized = normalizeAngle(safeHeading);
    const dueWest = Math.abs(Math.abs(normalized) - Math.PI) < 0.001;
    if (dueWest) {
      ctx.scale(-1, 1);
      return;
    }
    ctx.rotate(normalized);
  }

  function drawPrompt(wx, wy, label, now) {
    const sx = screenX(wx);
    const sy = screenY(wy) + Math.sin(now / 180) * 3;
    ctx.save();
    ctx.fillStyle = "rgba(29, 38, 33, 0.84)";
    ctx.strokeStyle = "rgba(255, 249, 223, 0.8)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(sx, sy, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#fff4b8";
    ctx.font = "700 15px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, sx, sy);
    ctx.restore();
  }

  function drawBarn(wx, wy) {
    const sx = screenX(wx);
    const sy = screenY(wy);
    ctx.fillStyle = "rgba(44, 40, 30, 0.24)";
    ctx.fillRect(sx + 8, sy + 10, 80, 68);
    ctx.fillStyle = "#9f352d";
    ctx.fillRect(sx, sy + 28, 82, 58);
    ctx.fillStyle = "#672820";
    ctx.beginPath();
    ctx.moveTo(sx - 8, sy + 34);
    ctx.lineTo(sx + 41, sy);
    ctx.lineTo(sx + 90, sy + 34);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#f2e1bd";
    ctx.fillRect(sx + 31, sy + 52, 20, 34);
  }

  function drawSilo(wx, wy) {
    const sx = screenX(wx);
    const sy = screenY(wy);
    ctx.fillStyle = "rgba(44, 40, 30, 0.2)";
    ctx.beginPath();
    ctx.ellipse(sx + 16, sy + 44, 26, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ccd2ca";
    ctx.fillRect(sx, sy + 8, 34, 70);
    ctx.beginPath();
    ctx.arc(sx + 17, sy + 8, 17, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#8d9890";
    ctx.strokeRect(sx, sy + 8, 34, 70);
  }

  function drawMailbox(wx, wy) {
    const sx = screenX(wx);
    const sy = screenY(wy);
    ctx.strokeStyle = "#4d3f34";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(sx, sy + 18);
    ctx.lineTo(sx, sy + 44);
    ctx.stroke();
    ctx.fillStyle = "#2f5963";
    ctx.beginPath();
    ctx.roundRect(sx - 14, sy, 28, 18, 4);
    ctx.fill();
    ctx.fillStyle = "#fff3cd";
    ctx.font = "700 8px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("ROB", sx, sy + 10);
  }

  function drawCrate(wx, wy, fill) {
    const sx = screenX(wx);
    const sy = screenY(wy);
    ctx.fillStyle = "rgba(36, 33, 27, 0.24)";
    ctx.fillRect(sx + 3, sy + 5, 40, 26);
    ctx.fillStyle = fill;
    ctx.fillRect(sx, sy, 38, 26);
    ctx.strokeStyle = "rgba(54, 39, 24, 0.64)";
    ctx.lineWidth = 2;
    ctx.strokeRect(sx, sy, 38, 26);
    ctx.beginPath();
    ctx.moveTo(sx + 3, sy + 4);
    ctx.lineTo(sx + 35, sy + 22);
    ctx.moveTo(sx + 35, sy + 4);
    ctx.lineTo(sx + 3, sy + 22);
    ctx.stroke();
  }

  function drawFence(x, minY, maxY) {
    ctx.save();
    ctx.strokeStyle = "rgba(99, 66, 38, 0.72)";
    ctx.lineWidth = 3;
    for (let y = minY; y < maxY; y += 52) {
      const sx = screenX(x);
      const sy = screenY(y);
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx, sy + 28);
      ctx.moveTo(sx - 15, sy + 9);
      ctx.lineTo(sx + 15, sy + 9);
      ctx.moveTo(sx - 15, sy + 21);
      ctx.lineTo(sx + 15, sy + 21);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawPothole(wx, wy, r) {
    const sx = screenX(wx);
    const sy = screenY(wy);
    if (sx < -40 || sx > canvas.clientWidth + 40 || sy < -40 || sy > canvas.clientHeight + 40) return;
    ctx.fillStyle = "rgba(39, 36, 32, 0.34)";
    ctx.beginPath();
    ctx.ellipse(sx, sy, r * 1.45, r, 0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawRoadHazard(hazard) {
    const sx = screenX(hazard.x);
    const sy = screenY(hazard.y);
    if (sx < -70 || sx > canvas.clientWidth + 70 || sy < -70 || sy > canvas.clientHeight + 70) return;
    ctx.fillStyle = "rgba(27, 24, 22, 0.54)";
    ctx.beginPath();
    ctx.ellipse(sx, sy, hazard.r * 1.55, hazard.r, -0.18, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 223, 128, 0.46)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(sx, sy, hazard.r * 1.75, hazard.r * 1.18, -0.18, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "rgba(255, 244, 184, 0.64)";
    ctx.font = "900 11px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("!", sx, sy - hazard.r - 8);
  }

  function drawStrip(x, y, w, h, fill) {
    ctx.fillStyle = fill;
    ctx.fillRect(screenX(x), screenY(y), w, h);
  }

  function drawRedDirtPath(x1, y1, x2, y2, width) {
    ctx.save();
    ctx.strokeStyle = "#b85b32";
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(screenX(x1), screenY(y1));
    const midX = (x1 + x2) / 2;
    ctx.bezierCurveTo(screenX(midX), screenY(y1), screenX(midX), screenY(y2), screenX(x2), screenY(y2));
    ctx.stroke();
    ctx.strokeStyle = "rgba(255, 212, 150, 0.2)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  function surfaceAt(x, y) {
    const roadLeft = world.roadX - world.roadWidth / 2;
    const roadRight = world.roadX + world.roadWidth / 2;
    if (x > roadLeft && x < roadRight) return "road";
    if (Math.abs(y - drivewayY) < 42 && x > -285 && x < roadLeft + 24) return "driveway";
    if (Math.abs(y - (hardwareStore.y + 92)) < 44 && x > hardwareStore.x + 60 && x < roadLeft + 24) return "driveway";
    if (Math.abs(y - (yardSale.y + 84)) < 44 && x > yardSale.x + 70 && x < roadLeft + 24) return "driveway";
    if (Math.abs(y - (baitShack.y + 92)) < 44 && x > baitShack.x + 72 && x < roadLeft + 24) return "driveway";
    if (Math.abs(y - (legionHall.y + 92)) < 46 && x > legionHall.x + 76 && x < roadLeft + 24) return "driveway";
    if (Math.abs(y - tractorShed.y) < 44 && x > roadRight - 24 && x < tractorShed.x + 24) return "driveway";
    if (Math.abs(y - blueRocket.y) < 42 && x > roadRight - 24 && x < blueRocket.x + 30) return "driveway";
    if (Math.abs(y - ferryLookout.y) < 42 && x > roadRight - 24 && x < ferryLookout.x + 36) return "driveway";
    if (isInRiver({ x, y })) return "river";
    if (x < roadLeft) return "yard";
    return "farm";
  }

  function placeName(x, y) {
    if (distance({ x, y }, garageDrop) < garageDrop.r) return "Rob's garage";
    if (!isSouthRoadUnlocked() && Math.abs(y - southGate.y) < 130) return southGate.name;
    if (distance({ x, y }, { x: hardwareStore.x + 66, y: hardwareStore.y + 64 }) < 145) return hardwareStore.name;
    if (distance({ x, y }, { x: yardSale.x + 68, y: yardSale.y + 64 }) < 150) return yardSale.name;
    if (distance({ x, y }, tractorShed) < 155) return tractorShed.name;
    if (distance({ x, y }, { x: baitShack.x + 70, y: baitShack.y + 66 }) < 155) return baitShack.name;
    if (distance({ x, y }, { x: legionHall.x + 76, y: legionHall.y + 70 }) < 170) return legionHall.name;
    if (distance({ x, y }, blueRocket) < 130) return blueRocket.name;
    if (distance({ x, y }, ferryLookout) < 145) return ferryLookout.name;
    if (distance({ x, y }, homeDoor) < 140) return "Rob's place";
    if (surfaceAt(x, y) === "river") return "River";
    if (surfaceAt(x, y) === "road") return y < 0 ? "North road" : "South road";
    if (x < world.riverRight + 68) return "River bank";
    if (x < -world.roadWidth / 2) return "House side";
    return "Farm side";
  }

  function isInRiver(point) {
    return point.x < world.riverRight;
  }

  function constrainPoint(point, radius, options = {}) {
    point.x = clamp(point.x, world.minX + radius, world.maxX - radius);
    point.y = clamp(point.y, world.minY + radius, world.maxY - radius);
    if (!options.allowRiver && point.x < world.riverRight + world.riverBankWidth) point.x = world.riverRight + world.riverBankWidth;
  }

  function createWorldItem(type, x, y, origin, missionId = null) {
    return {
      id: `${type}-${Math.round(x)}-${Math.round(y)}-${origin}`,
      type,
      x,
      y,
      origin,
      missionId,
      carried: false,
      delivered: false,
      bobOffset: (Math.abs(x * 31 + y * 17) % 628) / 100,
    };
  }

  function screenX(x) {
    return Math.round(x - camera.x + canvas.clientWidth / 2);
  }

  function screenY(y) {
    return Math.round(y - camera.y + canvas.clientHeight / 2);
  }

  function distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function signNonZero(value) {
    return value < 0 ? -1 : 1;
  }

  function normalizeAngle(angle) {
    return Math.atan2(Math.sin(angle), Math.cos(angle));
  }

  function say(text, seconds) {
    toast.textContent = text;
    toast.hidden = false;
    toastUntil = performance.now() + seconds * 1000;
  }

  function makeLaneMarks() {
    const marks = [];
    for (let y = world.minY + 280; y < world.maxY; y += 460) {
      marks.push({ x: -38 + ((y / 460) % 2) * 76, y: y + 80, r: 8 + Math.abs(Math.sin(y)) * 4 });
    }
    return marks;
  }

  function makeTrees() {
    const seeded = mulberry32(481516);
    const list = [];
    const addTree = (x, y, r) => {
      list.push({
        x,
        y,
        r,
        fill: seeded() > 0.42 ? "#2f7d3f" : "#3f8f44",
        trunk: "#6d4930",
      });
    };

    for (let y = world.minY + 80; y < world.maxY; y += 120) {
      addTree(-520 + seeded() * 36, y + seeded() * 80, 14 + seeded() * 10);
      if (seeded() > 0.35) addTree(-188 - seeded() * 58, y + seeded() * 96, 12 + seeded() * 9);
      if (seeded() > 0.55) addTree(92 + seeded() * 70, y + seeded() * 100, 11 + seeded() * 8);
    }
    return list;
  }

  function mulberry32(seed) {
    return function rand() {
      let t = seed += 0x6d2b79f5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
})();
