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
        name: "Schabbat-Tisch",
        spriteType: "table",
        interactionLabel: "Schabbat-Tisch",
        x: 2.5,
        y: 1.5,
        question: "Es ist kurz vor Sonnenuntergang am Freitag. Welche Handlung ist im Sinne des Schabbat am passendsten?",
        options: ["Noch schnell einkaufen gehen", "Schabbat-Kerzen vor Sonnenuntergang entzunden und Kiddusch sprechen", "Die Kerzen nach dem Essen anzunden", "Den Schabbat mit Arbeit im Haushalt beginnen"],
        correctIndex: 1,
        fact: "Am Schabbat werden Kerzen, Segen und gemeinsames Essen besonders wichtig.",
        successAction: "Eine Figur spricht den Segen und beginnt ruhig mit der Mahlzeit.",
        actionVisual: ""
    },
    {
        id: "pessach",
        name: "Seder-Tafel",
        spriteType: "table",
        interactionLabel: "Seder-Tafel",
        x: 13.5,
        y: 1.5,
        question: "Beim Sederabend: Welche Handlung passt traditionell zum Erzahlen der Pessach-Geschichte?",
        options: ["Chametz sammeln und sofort essen", "Die Haggada lesen, Fragen stellen und Matze essen", "Nur Sussigkeiten verteilen, ohne Geschichte", "Das Sedermahl durch Fasten ersetzen"],
        correctIndex: 1,
        fact: "Am Pessach-Seder wird an den Auszug aus Agypten erinnert.",
        successAction: "Die Figur zeigt auf die Sederplatte und erzahlt die Befreiungsgeschichte.",
        actionVisual: ""
    },
    {
        id: "kashrut",
        name: "Koschere Kuche",
        spriteType: "kitchen",
        interactionLabel: "koschere Kuche",
        x: 3.5,
        y: 5.5,
        question: "Du planst ein koscheres Abendessen fur Gaste. Welche Entscheidung ist korrekt?",
        options: [
            "Milchiges und Fleischiges im selben Topf kochen",
            "Nach den Speisegesetzen geeignete Lebensmittel nutzen",
            "Nur Suigkeiten essen",
            "Beliebig alles vermischen"
        ],
        correctIndex: 1,
        fact: "Kaschrut bedeutet, Lebensmittel nach judischen Speisegesetzen zuzubereiten.",
        successAction: "Die Figur sortiert ruhig die Zutaten und kocht regelkonform weiter.",
        actionVisual: ""
    },
    {
        id: "synagoge",
        name: "Synagoge",
        spriteType: "synagogue",
        interactionLabel: "Synagoge",
        x: 11.5,
        y: 7.5,
        question: "Du besuchst erstmals eine Synagoge wahrend eines Gottesdienstes. Was ist angemessen?",
        options: [
            "Ruhig verhalten, Kopfbedeckung beachten und respektvoll teilnehmen",
            "Zwischen den Gebeten telefonieren",
            "Im Mittelgang Fotos mit Blitz machen",
            "Laut diskutieren, wahrend andere beten"
        ],
        correctIndex: 0,
        fact: "Die Synagoge ist ein Ort fur Gebet, Lernen und Gemeinschaft.",
        successAction: "Die Figur setzt eine Kippa auf und beginnt ein ruhiges Gebet.",
        actionVisual: ""
    },
    {
        id: "jomkippur",
        name: "Jom-Kippur-Raum",
        spriteType: "hall",
        interactionLabel: "Jom-Kippur-Raum",
        x: 2.5,
        y: 13.5,
        question: "Jom Kippur beginnt bald. Welche Vorbereitung entspricht dem Sinn dieses Tages am ehesten?",
        options: ["Ein grosses Festmahl fur den Abend planen", "Fasten, beten und aktiv um Vergebung bitten", "Sportturnier organisieren", "Neue Jahresvorsatze auf einer Party feiern"],
        correctIndex: 1,
        fact: "Jom Kippur ist ein wichtiger Tag fur Fasten und Versohnung.",
        successAction: "Die Figur wird still, reflektiert und spricht eine Entschuldigung aus.",
        actionVisual: ""
    },
    {
        id: "hebraeisch",
        name: "Tora-Raum",
        spriteType: "torah",
        interactionLabel: "Tora-Raum",
        x: 13.5,
        y: 13.5,
        question: "Du sollst bei einer Tora-Lesung helfen. Welche Handlung ist respektvoll und richtig?",
        options: ["Mit dem Jad dem Text folgen und die Rolle sorgfaltig behandeln", "Mit Kugelschreiber Randnotizen direkt in die Rolle schreiben", "Eine Seite herausreissen, um sie besser zu erklaren", "Die Rolle zum Spass zerknullen und wieder glatten"],
        correctIndex: 0,
        fact: "Die Tora ist traditionell in hebraischer Sprache verfasst und wird respektvoll behandelt.",
        successAction: "Die Figur zeigt mit einem Zeiger auf den Text und liest konzentriert.",
        actionVisual: ""
    }
];

