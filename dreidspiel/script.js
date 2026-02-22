const MAP = [
    "1111111111111111",
    "1000000000000001",
    "1011110111111101",
    "1000000100000001",
    "1011100101110101",
    "1000100001000101",
    "1010111101011101",
    "1000000001000001",
    "1011111101111101",
    "1000000000000001",
    "1011110111111101",
    "1000010000000101",
    "1011010111110101",
    "1001000000010001",
    "1000011111000001",
    "1111111111111111"
];

const STATION_DEFS = [
    {
        id: "schabbat",
        name: "Station Schabbat",
        tag: "SB",
        x: 2.5,
        y: 1.5,
        question: "Wann beginnt der Schabbat traditionell?",
        options: ["Freitagabend bei Sonnenuntergang", "Samstag um Mitternacht", "Sonntagmorgen", "Freitagmittag"],
        correctIndex: 0,
        fact: "Der Schabbat beginnt am Freitagabend bei Sonnenuntergang."
    },
    {
        id: "pessach",
        name: "Station Pessach",
        tag: "PS",
        x: 13.5,
        y: 1.5,
        question: "Woran erinnert Pessach?",
        options: ["An ein Erntefest", "An den Auszug aus Agypten", "An das Neujahr", "An einen Fastentag"],
        correctIndex: 1,
        fact: "Pessach erinnert an den Auszug der Israeliten aus Agypten."
    },
    {
        id: "kashrut",
        name: "Station Kaschrut",
        tag: "KS",
        x: 3.5,
        y: 5.5,
        question: "Was bedeutet 'koscher' bei Lebensmitteln?",
        options: [
            "Nur vegetarisch",
            "Fur Feiertage reserviert",
            "Nach religiosen Speisegesetzen erlaubt",
            "Aus regionalem Anbau"
        ],
        correctIndex: 2,
        fact: "Koscher bedeutet erlaubt nach judischen Speisegesetzen."
    },
    {
        id: "synagoge",
        name: "Station Synagoge",
        tag: "SY",
        x: 11.5,
        y: 7.5,
        question: "Welche Beschreibung passt zur Synagoge?",
        options: [
            "Ein historisches Museum",
            "Ein judisches Gotteshaus fur Gebet und Lernen",
            "Eine religiose Fastenspeise",
            "Ein Feiertag im Herbst"
        ],
        correctIndex: 1,
        fact: "Die Synagoge ist ein Ort fur Gebet, Lernen und Gemeinschaft."
    },
    {
        id: "jomkippur",
        name: "Station Jom Kippur",
        tag: "JK",
        x: 2.5,
        y: 13.5,
        question: "Womit ist Jom Kippur besonders verbunden?",
        options: ["Tanz und Musik", "Fasten und Versohnung", "Erntedank", "Kerzen fur Chanukka"],
        correctIndex: 1,
        fact: "Jom Kippur gilt als wichtiger Versohnungs- und Fastentag."
    },
    {
        id: "hebraeisch",
        name: "Station Tora",
        tag: "TR",
        x: 13.5,
        y: 13.5,
        question: "In welcher Sprache ist die Tora traditionell geschrieben?",
        options: ["Hebraisch", "Latein", "Griechisch", "Franzosisch"],
        correctIndex: 0,
        fact: "Die Tora ist traditionell in hebraischer Sprache verfasst."
    }
];

const FOV = Math.PI / 3;
const MOVE_SPEED = 2.8;
const TURN_SPEED = 2.3;
const MAX_TIME = 240;
const SCORE_BASE = 220;
const SCORE_TIME_FACTOR = 2;
const SCORE_STREAK_FACTOR = 45;
const SCORE_WRONG_PENALTY = 90;
const PLAYER_RADIUS = 0.2;

const startScreenEl = document.getElementById("startScreen");
const gamePanelEl = document.getElementById("gamePanel");
const resultEl = document.getElementById("result");
const questionModalEl = document.getElementById("questionModal");

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

