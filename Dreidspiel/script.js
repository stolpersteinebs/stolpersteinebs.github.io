diff --git a/dreidspiel/script.js b/dreidspiel/script.js
index 8bc269bd94270996805fe20c7b79a109a177e329..2cf6903fa4a55564bb23d1c2bab85fc2aebda362 100644
--- a/dreidspiel/script.js
+++ b/dreidspiel/script.js
@@ -114,67 +114,81 @@ const questionModalEl = document.getElementById("questionModal");
 const startButton = document.getElementById("startButton");
 const restartButton = document.getElementById("restartButton");
 const laterButton = document.getElementById("laterButton");
 
 const startHighscoreEl = document.getElementById("startHighscore");
 const timeLeftEl = document.getElementById("timeLeft");
 const scoreEl = document.getElementById("score");
 const streakEl = document.getElementById("streak");
 const solvedEl = document.getElementById("solved");
 const totalEl = document.getElementById("total");
 const highscoreEl = document.getElementById("highscore");
 
 const nearbyPromptEl = document.getElementById("nearbyPrompt");
 const feedbackBannerEl = document.getElementById("feedbackBanner");
 
 const questionTitleEl = document.getElementById("questionTitle");
 const questionTextEl = document.getElementById("questionText");
 const answerButtonsEl = document.getElementById("answerButtons");
 
 const resultMottoEl = document.getElementById("resultMotto");
 const resultTextEl = document.getElementById("resultText");
 
 const canvas = document.getElementById("view");
 const ctx = canvas.getContext("2d");
 
+const touchStickEl = document.getElementById("touchStick");
+const touchStickKnobEl = document.getElementById("touchStickKnob");
+const touchInteractButton = document.getElementById("touchInteract");
+
 const keys = {
     KeyW: false,
     KeyA: false,
     KeyS: false,
     KeyD: false,
     ArrowUp: false,
     ArrowDown: false,
     ArrowLeft: false,
     ArrowRight: false
 };
 
 let state = null;
 let timerId = null;
 let rafId = null;
 let lastFrame = 0;
 let feedbackTimeoutId = null;
 
+const stickInput = {
+    active: false,
+    pointerId: null,
+    forward: 0,
+    turn: 0
+};
+
+const STICK_DEADZONE = 0.16;
+const STICK_MAX_OFFSET = 42;
+
 function createInitialState() {
     return {
         running: true,
         questionOpen: false,
         player: {
             x: 1.8,
             y: 1.8,
             angle: 0.28
         },
         stations: STATION_DEFS.map((station) => ({ ...station, solved: false })),
         timeLeft: MAX_TIME,
         score: 0,
         streak: 0,
         maxStreak: 0,
         solved: 0,
         correct: 0,
         highscore: Number(localStorage.getItem("dreid_lernwelt_highscore") || 0),
         nearbyStationId: null,
         activeStationId: null,
         finishReason: ""
     };
 }
 
 function normalizeAngle(angle) {
     let a = angle;
@@ -503,83 +517,172 @@ function drawMinimap(canvasWidth) {
         ctx.beginPath();
         ctx.arc(x + station.x * cell, y + station.y * cell, Math.max(2.5, cell * 0.24), 0, Math.PI * 2);
         ctx.fill();
     });
 
     const px = x + state.player.x * cell;
     const py = y + state.player.y * cell;
 
     ctx.fillStyle = "#ffffff";
     ctx.beginPath();
     ctx.arc(px, py, Math.max(2.8, cell * 0.24), 0, Math.PI * 2);
     ctx.fill();
 
     ctx.strokeStyle = "#ffffff";
     ctx.lineWidth = 1.6;
     ctx.beginPath();
     ctx.moveTo(px, py);
     ctx.lineTo(px + Math.cos(state.player.angle) * 10, py + Math.sin(state.player.angle) * 10);
     ctx.stroke();
 }
 
 function movePlayer(delta) {
     let forward = 0;
     if (keys.KeyW || keys.ArrowUp) forward += 1;
     if (keys.KeyS || keys.ArrowDown) forward -= 1;
+    forward += stickInput.forward;
+    forward = Math.max(-1, Math.min(1, forward));
 
     let strafe = 0;
     if (keys.KeyD) strafe += 1;
     if (keys.KeyA) strafe -= 1;
 
     let turn = 0;
     if (keys.ArrowLeft) turn -= 1;
     if (keys.ArrowRight) turn += 1;
+    turn += stickInput.turn;
+    turn = Math.max(-1, Math.min(1, turn));
 
     state.player.angle += turn * TURN_SPEED * delta;
     state.player.angle = normalizeAngle(state.player.angle);
 
     let moveX = forward * Math.cos(state.player.angle) + strafe * -Math.sin(state.player.angle);
     let moveY = forward * Math.sin(state.player.angle) + strafe * Math.cos(state.player.angle);
 
     const len = Math.hypot(moveX, moveY);
     if (len > 0) {
         moveX /= len;
         moveY /= len;
 
         const step = MOVE_SPEED * delta;
         const nextX = state.player.x + moveX * step;
         const nextY = state.player.y + moveY * step;
 
         if (!isBlocked(nextX, state.player.y)) {
             state.player.x = nextX;
         }
         if (!isBlocked(state.player.x, nextY)) {
             state.player.y = nextY;
         }
     }
 }
 
