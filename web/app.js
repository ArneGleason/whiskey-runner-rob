(() => {
  const canvas = document.querySelector("#game");
  const ctx = canvas.getContext("2d");

  const modeLabel = document.querySelector("#modeLabel");
  const speedLabel = document.querySelector("#speedLabel");
  const placeLabel = document.querySelector("#placeLabel");
  const missionLabel = document.querySelector("#missionLabel");
  const inventoryLabel = document.querySelector("#inventoryLabel");
  const toast = document.querySelector("#toast");

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
  };

  const rob = {
    mode: "home",
    x: homeDoor.x,
    y: homeDoor.y,
    heading: -Math.PI / 2,
    footSpeed: 148,
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

  const garageDrop = {
    x: -150,
    y: 112,
    r: 72,
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
  };

  const inventory = {
    capacity: 3,
    slots: [],
    selected: 0,
  };

  const mission = {
    id: "domePolishRun",
    title: "Dome Polish Run",
    state: "pickup",
    complete: false,
  };

  const worldItems = [
    createWorldItem("domePolish", hardwareStore.counterX, hardwareStore.counterY, "hardware"),
  ];

  const trees = makeTrees();
  const laneMarks = makeLaneMarks();
  let lastTime = performance.now();
  let toastUntil = 0;

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
    if (key.startsWith("slot")) {
      if (!event.repeat) input.selectedQueued = Number(key.slice(4));
      return;
    }
    input[key] = true;
  });

  window.addEventListener("keyup", (event) => {
    const key = normalizeKey(event);
    if (!key || key === "action" || key === "drop" || key === "use" || key.startsWith("slot")) return;
    event.preventDefault();
    input[key] = false;
  });

  resize();
  say("Mission: fetch acrylic dome polish before the parrots start naming individual bug splats.", 4.2);
  requestAnimationFrame(loop);

  function loop(now) {
    const dt = Math.min(0.033, (now - lastTime) / 1000);
    lastTime = now;
    update(dt, now);
    draw(now);
    requestAnimationFrame(loop);
  }

  function update(dt, now) {
    handleInventoryShortcuts();

    if (rob.mode === "home") {
      bike.speed *= 0.9;
      if (input.actionQueued) {
        rob.mode = "foot";
        rob.x = homeDoor.x;
        rob.y = homeDoor.y + 28;
        say("Rob steps out. The parrots are already judging the dome polish.", 3.5);
      }
    } else if (rob.mode === "foot") {
      updateOnFoot(dt);
      if (input.actionQueued) {
        const interacted = handleInteractionAction();
        if (!interacted && distance(rob, bike) < 56) {
          rob.mode = "bike";
          bike.speed = 0;
          bike.heading = -Math.PI / 2;
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
      if (input.actionQueued) {
        if (Math.abs(bike.speed) < 34 && handleInteractionAction()) {
          bike.speed = 0;
        } else if (Math.abs(bike.speed) < 24) {
          rob.mode = "foot";
          rob.x = bike.x - Math.cos(bike.heading + Math.PI / 2) * 30;
          rob.y = bike.y - Math.sin(bike.heading + Math.PI / 2) * 30;
          rob.heading = bike.heading;
          bike.speed = 0;
          say("Rob dismounts with retirement-grade confidence.", 2.8);
        } else {
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
    if (tryDeliverDomePolish(actor)) return true;
    if (tryPickupNearbyItem(actor)) return true;
    return false;
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
    say(`Picked up ${itemTypes[item.type].name}. The clerk says it is 'probably safe on acrylic.'`, 3.5);

    if (item.type === "domePolish" && mission.state === "pickup") {
      mission.state = "return";
    }

    return true;
  }

  function tryDeliverDomePolish(actor) {
    if (mission.complete || !isNearGarage(actor) || !hasItem("domePolish")) return false;
    removeItemFromInventory("domePolish");
    mission.state = "complete";
    mission.complete = true;
    say("Mission complete: Rob drops off the polish. Two parrots admire a bug-free future and immediately smudge the dome.", 5);
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
    if (type === "domePolish" && isNearGarage(actor)) {
      tryDeliverDomePolish(actor);
      return;
    }

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

  function isNearGarage(actor) {
    return distance(actor, garageDrop) < garageDrop.r;
  }

  function missionStatusText() {
    if (mission.state === "pickup") return "Get dome polish";
    if (mission.state === "return") return "Bring it to garage";
    return "Dome de-bugged";
  }

  function inventoryText() {
    if (!inventory.slots.length) return "Empty";
    return inventory.slots
      .map((type, index) => `${index === inventory.selected ? ">" : ""}${itemTypes[type].shortName}`)
      .join(" / ");
  }

  function updateOnFoot(dt) {
    const xAxis = Number(input.right) - Number(input.left);
    const yAxis = Number(input.down) - Number(input.up);
    const mag = Math.hypot(xAxis, yAxis);
    if (mag > 0) {
      const speed = rob.footSpeed * (input.run ? 1.35 : 1);
      rob.x += (xAxis / mag) * speed * dt;
      rob.y += (yAxis / mag) * speed * dt;
      rob.heading = Math.atan2(yAxis, xAxis);
    }
    constrainPoint(rob, 12);
  }

  function updateBike(dt) {
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
      speedLabel.textContent = "0";
      placeLabel.textContent = "Rob's house";
    } else if (rob.mode === "foot") {
      modeLabel.textContent = distance(rob, bike) < 56 ? "By the bike" : "On foot";
      speedLabel.textContent = "0";
      placeLabel.textContent = placeName(rob.x, rob.y);
    } else {
      modeLabel.textContent = surfaceAt(bike.x, bike.y) === "road" ? "Riding" : "Off road";
      speedLabel.textContent = `${Math.round(Math.abs(bike.speed))}`;
      placeLabel.textContent = placeName(bike.x, bike.y);
    }

    missionLabel.textContent = missionStatusText();
    inventoryLabel.textContent = inventoryText();

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
    drawHardwareStore();
    drawHouses();
    drawTrees();
    drawFarmDetails();
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
    const nearbyItem = nearestWorldItem(actor, 74);
    if (nearbyItem && (rob.mode !== "bike" || Math.abs(bike.speed) < 34)) {
      drawPrompt(nearbyItem.x, nearbyItem.y - 42, "E", now);
      return;
    }

    if (!mission.complete && hasItem("domePolish") && isNearGarage(actor) && (rob.mode !== "bike" || Math.abs(bike.speed) < 34)) {
      drawPrompt(garageDrop.x, garageDrop.y - 50, "E", now);
      return;
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
      ctx.fillText("BUG", sx, sy - 2);
      ctx.restore();
    }
  }

  function drawMissionMarkers(now) {
    if (mission.complete) return;
    const tx = mission.state === "pickup" ? hardwareStore.counterX : garageDrop.x;
    const ty = mission.state === "pickup" ? hardwareStore.counterY : garageDrop.y;
    const pulse = 1 + Math.sin(now / 220) * 0.08;
    const sx = screenX(tx);
    const sy = screenY(ty);

    ctx.save();
    ctx.strokeStyle = mission.state === "pickup" ? "rgba(255, 236, 131, 0.85)" : "rgba(155, 235, 255, 0.85)";
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
    ctx.fillText(mission.state === "pickup" ? "Dome polish" : "Rob's garage", sx, sy - 49);
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

    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(heading + wobble * 0.035);

    ctx.fillStyle = "rgba(28, 28, 25, 0.3)";
    ctx.beginPath();
    ctx.ellipse(0, 8, 46, 15, 0, 0, Math.PI * 2);
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
    const stride = Math.sin(now / 130) * (input.up || input.down || input.left || input.right ? 3 : 0);

    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(heading || -Math.PI / 2);
    ctx.fillStyle = "rgba(30, 35, 28, 0.24)";
    ctx.beginPath();
    ctx.ellipse(0, 8, 15, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#232421";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(-2, -1);
    ctx.lineTo(-12, 8 + stride);
    ctx.moveTo(2, 1);
    ctx.lineTo(12, 8 - stride);
    ctx.stroke();

    ctx.fillStyle = "#26322f";
    ctx.beginPath();
    ctx.ellipse(0, 0, 8, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#d7a173";
    ctx.beginPath();
    ctx.arc(10, 0, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#e7dfd3";
    ctx.beginPath();
    ctx.arc(13, 0, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
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
    if (x < -560) return "river";
    if (x < roadLeft) return "yard";
    return "farm";
  }

  function placeName(x, y) {
    if (distance({ x, y }, garageDrop) < garageDrop.r) return "Rob's garage";
    if (distance({ x, y }, { x: hardwareStore.x + 66, y: hardwareStore.y + 64 }) < 145) return hardwareStore.name;
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

  function createWorldItem(type, x, y, origin) {
    return {
      id: `${type}-${Math.round(x)}-${Math.round(y)}-${origin}`,
      type,
      x,
      y,
      origin,
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