const FOV = Math.PI / 3;
const MOVE_SPEED = 2.8;
const TOUCH_MOVE_FACTOR = 0.38;
const TOUCH_TURN_FACTOR = 0.5;
const TURN_SPEED = 2.3;
const MAX_TIME = 240;
const MAX_LIVES = 3;
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
const livesEl = document.getElementById("lives");
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
const resultMetaEl = document.getElementById("resultMeta");
const scoreWheelValueEl = document.getElementById("scoreWheelValue");

const canvas = document.getElementById("view");
const ctx = canvas.getContext("2d");

const moveStickEl = document.getElementById("moveStick");
const moveStickKnobEl = document.getElementById("moveStickKnob");
const turnStickEl = document.getElementById("turnStick");
const turnStickKnobEl = document.getElementById("turnStickKnob");
const touchInteractButton = document.getElementById("touchInteract");
const fullscreenButton = document.getElementById("fullscreenButton");
const mobileFullscreenGateEl = document.getElementById("mobileFullscreenGate");
const mobileFullscreenTextEl = document.getElementById("mobileFullscreenText");
const mobileFullscreenButton = document.getElementById("mobileFullscreenButton");
const renderFrameEl = document.querySelector(".render-frame");

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
let resolveTimeoutId = null;

const moveStickInput = {
    active: false,
    pointerId: null,
    forward: 0,
    strafe: 0
};

const turnStickInput = {
    active: false,
    pointerId: null,
    turn: 0
};

const STICK_DEADZONE = 0.16;
const STICK_MAX_OFFSET = 42;
const isTouchDevice = window.matchMedia("(hover: none) and (pointer: coarse)").matches || navigator.maxTouchPoints > 0;
const isMobilePhone = (() => {
    const uaDataMobile = navigator.userAgentData && typeof navigator.userAgentData.mobile === "boolean"
        ? navigator.userAgentData.mobile
        : null;
    const userAgent = navigator.userAgent || "";
    const phoneLikeAgent = /Android.+Mobile|iPhone|iPod|Windows Phone|Opera Mini|IEMobile|Mobile Safari/i.test(userAgent);
    const tabletLikeAgent = /iPad|Tablet|Silk|PlayBook|Kindle|Nexus 7|Nexus 10|SM-T|Tab/i.test(userAgent);
    const shortEdge = Math.min(window.screen.width, window.screen.height);
    const longEdge = Math.max(window.screen.width, window.screen.height);
    const phoneLikeScreen = shortEdge <= 540 && longEdge <= 1000;

    if (!isTouchDevice || tabletLikeAgent) return false;
    if (uaDataMobile !== null) return uaDataMobile;
    return phoneLikeAgent || phoneLikeScreen;
})();

if (isTouchDevice) {
    document.body.classList.add("touch-device");
}