const touchButtons = Array.from(document.querySelectorAll("[data-touch-key]"));
const touchInteractButton = document.getElementById("touchInteract");

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
    while (a < -Math.PI) a += Math.PI * 2;
    while (a > Math.PI) a -= Math.PI * 2;
    return a;
}

function formatPoints(value) {
    return new Intl.NumberFormat("de-DE").format(Math.max(0, Math.round(value)));
}

function mapWidth() {
    return MAP[0].length;
}

function mapHeight() {
    return MAP.length;
}

function isWallCell(cellX, cellY) {
    if (cellX < 0 || cellY < 0 || cellX >= mapWidth() || cellY >= mapHeight()) {
        return true;
    }
    return MAP[cellY][cellX] === "1";
}

function isBlocked(x, y) {
    const minX = Math.floor(x - PLAYER_RADIUS);
    const maxX = Math.floor(x + PLAYER_RADIUS);
    const minY = Math.floor(y - PLAYER_RADIUS);
    const maxY = Math.floor(y + PLAYER_RADIUS);

    for (let cy = minY; cy <= maxY; cy += 1) {
        for (let cx = minX; cx <= maxX; cx += 1) {
            if (isWallCell(cx, cy)) {
                return true;
            }
        }
    }
    return false;
}

function resizeCanvasIfNeeded() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const targetW = Math.max(320, Math.floor(rect.width * dpr));
    const targetH = Math.max(200, Math.floor(rect.height * dpr));

    if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
    }
}

function updateHud() {
    if (!state) return;
    timeLeftEl.textContent = String(state.timeLeft);
    scoreEl.textContent = formatPoints(state.score);
    streakEl.textContent = String(state.streak);
    solvedEl.textContent = String(state.solved);
    totalEl.textContent = String(state.stations.length);
    highscoreEl.textContent = formatPoints(state.highscore);
}

function showFeedback(text, type = "ok") {
    feedbackBannerEl.textContent = text;
    feedbackBannerEl.classList.remove("hidden", "bad");
    if (type === "bad") {
        feedbackBannerEl.classList.add("bad");
    }

    if (feedbackTimeoutId) {
        window.clearTimeout(feedbackTimeoutId);
    }
    feedbackTimeoutId = window.setTimeout(() => {
        feedbackBannerEl.classList.add("hidden");
    }, 3000);
}

function updateNearbyPrompt() {
    if (!state || !state.running || state.questionOpen) {
        nearbyPromptEl.classList.add("hidden");
        state.nearbyStationId = null;
        return;
    }

    let bestStation = null;
    let bestDist = Infinity;

    state.stations.forEach((station) => {
        if (station.solved) return;

        const dx = station.x - state.player.x;
        const dy = station.y - state.player.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 1.2) return;

        const nx = dx / Math.max(dist, 0.0001);
        const ny = dy / Math.max(dist, 0.0001);
        const facing = nx * Math.cos(state.player.angle) + ny * Math.sin(state.player.angle);
        if (facing < 0.35) return;

        if (dist < bestDist) {
            bestDist = dist;
            bestStation = station;
        }
    });

    if (!bestStation) {
        nearbyPromptEl.classList.add("hidden");
        state.nearbyStationId = null;
        return;
    }

    state.nearbyStationId = bestStation.id;
    nearbyPromptEl.textContent = `E drucken fur ${bestStation.name}`;
    nearbyPromptEl.classList.remove("hidden");
}