+
+function tryOpenNearbyStation() {
+    if (!state || !state.running || state.questionOpen) return;
+    const station = getStationById(state.nearbyStationId);
+    if (station && !station.solved) {
+        openQuestion(station);
+    }
+}
+
+function resetTouchStick() {
+    stickInput.active = false;
+    stickInput.pointerId = null;
+    stickInput.forward = 0;
+    stickInput.turn = 0;
+
+    if (touchStickEl) {
+        touchStickEl.classList.remove("active");
+    }
+    if (touchStickKnobEl) {
+        touchStickKnobEl.style.transform = "translate(-50%, -50%)";
+    }
+}
+
+function updateTouchStick(pointerEvent) {
+    if (!touchStickEl || !touchStickKnobEl) return;
+
+    const rect = touchStickEl.getBoundingClientRect();
+    const cx = rect.left + rect.width / 2;
+    const cy = rect.top + rect.height / 2;
+
+    const rawX = pointerEvent.clientX - cx;
+    const rawY = pointerEvent.clientY - cy;
+    const distance = Math.hypot(rawX, rawY);
+
+    const radius = Math.max(10, rect.width / 2 - 14);
+    const clampedDistance = Math.min(distance, radius);
+    const nx = distance > 0 ? (rawX / distance) * (clampedDistance / radius) : 0;
+    const ny = distance > 0 ? (rawY / distance) * (clampedDistance / radius) : 0;
+
+    const applyDeadzone = (value) => {
+        const magnitude = Math.abs(value);
+        if (magnitude < STICK_DEADZONE) return 0;
+        return Math.sign(value) * ((magnitude - STICK_DEADZONE) / (1 - STICK_DEADZONE));
+    };
+
+    stickInput.turn = applyDeadzone(nx);
+    stickInput.forward = -applyDeadzone(ny);
+
+    const knobX = nx * STICK_MAX_OFFSET;
+    const knobY = ny * STICK_MAX_OFFSET;
+    touchStickKnobEl.style.transform = `translate(calc(-50% + ${knobX}px), calc(-50% + ${knobY}px))`;
+}
+
+function setupTouchStick() {
+    if (!touchStickEl || !touchStickKnobEl) return;
+
+    touchStickEl.addEventListener("pointerdown", (event) => {
+        event.preventDefault();
+        touchStickEl.setPointerCapture(event.pointerId);
+        stickInput.active = true;
+        stickInput.pointerId = event.pointerId;
+        touchStickEl.classList.add("active");
+        updateTouchStick(event);
+    });
+
+    touchStickEl.addEventListener("pointermove", (event) => {
+        if (!stickInput.active || event.pointerId !== stickInput.pointerId) return;
+        event.preventDefault();
+        updateTouchStick(event);
+    });
+
+    const releaseStick = (event) => {
+        if (!stickInput.active || event.pointerId !== stickInput.pointerId) return;
+        event.preventDefault();
+        if (touchStickEl.hasPointerCapture(event.pointerId)) {
+            touchStickEl.releasePointerCapture(event.pointerId);
+        }
+        resetTouchStick();
+    };
+
+    touchStickEl.addEventListener("pointerup", releaseStick);
+    touchStickEl.addEventListener("pointercancel", releaseStick);
+    touchStickEl.addEventListener("lostpointercapture", resetTouchStick);
+}
+
 function getStationById(id) {
     return state.stations.find((station) => station.id === id) || null;
 }
 
 function openQuestion(station) {
     if (!station || station.solved) return;
 
     state.questionOpen = true;
     state.activeStationId = station.id;
 
     questionTitleEl.textContent = station.name;
     questionTextEl.textContent = station.question;
     answerButtonsEl.innerHTML = "";
 
     station.options.forEach((optionText, index) => {
         const button = document.createElement("button");
         button.type = "button";
         button.textContent = optionText;
         button.addEventListener("click", () => {
             answerStation(station.id, index);
         });
         answerButtonsEl.appendChild(button);
     });
 
     questionModalEl.classList.remove("hidden");
@@ -748,54 +851,63 @@ function startGame() {
         window.cancelAnimationFrame(rafId);
     }
     rafId = window.requestAnimationFrame(loop);
 }
 
 function showStartScreen() {
     const highscore = Number(localStorage.getItem("dreid_lernwelt_highscore") || 0);
     startHighscoreEl.textContent = formatPoints(highscore);
 }
 
 startButton.addEventListener("click", startGame);
 restartButton.addEventListener("click", startGame);
 laterButton.addEventListener("click", () => {
     if (!state) return;
     closeQuestion();
 });
 
 window.addEventListener("keydown", (event) => {
     if (event.code in keys) {
         keys[event.code] = true;
         if (state && state.running) {
             event.preventDefault();
         }
     }
 
-    if (event.code === "KeyE" && state && state.running && !state.questionOpen) {
-        const station = getStationById(state.nearbyStationId);
-        if (station && !station.solved) {
-            event.preventDefault();
-            openQuestion(station);
-        }
+    if (event.code === "KeyE") {
+        event.preventDefault();
+        tryOpenNearbyStation();
     }
 
     if (event.code === "Escape" && state && state.questionOpen) {
         event.preventDefault();
         closeQuestion();
     }
 });
 
 window.addEventListener("keyup", (event) => {
     if (event.code in keys) {
         keys[event.code] = false;
     }
 });
 
-window.addEventListener("blur", resetKeys);
+
+setupTouchStick();
+
+if (touchInteractButton) {
+    touchInteractButton.addEventListener("click", () => {
+        tryOpenNearbyStation();
+    });
+}
+
+window.addEventListener("blur", () => {
+    resetKeys();
+    resetTouchStick();
+});
 window.addEventListener("resize", () => {
     if (state && state.running) {
         renderWorld();
     }
 });
 
 totalEl.textContent = String(STATION_DEFS.length);
 showStartScreen();