function createInitialState() {
    return {
        running: true,
        questionOpen: false,
        player: {
            x: 1.8,
            y: 1.8,
            angle: 0.28
        },
        stations: STATION_DEFS.map((station) => ({ ...station, solved: false, failed: false })),
        timeLeft: MAX_TIME,
        score: 0,
        streak: 0,
        lives: MAX_LIVES,
        maxStreak: 0,
        solved: 0,
        correct: 0,
        answerLocked: false,
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
    livesEl.textContent = String(state.lives);
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
    nearbyPromptEl.textContent = `E drucken fur ${bestStation.interactionLabel}`;
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

function drawStationSprite(x, y, spriteWidth, spriteHeight, station) {
    const solved = station.solved;
    const base = station.failed
        ? "rgba(201, 58, 73, 0.9)"
        : (solved ? "rgba(30, 163, 139, 0.84)" : "rgba(242, 184, 75, 0.92)");

    drawRoundedRect(x, y, spriteWidth, spriteHeight, 10);
    ctx.fillStyle = base;
    ctx.fill();

    const pad = Math.max(5, spriteWidth * 0.1);
    const innerX = x + pad;
    const innerY = y + pad;
    const innerW = spriteWidth - pad * 2;
    const innerH = spriteHeight - pad * 2;

    drawRoundedRect(innerX, innerY, innerW, innerH, 8);
    ctx.fillStyle = "rgba(17, 32, 60, 0.76)";
    ctx.fill();

    ctx.fillStyle = "rgba(235, 245, 255, 0.95)";

    if (station.spriteType === "synagogue") {
        const towerW = innerW * 0.22;
        const towerH = innerH * 0.54;
        ctx.fillRect(innerX + innerW * 0.12, innerY + innerH * 0.36, towerW, towerH);
        ctx.fillRect(innerX + innerW * 0.66, innerY + innerH * 0.36, towerW, towerH);
        ctx.fillRect(innerX + innerW * 0.27, innerY + innerH * 0.5, innerW * 0.46, innerH * 0.4);
        ctx.beginPath();
        ctx.moveTo(innerX + innerW * 0.5, innerY + innerH * 0.17);
        ctx.lineTo(innerX + innerW * 0.27, innerY + innerH * 0.5);
        ctx.lineTo(innerX + innerW * 0.73, innerY + innerH * 0.5);
        ctx.closePath();
        ctx.fill();
    } else if (station.spriteType === "table") {
        ctx.fillRect(innerX + innerW * 0.14, innerY + innerH * 0.56, innerW * 0.72, innerH * 0.14);
        ctx.fillRect(innerX + innerW * 0.2, innerY + innerH * 0.68, innerW * 0.08, innerH * 0.2);
        ctx.fillRect(innerX + innerW * 0.72, innerY + innerH * 0.68, innerW * 0.08, innerH * 0.2);
        ctx.beginPath();
        ctx.arc(innerX + innerW * 0.34, innerY + innerH * 0.49, innerW * 0.07, 0, Math.PI * 2);
        ctx.arc(innerX + innerW * 0.5, innerY + innerH * 0.49, innerW * 0.07, 0, Math.PI * 2);
        ctx.arc(innerX + innerW * 0.66, innerY + innerH * 0.49, innerW * 0.07, 0, Math.PI * 2);
        ctx.fill();
    } else if (station.spriteType === "kitchen") {
        ctx.fillRect(innerX + innerW * 0.16, innerY + innerH * 0.6, innerW * 0.68, innerH * 0.26);
        ctx.fillRect(innerX + innerW * 0.22, innerY + innerH * 0.4, innerW * 0.56, innerH * 0.18);
        ctx.beginPath();
        ctx.arc(innerX + innerW * 0.5, innerY + innerH * 0.5, innerW * 0.1, 0, Math.PI * 2);
        ctx.fill();
    } else if (station.spriteType === "hall") {
        ctx.fillRect(innerX + innerW * 0.18, innerY + innerH * 0.32, innerW * 0.64, innerH * 0.54);
        ctx.fillRect(innerX + innerW * 0.3, innerY + innerH * 0.18, innerW * 0.4, innerH * 0.12);
        ctx.fillStyle = "rgba(17, 32, 60, 0.8)";
        ctx.fillRect(innerX + innerW * 0.44, innerY + innerH * 0.53, innerW * 0.12, innerH * 0.33);
    } else if (station.spriteType === "torah") {
        ctx.beginPath();
        ctx.arc(innerX + innerW * 0.35, innerY + innerH * 0.5, innerW * 0.14, 0, Math.PI * 2);
        ctx.arc(innerX + innerW * 0.65, innerY + innerH * 0.5, innerW * 0.14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(innerX + innerW * 0.35, innerY + innerH * 0.36, innerW * 0.3, innerH * 0.28);
        ctx.fillStyle = "rgba(17, 32, 60, 0.8)";
        ctx.fillRect(innerX + innerW * 0.49, innerY + innerH * 0.24, innerW * 0.02, innerH * 0.54);
    }

    if (solved) {
        ctx.fillStyle = station.failed ? "#ffe1e7" : "#d9ffe8";
        ctx.font = `${Math.max(11, spriteHeight * 0.16)}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(station.failed ? "X" : "OK", x + spriteWidth * 0.5, y + spriteHeight * 0.82);
    }
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

        drawStationSprite(x, y, spriteWidth, spriteHeight, station);
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
    const size = Math.min(220, canvasWidth * 0.36);
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
        ctx.fillStyle = station.failed ? "#c93a49" : (station.solved ? "#1ea38b" : "#f2b84b");
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
    forward += moveStickInput.forward * TOUCH_MOVE_FACTOR;
    forward = Math.max(-1, Math.min(1, forward));

    let strafe = 0;
    if (keys.KeyD) strafe += 1;
    if (keys.KeyA) strafe -= 1;
    strafe += moveStickInput.strafe * TOUCH_MOVE_FACTOR;
    strafe = Math.max(-1, Math.min(1, strafe));

    let turn = 0;
    if (keys.ArrowLeft) turn -= 1;
    if (keys.ArrowRight) turn += 1;
    turn += turnStickInput.turn * TOUCH_TURN_FACTOR;
    turn = Math.max(-1, Math.min(1, turn));

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

function applyStickDeadzone(value) {
    const magnitude = Math.abs(value);
    if (magnitude < STICK_DEADZONE) return 0;
    return Math.sign(value) * ((magnitude - STICK_DEADZONE) / (1 - STICK_DEADZONE));
}

function resetStick(stickEl, knobEl, stickState, resets) {
    stickState.active = false;
    stickState.pointerId = null;
    Object.keys(resets).forEach((key) => {
        stickState[key] = resets[key];
    });

    if (stickEl) {
        stickEl.classList.remove("active");
    }
    if (knobEl) {
        knobEl.style.transform = "translate(-50%, -50%)";
    }
}

function updateStickPosition(stickEl, knobEl, pointerEvent, onChange) {
    if (!stickEl || !knobEl) return;

    const rect = stickEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const rawX = pointerEvent.clientX - cx;
    const rawY = pointerEvent.clientY - cy;
    const distance = Math.hypot(rawX, rawY);

    const radius = Math.max(10, rect.width / 2 - 14);
    const clampedDistance = Math.min(distance, radius);
    const nx = distance > 0 ? (rawX / distance) * (clampedDistance / radius) : 0;
    const ny = distance > 0 ? (rawY / distance) * (clampedDistance / radius) : 0;

    const knobX = nx * STICK_MAX_OFFSET;
    const knobY = ny * STICK_MAX_OFFSET;
    knobEl.style.transform = `translate(calc(-50% + ${knobX}px), calc(-50% + ${knobY}px))`;

    onChange(nx, ny);
}

function setupStickControl(stickEl, knobEl, stickState, onChange, onReset) {
    if (!stickEl || !knobEl) return;

    const update = (event) => {
        updateStickPosition(stickEl, knobEl, event, onChange);
    };

    const release = (event) => {
        if (!stickState.active || event.pointerId !== stickState.pointerId) return;
        event.preventDefault();
        if (stickEl.hasPointerCapture(event.pointerId)) {
            stickEl.releasePointerCapture(event.pointerId);
        }
        onReset();
    };

    stickEl.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        stickEl.setPointerCapture(event.pointerId);
        stickState.active = true;
        stickState.pointerId = event.pointerId;
        stickEl.classList.add("active");
        update(event);
    });

    stickEl.addEventListener("pointermove", (event) => {
        if (!stickState.active || event.pointerId !== stickState.pointerId) return;
        event.preventDefault();
        update(event);
    });

    stickEl.addEventListener("pointerup", release);
    stickEl.addEventListener("pointercancel", release);
    stickEl.addEventListener("lostpointercapture", onReset);
}

function resetTouchSticks() {
    resetStick(moveStickEl, moveStickKnobEl, moveStickInput, { forward: 0, strafe: 0 });
    resetStick(turnStickEl, turnStickKnobEl, turnStickInput, { turn: 0 });
}

function setupTouchSticks() {
    setupStickControl(
        moveStickEl,
        moveStickKnobEl,
        moveStickInput,
        (nx, ny) => {
            moveStickInput.strafe = applyStickDeadzone(nx);
            moveStickInput.forward = -applyStickDeadzone(ny);
        },
        () => resetStick(moveStickEl, moveStickKnobEl, moveStickInput, { forward: 0, strafe: 0 })
    );

    setupStickControl(
        turnStickEl,
        turnStickKnobEl,
        turnStickInput,
        (nx) => {
            turnStickInput.turn = applyStickDeadzone(nx);
        },
        () => resetStick(turnStickEl, turnStickKnobEl, turnStickInput, { turn: 0 })
    );
}


function isFullscreenActive() {
    return document.fullscreenElement === renderFrameEl;
}

function isPseudoFullscreenActive() {
    return document.body.classList.contains("pseudo-fullscreen");
}

function isAnyFullscreenModeActive() {
    return isFullscreenActive() || isPseudoFullscreenActive();
}

function setPseudoFullscreen(active) {
    document.body.classList.toggle("pseudo-fullscreen", active);
}

function updateFullscreenButtonLabel() {
    if (!fullscreenButton) return;
    fullscreenButton.textContent = isAnyFullscreenModeActive() ? "Vollbild verlassen" : "Vollbild";
}

function updateMobileGateVisibility(active, message) {
    if (!mobileFullscreenGateEl || !mobileFullscreenTextEl) return;
    mobileFullscreenGateEl.classList.toggle("hidden", !active);
    if (message) {
        mobileFullscreenTextEl.textContent = message;
    }
}

function isPortraitOrientation() {
    return window.matchMedia("(orientation: portrait)").matches;
}

async function lockLandscapeOrientation() {
    if (!isMobilePhone || !screen.orientation || !screen.orientation.lock) {
        return;
    }

    try {
        await screen.orientation.lock("landscape");
    } catch (error) {
        console.warn("Bildschirmdrehung konnte nicht gesperrt werden.", error);
    }
}

async function ensureGameplayFullscreen() {
    if (!renderFrameEl) return;

    setPseudoFullscreen(true);

    if (renderFrameEl.requestFullscreen && !isFullscreenActive()) {
        try {
            await renderFrameEl.requestFullscreen();
        } catch (error) {
            console.warn("Nativer Fullscreen fehlgeschlagen, Fenster-Fullscreen bleibt aktiv.", error);
        }
    }

    if (isMobilePhone) {
        await lockLandscapeOrientation();
    }

    updateFullscreenButtonLabel();
    if (state && state.running) {
        renderWorld();
    }
}

function enforceMobileFullscreen() {
    if (!isMobilePhone) {
        updateMobileGateVisibility(false);
        return;
    }

    const fullscreenActive = isAnyFullscreenModeActive();
    const portraitOrientation = isPortraitOrientation();

    if (fullscreenActive && !portraitOrientation) {
        updateMobileGateVisibility(false);
        return;
    }

    const message = portraitOrientation
        ? "Bitte ins Querformat drehen und Vollbild aktivieren, um weiterzuspielen."
        : "Zum Spielen auf Smartphones ist Vollbild erforderlich. Du kannst es oben links jederzeit verlassen.";

    updateMobileGateVisibility(true, message);
}

async function toggleFullscreen() {
    if (!renderFrameEl) return;

    if (isFullscreenActive()) {
        await document.exitFullscreen();
        setPseudoFullscreen(false);
        updateFullscreenButtonLabel();
        if (state && state.running) {
            renderWorld();
        }
        return;
    }

    if (isPseudoFullscreenActive()) {
        setPseudoFullscreen(false);
        updateFullscreenButtonLabel();
        if (state && state.running) {
            renderWorld();
        }
        return;
    }

    await ensureGameplayFullscreen();
}

function getStationById(id) {
    return state.stations.find((station) => station.id === id) || null;
}

function openQuestion(station) {
    if (!station || station.solved || state.answerLocked) return;

    state.questionOpen = true;
    state.answerLocked = false;
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
    if (resolveTimeoutId) {
        window.clearTimeout(resolveTimeoutId);
        resolveTimeoutId = null;
    }
    state.questionOpen = false;
    state.activeStationId = null;
    state.answerLocked = false;
    questionModalEl.classList.add("hidden");
    updateNearbyPrompt();
}

function answerStation(stationId, selectedIndex) {
    const station = getStationById(stationId);
    if (!station || station.solved || !state.running || state.answerLocked) return;

    state.answerLocked = true;

    const correct = selectedIndex === station.correctIndex;
    if (correct) {
        const timeBonus = Math.floor(state.timeLeft * SCORE_TIME_FACTOR);
        const streakBonus = Math.min(220, state.streak * SCORE_STREAK_FACTOR);
        const gained = SCORE_BASE + timeBonus + streakBonus;

        state.score += gained;
        state.streak += 1;
        state.maxStreak = Math.max(state.maxStreak, state.streak);
        state.correct += 1;

        showFeedback(`Richtig. +${formatPoints(gained)} Punkte. ${station.fact}`, "ok");
    } else {
        state.score = Math.max(0, state.score - SCORE_WRONG_PENALTY);
        state.streak = 0;
        state.lives = Math.max(0, state.lives - 1);
        station.failed = true;

        showFeedback(`Falsch. -${formatPoints(SCORE_WRONG_PENALTY)} Punkte. Richtige Losung: ${station.options[station.correctIndex]}.`, "bad");
    }

    station.solved = true;
    state.solved += 1;
    updateHud();

    questionTextEl.textContent = correct
        ? `Richtig beantwortet. ${station.successAction}`
        : `Falsch beantwortet. Richtige Losung: ${station.options[station.correctIndex]}. ${station.fact}`;

    answerButtonsEl.innerHTML = "";
    const continueButton = document.createElement("button");
    continueButton.type = "button";
    continueButton.textContent = "Weiter";
    continueButton.addEventListener("click", () => {
        closeQuestion();
        if (state.lives <= 0) {
            endGame("Keine Leben mehr.");
            return;
        }
        if (state.solved >= state.stations.length) {
            endGame("Alle Orte im Labyrinth erkundet.");
        }
    });
    answerButtonsEl.appendChild(continueButton);

    resolveTimeoutId = window.setTimeout(() => {
        if (!state || !state.running || !state.questionOpen) return;
        closeQuestion();
        if (state.lives <= 0) {
            endGame("Keine Leben mehr.");
            return;
        }
        if (state.solved >= state.stations.length) {
            endGame("Alle Orte im Labyrinth erkundet.");
        }
    }, 2200);
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
    scoreWheelValueEl.textContent = formatPoints(state.score);
    resultMetaEl.textContent = `Richtige Antworten: ${state.correct}/${total} · Verbleibende Leben: ${state.lives}/${MAX_LIVES}`;
    resultTextEl.textContent =
        `${state.finishReason} Score: ${formatPoints(state.score)}. ` +
        `Richtige Antworten: ${state.correct}/${total} (${percent}%). ` +
        `Beste Serie: x${state.maxStreak}. Highscore: ${formatPoints(state.highscore)}.`;

    startHighscoreEl.textContent = formatPoints(state.highscore);

    questionModalEl.classList.add("hidden");
    setPseudoFullscreen(false);
    updateFullscreenButtonLabel();
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

    const gateBlocksInput = mobileFullscreenGateEl && !mobileFullscreenGateEl.classList.contains("hidden");
    if (!state.questionOpen && !gateBlocksInput) {
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

async function startGame() {
    if (feedbackTimeoutId) {
        window.clearTimeout(feedbackTimeoutId);
        feedbackTimeoutId = null;
    }

    state = createInitialState();
    resetKeys();
    setPseudoFullscreen(false);
    updateFullscreenButtonLabel();
    lastFrame = 0;

    if (isMobilePhone) {
        await ensureGameplayFullscreen();
    }

    startScreenEl.classList.add("hidden");
    resultEl.classList.add("hidden");
    questionModalEl.classList.add("hidden");
    feedbackBannerEl.classList.add("hidden");
    nearbyPromptEl.classList.add("hidden");
    gamePanelEl.classList.remove("hidden");

    enforceMobileFullscreen();
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



if (fullscreenButton) {
    fullscreenButton.addEventListener("click", () => {
        toggleFullscreen();
    });
}

if (mobileFullscreenButton) {
    mobileFullscreenButton.addEventListener("click", async () => {
        await ensureGameplayFullscreen();
        enforceMobileFullscreen();
    });
}

document.addEventListener("fullscreenchange", () => {
    updateFullscreenButtonLabel();
    enforceMobileFullscreen();
    if (state && state.running) {
        renderWorld();
    }
});

setupTouchSticks();

if (touchInteractButton) {
    touchInteractButton.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        tryOpenNearbyStation();
    });

    touchInteractButton.addEventListener("click", () => {
        tryOpenNearbyStation();
    });
}

window.addEventListener("blur", () => {
    resetKeys();
    resetTouchSticks();
});
window.addEventListener("resize", () => {
    enforceMobileFullscreen();
    if (state && state.running) {
        renderWorld();
    }
});

window.addEventListener("orientationchange", () => {
    enforceMobileFullscreen();
});

totalEl.textContent = String(STATION_DEFS.length);
showStartScreen();
updateFullscreenButtonLabel();