function castRay(rayAngle) {
    const px = state.player.x;
    const py = state.player.y;

    const rayDirX = Math.cos(rayAngle);
    const rayDirY = Math.sin(rayAngle);

    let mapX = Math.floor(px);
    let mapY = Math.floor(py);

    const deltaDistX = rayDirX === 0 ? 1e30 : Math.abs(1 / rayDirX);
    const deltaDistY = rayDirY === 0 ? 1e30 : Math.abs(1 / rayDirY);

    let stepX = 0;
    let stepY = 0;
    let sideDistX = 0;
    let sideDistY = 0;

    if (rayDirX < 0) {
        stepX = -1;
        sideDistX = (px - mapX) * deltaDistX;
    } else {
        stepX = 1;
        sideDistX = (mapX + 1 - px) * deltaDistX;
    }

    if (rayDirY < 0) {
        stepY = -1;
        sideDistY = (py - mapY) * deltaDistY;
    } else {
        stepY = 1;
        sideDistY = (mapY + 1 - py) * deltaDistY;
    }

    let side = 0;
    let hit = false;
    let guard = 0;

    while (!hit && guard < 72) {
        guard += 1;
        if (sideDistX < sideDistY) {
            sideDistX += deltaDistX;
            mapX += stepX;
            side = 0;
        } else {
            sideDistY += deltaDistY;
            mapY += stepY;
            side = 1;
        }

        if (isWallCell(mapX, mapY)) {
            hit = true;
        }
    }

    let dist = 20;
    if (hit) {
        if (side === 0) {
            dist = (mapX - px + (1 - stepX) / 2) / rayDirX;
        } else {
            dist = (mapY - py + (1 - stepY) / 2) / rayDirY;
        }
    }

    return {
        dist: Math.max(0.001, Math.abs(dist)),
        side,
        mapX,
        mapY
    };
}

function drawRoundedRect(x, y, w, h, radius) {
    const r = Math.min(radius, w * 0.5, h * 0.5);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
}

function drawBackground(width, height) {
    const sky = ctx.createLinearGradient(0, 0, 0, height * 0.58);
    sky.addColorStop(0, "#2f6fcc");
    sky.addColorStop(1, "#152b52");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height * 0.58);

    const floor = ctx.createLinearGradient(0, height * 0.5, 0, height);
    floor.addColorStop(0, "#6a4a2f");
    floor.addColorStop(1, "#332318");
    ctx.fillStyle = floor;
    ctx.fillRect(0, height * 0.5, width, height * 0.5);
}

