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

  const world = {
    minX: -760,
    maxX: 760,
    minY: -2450,
    maxY: 2450,
    roadX: 0,
    roadWidth: 156,
    roadShoulder: 36,
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
      color: "#9ee8ff",
      accent: "#fff7a8",
      useText: "Rob buffs one perfect little circle. The parrots can now see every bug that died for this commute.",
      dropText: "Rob sets down the dome polish like it is evidence.",
    },
    modelKit: {
      id: "modelKit",
      name: "Damp Model Kit",
      shortName: "Model Kit",
      color: "#f5d36e",
      accent: "#315f8f",
      useText: "Rob sniffs the box. It smells like basement, glue, and a custody dispute over hobby supplies.",
      dropText: "Rob gently sets down the model kit. Somewhere, a tiny unbuilt battleship feels abandoned.",
    },
    apologyCigars: {
      id: "apologyCigars",
      name: "Apology Cigars",
      shortName: "Cigars",
      color: "#8b5738",
      accent: "#ffd18a",
      useText: "Rob opens the box and calls it aromatherapy for men avoiding accountability.",
      dropText: "Rob drops the apology cigars. That is either generosity or evidence tampering.",
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
  };

  const missionStates = {
    domePolishRun: { state: "pickup", unlocked: true, complete: false },
    modelKitSnatch: { state: "locked", unlocked: false, complete: false },
    apologyCigars: { state: "locked", unlocked: false, complete: false },
  };

  let activeMissionId = "domePolishRun";

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
  ];

  const combines = [
    { x: 230, y: -1610, minX: 205, maxX: 555, baseSpeed: 34, speed: 34, dir: 1, alertUntil: 0, color: "#d5a43c", accent: "#6b4427" },
    { x: 245, y: 920, minX: 215, maxX: 565, baseSpeed: 27, speed: 27, dir: -1, alertUntil: 0, color: "#b7bd46", accent: "#4c5d2f" },
  ];

  const trees = makeTrees();
  const laneMarks = makeLaneMarks();
  let gameStarted = false;
  let introReady = false;
  let introSkipClicks = 0;
  let introLastSkipClickAt = 0;
  let introUnlockTimer = 0;
  let introSkipResetTimer = 0;
  let lastTime = performance.now();
  let toastUntil = 0;

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
    requestAnimationFrame(loop);
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
          rob.mode = "home";
          rob.x = homeDoor.x;
          rob.y = homeDoor.y;
          say("Rob goes back inside. Probably forgot something suspiciously specific.", 3);
        }
      }
    } else {
      updateBike(dt);
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
    if (relatedMission) {
      const state = missionStates[relatedMission.id];
      if (state.unlocked && state.state === "pickup") {
        state.state = "return";
      }
    }

    say(relatedMission ? relatedMission.pickupText : `Picked up ${itemTypes[item.type].name}.`, 3.5);

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
    if (!def || !state || state.complete || state.state !== "return") return false;
    if (distance(actor, def.drop) > def.drop.r || !hasItem(def.item)) return false;

    removeItemFromInventory(def.item);
    state.state = "complete";
    state.complete = true;
    playMissionCompleteSound();
    unlockMissions(def.unlocks);
    renderMissionBrowser();
    if (def.unlocks.length) {
      window.setTimeout(openMissionBrowser, 900);
    }
    say(def.completeText, 5);
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
    if (active && type === active.item && distance(actor, active.drop) <= active.drop.r) {
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

  function missionForItem(type) {
    return Object.values(missionDefs).find((def) => def.item === type) || null;
  }

  function activeMissionTarget() {
    const def = activeMissionDef();
    const state = activeMissionState();
    if (!def || !state || !state.unlocked || state.complete) return null;
    if (state.state === "return" && !hasItem(def.item)) {
      const looseItem = worldItems.find((item) => item.type === def.item && !item.carried && !item.delivered);
      if (looseItem) return { x: looseItem.x, y: looseItem.y, r: 74, label: itemTypes[def.item].shortName, place: "Wherever Rob left it" };
    }
    if (state.state === "return") return def.drop;
    return def.pickup;
  }

  function canDeliverActiveMission(actor) {
    const def = activeMissionDef();
    const state = activeMissionState();
    return Boolean(def && state && state.state === "return" && hasItem(def.item) && distance(actor, def.drop) <= def.drop.r);
  }

  function unlockMissions(ids) {
    for (const id of ids) {
      const state = missionStates[id];
      const def = missionDefs[id];
      if (!state || !def || state.unlocked) continue;
      state.unlocked = true;
      state.state = "pickup";
      ensureMissionItem(id);
    }
  }

  function ensureMissionItem(missionId) {
    const def = missionDefs[missionId];
    const state = missionStates[missionId];
    if (!def || !state) return;
    const alreadyInWorld = worldItems.some((item) => item.type === def.item && !item.delivered);
    if (alreadyInWorld || hasItem(def.item) || state.complete) return;
    worldItems.push(createWorldItem(def.item, def.pickup.x, def.pickup.y, "mission", missionId));
  }

  function missionStatusText() {
    const def = activeMissionDef();
    const state = activeMissionState();
    if (!def || !state) return "No mission";
    if (state.complete) return `${def.title}: done`;
    return def.title;
  }

  function missionGuideText() {
    const def = activeMissionDef();
    const state = activeMissionState();
    if (!def || !state || !state.unlocked) return "Press M to pick an available errand.";
    if (state.complete) return def.completeGuide;
    if (state.state === "return" && !hasItem(def.item)) return `Pick ${itemTypes[def.item].shortName} back up. Rob cannot deliver a memory.`;
    if (state.state === "return") return def.returnGuide;
    return def.pickupGuide;
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
      if (canDeliverActiveMission(actor)) return "Drop-off is right here.";

      const item = nearestWorldItem(actor, 74);
      if (item) return `Pickup nearby: ${itemTypes[item.type].name}.`;

      const npc = nearestNpc(actor, 70);
      if (npc) return `Nearby: talk to ${npc.name}; they look under-caffeinated and over-informed.`;

      const discovery = nearestDiscovery(actor, 66);
      if (discovery) return discovery.seen ? `Nearby: re-inspect ${discovery.label}.` : `Nearby: inspect ${discovery.label}.`;

      if (bike.fallen && distance(rob, bike) < 92) return "The Suzuki is lying down like a tired vending machine. Press E to stand it back up.";
      if (distance(rob, bike) < 72) return "The cruiser is within climbing distance.";
      if (distance(rob, homeDoor) < 64) return "The front door is close if Rob needs to retreat from consequences.";
    }

    if (rob.mode === "bike" && Math.abs(bike.speed) < 34) {
      if (canDeliverActiveMission(actor)) return "The drop-off is close enough for Rob to make it official.";
      const item = nearestWorldItem(actor, 74);
      if (item) return `Cargo is close: ${itemTypes[item.type].name}.`;
    }

    return "";
  }

  function missionCardStatus(missionId) {
    const state = missionStates[missionId];
    if (!state.unlocked) return "Locked until Rob proves he can finish one stupid thing";
    if (state.complete) return "Complete";
    if (missionId === activeMissionId) return "Active";
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
      const driftX = Math.sin(now / 1700 + npc.phase) * npc.radiusX;
      const driftY = Math.cos(now / 2100 + npc.phase * 1.7) * npc.radiusY;
      npc.x += (npc.baseX + driftX - npc.x) * Math.min(1, dt * 1.8);
      npc.y += (npc.baseY + driftY - npc.y) * Math.min(1, dt * 1.8);
    }

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
    constrainPoint(rob, 12);
  }

  function checkBikeImpact(now) {
    if (rob.mode !== "bike" || bike.fallen) return;

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
    constrainPoint(rob, 12);
    playCrashSound();
    say(`${text} Press E beside the bike to stand it back up.`, 4.2);
  }

  function isVehicleCollision(a, b, width, height) {
    return Math.abs(a.x - b.x) < width && Math.abs(a.y - b.y) < height;
  }

  function updateOnFoot(dt, now) {
    if (rob.panicUntil > now) {
      const speed = rob.footSpeed * 1.95;
      rob.x += rob.panicVectorX * speed * dt;
      rob.y += rob.panicVectorY * speed * dt;
      rob.heading = Math.atan2(rob.panicVectorY, rob.panicVectorX);
      rob.isWalking = true;
      rob.walkTime += dt * 17;
      constrainPoint(rob, 12);
      return;
    }

    const xAxis = Number(input.right) - Number(input.left);
    const yAxis = Number(input.down) - Number(input.up);
    const mag = Math.hypot(xAxis, yAxis);
    rob.isWalking = mag > 0;
    if (mag > 0) {
      const speed = rob.footSpeed * (input.run ? 1.35 : 1);
      rob.x += (xAxis / mag) * speed * dt;
      rob.y += (yAxis / mag) * speed * dt;
      rob.heading = Math.atan2(yAxis, xAxis);
      rob.walkTime += dt * (input.run ? 13 : 10);
    } else {
      rob.walkTime += (0 - rob.walkTime) * Math.min(1, dt * 3);
    }
    constrainPoint(rob, 12);
  }

  function updateBike(dt) {
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

    if (bike.x < -560) {
      bike.x = -560;
      bike.speed *= -0.15;
      say("The river bank votes no.", 1.7);
    }

    checkBikeImpact(performance.now());
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
      modeLabel.textContent = bike.fallen && distance(rob, bike) < 84 ? "Bike down" : distance(rob, bike) < 56 ? "By the bike" : "On foot";
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
    drawDriveways();
    drawRoadVehicles(now);
    drawHardwareStore();
    drawYardSale();
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
    const x = screenX(-700);
    const y = screenY(world.minY);
    const h = world.maxY - world.minY;
    const river = ctx.createLinearGradient(x, 0, x + 250, 0);
    river.addColorStop(0, "#3f8fc7");
    river.addColorStop(1, "#76c2d7");
    ctx.fillStyle = river;
    ctx.fillRect(x, y, 240, h);

    ctx.save();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.42)";
    ctx.lineWidth = 2;
    for (let wy = world.minY; wy < world.maxY; wy += 190) {
      ctx.beginPath();
      for (let i = 0; i <= 8; i += 1) {
        const wx = -680 + i * 26;
        const sy = screenY(wy + Math.sin(i * 0.8) * 10);
        const sx = screenX(wx);
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.stroke();
    }
    ctx.restore();

    drawStrip(-495, world.minY, 18, h, "#b55b32");
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
  }

  function drawDriveways() {
    for (const home of homes) {
      const y = home.primary ? drivewayY : home.y + 62;
      drawRedDirtPath(home.x + 54, y, -world.roadWidth / 2 - 10, y, home.primary ? 32 : 24);
    }
    drawRedDirtPath(hardwareStore.x + 96, hardwareStore.y + 92, -world.roadWidth / 2 - 8, hardwareStore.y + 92, 28);
    drawRedDirtPath(yardSale.x + 128, yardSale.y + 84, -world.roadWidth / 2 - 8, yardSale.y + 84, 26);
    drawRedDirtPath(world.roadWidth / 2 + 10, tractorShed.y, tractorShed.x - 40, tractorShed.y, 28);
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
    const stride = Math.sin(now / 250 + npc.phase) * 2.6;

    ctx.save();
    ctx.fillStyle = "rgba(30, 35, 28, 0.23)";
    ctx.beginPath();
    ctx.ellipse(sx + 2, sy + 17, 16, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#22251f";
    ctx.lineCap = "round";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(sx - 4, sy + 8);
    ctx.lineTo(sx - 8 + stride, sy + 18);
    ctx.moveTo(sx + 4, sy + 8);
    ctx.lineTo(sx + 8 - stride, sy + 18);
    ctx.stroke();

    ctx.fillStyle = npc.color;
    ctx.beginPath();
    ctx.roundRect(sx - 9, sy - 7, 18, 20, 5);
    ctx.fill();
    ctx.fillStyle = npc.accent;
    ctx.fillRect(sx - 7, sy - 4, 14, 4);
    ctx.fillStyle = npc.skin;
    ctx.beginPath();
    ctx.arc(sx, sy - 16, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = npc.hat;
    ctx.beginPath();
    ctx.ellipse(sx, sy - 23, 11, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(sx - 7, sy - 28, 14, 7);
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
      drawRobOnFoot(rob.x, rob.y, rob.heading, now);
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
      const target = activeMissionDef().drop;
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
      ctx.fillText(item.type === "domePolish" ? "BUG" : item.type === "modelKit" ? "KIT" : "OWE", sx, sy - 2);
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
    if (Math.abs(y - tractorShed.y) < 44 && x > roadRight - 24 && x < tractorShed.x + 24) return "driveway";
    if (x < -560) return "river";
    if (x < roadLeft) return "yard";
    return "farm";
  }

  function placeName(x, y) {
    if (distance({ x, y }, garageDrop) < garageDrop.r) return "Rob's garage";
    if (distance({ x, y }, { x: hardwareStore.x + 66, y: hardwareStore.y + 64 }) < 145) return hardwareStore.name;
    if (distance({ x, y }, { x: yardSale.x + 68, y: yardSale.y + 64 }) < 150) return yardSale.name;
    if (distance({ x, y }, tractorShed) < 155) return tractorShed.name;
    if (distance({ x, y }, homeDoor) < 140) return "Rob's place";
    if (surfaceAt(x, y) === "road") return y < 0 ? "North road" : "South road";
    if (x < -500) return "River bank";
    if (x < -world.roadWidth / 2) return "House side";
    return "Farm side";
  }

  function constrainPoint(point, radius) {
    point.x = clamp(point.x, world.minX + radius, world.maxX - radius);
    point.y = clamp(point.y, world.minY + radius, world.maxY - radius);
    if (point.x < -585) point.x = -585;
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