function renderWorld() {
    resizeCanvasIfNeeded();

    const width = canvas.width;
    const height = canvas.height;
    const rays = Math.max(260, Math.floor(width / 2));
    const stripWidth = width / rays;
    const depth = new Array(rays);

    drawBackground(width, height);

    for (let i = 0; i < rays; i += 1) {
        const rayAngle = state.player.angle - FOV / 2 + (i / rays) * FOV;
        const hit = castRay(rayAngle);
        const correctedDist = hit.dist * Math.cos(rayAngle - state.player.angle);
        const wallHeight = Math.min(height, (height / correctedDist) * 0.92);
        const wallY = (height - wallHeight) / 2;

        depth[i] = correctedDist;

        const distanceShade = Math.max(0.2, 1 / (1 + correctedDist * correctedDist * 0.18));
        const sideShade = hit.side === 1 ? 0.78 : 1;
        const shade = distanceShade * sideShade;

        const r = Math.floor(62 * shade + 20);
        const g = Math.floor(98 * shade + 28);
        const b = Math.floor(166 * shade + 32);

        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fillRect(i * stripWidth, wallY, Math.ceil(stripWidth) + 1, wallHeight);
    }

    state.stations.forEach((station) => {
        const dx = station.x - state.player.x;
        const dy = station.y - state.player.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 0.2) return;

        const relAngle = normalizeAngle(Math.atan2(dy, dx) - state.player.angle);
        if (Math.abs(relAngle) > FOV * 0.62) return;

        const screenX = (0.5 + relAngle / FOV) * width;
        const spriteHeight = Math.max(18, Math.min(height * 0.62, (height / dist) * 0.62));
        const spriteWidth = spriteHeight * 0.62;

        const rayIndex = Math.floor(screenX / stripWidth);
        if (rayIndex < 0 || rayIndex >= depth.length) return;
        if (dist > depth[rayIndex] + 0.15) return;

        const x = screenX - spriteWidth * 0.5;
        const y = height * 0.5 - spriteHeight * 0.5;

        drawRoundedRect(x, y, spriteWidth, spriteHeight, 10);
        ctx.fillStyle = station.solved ? "rgba(30, 163, 139, 0.76)" : "rgba(242, 184, 75, 0.88)";
        ctx.fill();

        drawRoundedRect(x + 4, y + 4, spriteWidth - 8, spriteHeight - 8, 8);
        ctx.fillStyle = "rgba(17, 32, 60, 0.68)";
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.font = `${Math.max(13, spriteHeight * 0.18)}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(station.tag, screenX, y + spriteHeight * 0.46);

        if (station.solved) {
            ctx.fillStyle = "#d9ffe8";
            ctx.font = `${Math.max(11, spriteHeight * 0.16)}px Arial`;
            ctx.fillText("OK", screenX, y + spriteHeight * 0.73);
        }
    });

    drawMinimap(width);
    drawCrosshair(width, height);
}

function drawCrosshair(width, height) {
    const x = width / 2;
    const y = height / 2;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.82)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - 8, y);
    ctx.lineTo(x + 8, y);
    ctx.moveTo(x, y - 8);
    ctx.lineTo(x, y + 8);
    ctx.stroke();
}

function drawMinimap(canvasWidth) {
    const size = Math.min(150, canvasWidth * 0.28);
    const x = canvasWidth - size - 12;
    const y = 12;
    const cell = size / mapWidth();

    ctx.fillStyle = "rgba(8, 14, 28, 0.58)";
    ctx.fillRect(x, y, size, size);

    for (let row = 0; row < mapHeight(); row += 1) {
        for (let col = 0; col < mapWidth(); col += 1) {
            ctx.fillStyle = MAP[row][col] === "1" ? "rgba(215, 226, 255, 0.72)" : "rgba(22, 34, 56, 0.52)";
            ctx.fillRect(x + col * cell, y + row * cell, cell - 1, cell - 1);
        }
    }

    state.stations.forEach((station) => {
        ctx.fillStyle = station.solved ? "#1ea38b" : "#f2b84b";
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

    let strafe = 0;
    if (keys.KeyD) strafe += 1;
    if (keys.KeyA) strafe -= 1;

    let turn = 0;
    if (keys.ArrowLeft) turn -= 1;
    if (keys.ArrowRight) turn += 1;

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


function tryOpenNearbyStation() {
    if (!state || !state.running || state.questionOpen) return;
    const station = getStationById(state.nearbyStationId);
    if (station && !station.solved) {
        openQuestion(station);
    }
}

function bindTouchKey(button, keyCode) {
    if (!button || !(keyCode in keys)) return;

    const activate = (event) => {
        event.preventDefault();
        keys[keyCode] = true;
        button.classList.add("active");
    };

    const deactivate = (event) => {
        event.preventDefault();
        keys[keyCode] = false;
        button.classList.remove("active");
    };

    button.addEventListener("pointerdown", activate);
    button.addEventListener("pointerup", deactivate);
    button.addEventListener("pointerleave", deactivate);
    button.addEventListener("pointercancel", deactivate);
}

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
    nearbyPromptEl.classList.add("hidden");
}

function closeQuestion() {
    state.questionOpen = false;
    state.activeStationId = null;
    questionModalEl.classList.add("hidden");
    updateNearbyPrompt();
}

function answerStation(stationId, selectedIndex) {
    const station = getStationById(stationId);
    if (!station || station.solved || !state.running) return;

    const correct = selectedIndex === station.correctIndex;
    if (correct) {
        const timeBonus = Math.floor(state.timeLeft * SCORE_TIME_FACTOR);
        const streakBonus = Math.min(220, state.streak * SCORE_STREAK_FACTOR);
        const gained = SCORE_BASE + timeBonus + streakBonus;

        state.score += gained;
        state.streak += 1;
        state.maxStreak = Math.max(state.maxStreak, state.streak);
        state.correct += 1;

        showFeedback(`Richtig: +${formatPoints(gained)} Punkte. ${station.fact}`, "ok");
    } else {
        state.score = Math.max(0, state.score - SCORE_WRONG_PENALTY);
        state.streak = 0;

        showFeedback(
            `Nicht korrekt: -${formatPoints(SCORE_WRONG_PENALTY)} Punkte. ${station.fact}`,
            "bad"
        );
    }

    station.solved = true;
    state.solved += 1;
    updateHud();
    closeQuestion();

    if (state.solved >= state.stations.length) {
        endGame("Alle Stationen besucht.");
    }
}

function getResultMotto(score, correctCount, totalStations) {
    const ratio = totalStations > 0 ? correctCount / totalStations : 0;

    if (score >= 1800 && ratio >= 0.83) {
        return "Hervorragend: sehr sicheres Wissen und starke Orientierung in der Lernwelt.";
    }
    if (score >= 1200 && ratio >= 0.6) {
        return "Sehr gut: du kennst viele Inhalte und triffst oft die richtigen Entscheidungen.";
    }
    if (score >= 700) {
        return "Guter Anfang: die Grundlagen sitzen, mit einer weiteren Runde geht noch mehr.";
    }
    return "Solider Start: erkunde die Stationen in Ruhe noch einmal fur mehr Sicherheit.";
}

function endGame(reason) {
    if (!state || !state.running) return;

    state.running = false;
    state.finishReason = reason;

    if (timerId) {
        window.clearInterval(timerId);
        timerId = null;
    }
    if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
    }

    if (state.score > state.highscore) {
        state.highscore = state.score;
        localStorage.setItem("dreid_lernwelt_highscore", String(state.score));
    }

    updateHud();

    const total = state.stations.length;
    const percent = Math.round((state.correct / total) * 100);
    resultMottoEl.textContent = getResultMotto(state.score, state.correct, total);
    resultTextEl.textContent =
        `${state.finishReason} Score: ${formatPoints(state.score)}. ` +
        `Richtige Antworten: ${state.correct}/${total} (${percent}%). ` +
        `Beste Serie: x${state.maxStreak}. Highscore: ${formatPoints(state.highscore)}.`;

    startHighscoreEl.textContent = formatPoints(state.highscore);

    questionModalEl.classList.add("hidden");
    gamePanelEl.classList.add("hidden");
    resultEl.classList.remove("hidden");
}

function startTimer() {
    if (timerId) {
        window.clearInterval(timerId);
    }

    timerId = window.setInterval(() => {
        if (!state || !state.running) return;
        if (state.questionOpen) return;

        state.timeLeft -= 1;
        if (state.timeLeft <= 0) {
            state.timeLeft = 0;
            updateHud();
            endGame("Zeit abgelaufen.");
            return;
        }

        updateHud();
    }, 1000);
}

function loop(timestamp) {
    if (!state || !state.running) return;

    if (!lastFrame) lastFrame = timestamp;
    const delta = Math.min((timestamp - lastFrame) / 1000, 0.04);
    lastFrame = timestamp;

    if (!state.questionOpen) {
        movePlayer(delta);
        updateNearbyPrompt();
    }

    renderWorld();
    rafId = window.requestAnimationFrame(loop);
}

function resetKeys() {
    Object.keys(keys).forEach((key) => {
        keys[key] = false;
    });
}

function startGame() {
    if (feedbackTimeoutId) {
        window.clearTimeout(feedbackTimeoutId);
        feedbackTimeoutId = null;
    }

    state = createInitialState();
    resetKeys();
    lastFrame = 0;

    startScreenEl.classList.add("hidden");
    resultEl.classList.add("hidden");
    questionModalEl.classList.add("hidden");
    feedbackBannerEl.classList.add("hidden");
    nearbyPromptEl.classList.add("hidden");
    gamePanelEl.classList.remove("hidden");

    updateHud();
    startTimer();

    if (rafId) {
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

    if (event.code === "KeyE") {
        event.preventDefault();
        tryOpenNearbyStation();
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


touchButtons.forEach((button) => {
    bindTouchKey(button, button.dataset.touchKey);
});

if (touchInteractButton) {
    touchInteractButton.addEventListener("click", () => {
        tryOpenNearbyStation();
    });
}

window.addEventListener("blur", resetKeys);
window.addEventListener("resize", () => {
    if (state && state.running) {
        renderWorld();
    }
});

totalEl.textContent = String(STATION_DEFS.length);
showStartScreen();
