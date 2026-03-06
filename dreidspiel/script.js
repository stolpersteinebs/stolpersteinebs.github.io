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


const isEnglish = new URLSearchParams(window.location.search).get("lang") === "en";

const STATION_DEFS_EN = [
    { id: "schabbat", name: "Shabbat Table", interactionLabel: "Shabbat Table", question: "It is shortly before sunset on Friday. Which action best fits the spirit of Shabbat?", options: ["Go shopping quickly", "Light Shabbat candles before sunset and say Kiddush", "Light candles after dinner", "Start Shabbat with housework"], fact: "On Shabbat, candles, blessings, and shared meals are especially important.", successAction: "The character says the blessing and begins the meal calmly." },
    { id: "pessach", name: "Seder Table", interactionLabel: "Seder Table", question: "During the Seder evening, which activity traditionally belongs to retelling the Passover story?", options: ["Collect chametz and eat it immediately", "Read the Haggadah, ask questions, and eat matzah", "Only hand out sweets without the story", "Replace the Seder meal with fasting"], fact: "Passover Seder commemorates the Exodus from Egypt.", successAction: "The character points to the Seder plate and retells the story of liberation." },
    { id: "kashrut", name: "Kosher Kitchen", interactionLabel: "Kosher Kitchen", question: "You are planning a kosher dinner for guests. Which decision is correct?", options: ["Cook dairy and meat in the same pot", "Use foods prepared according to dietary laws", "Serve only sweets", "Mix everything together"], fact: "Kashrut means preparing food according to Jewish dietary laws.", successAction: "The character calmly sorts ingredients and continues cooking correctly." },
    { id: "synagoge", name: "Synagogue", interactionLabel: "Synagogue", question: "You visit a synagogue service for the first time. What is appropriate?", options: ["Stay calm, observe head-covering customs, and participate respectfully", "Make phone calls between prayers", "Take flash photos in the aisle", "Discuss loudly while others pray"], fact: "The synagogue is a place for prayer, learning, and community.", successAction: "The character puts on a kippah and begins a quiet prayer." },
    { id: "jomkippur", name: "Yom Kippur Room", interactionLabel: "Yom Kippur Room", question: "Yom Kippur is about to begin. Which preparation matches the meaning of this day best?", options: ["Plan a big evening feast", "Fast, pray, and actively ask forgiveness", "Organize a sports tournament", "Celebrate new resolutions at a party"], fact: "Yom Kippur is an important day for fasting and reconciliation.", successAction: "The character becomes quiet, reflects, and offers an apology." },
    { id: "hebraeisch", name: "Torah Room", interactionLabel: "Torah Room", question: "You are asked to help with a Torah reading. Which action is respectful and correct?", options: ["Follow the text with a yad and handle the scroll carefully", "Write notes directly into the scroll with a pen", "Tear out a page to explain it better", "Crumple the scroll as a joke and smooth it out"], fact: "The Torah is traditionally written in Hebrew and treated with great respect.", successAction: "The character points to the text with a pointer and reads with focus." }
];

const FOV = Math.PI / 3;
const MOVE_SPEED = 2.8;
const TOUCH_MOVE_FACTOR = 0.38;
const TOUCH_TURN_FACTOR = 0.5;
const TURN_SPEED = 2.3;
const MAX_TIME = 240;
const STATION_DEADLINE_SECONDS = 45;
const JUMP_DISTANCE = 2.25;
const JUMP_COOLDOWN_MS = 2200;
const JUMP_DURATION_MS = 340;
const JUMP_WALL_SCAN_LIMIT = 1.2;
const MAX_LIVES = 3;
const SCORE_BASE = 220;
const SCORE_TIME_FACTOR = 2;
const SCORE_STREAK_FACTOR = 45;
const SCORE_WRONG_PENALTY = 90;
const PLAYER_RADIUS = 0.2;
const POWERUP_COUNT = 4;
const POWERUP_RESPAWN_MS = 5200;
const POWERUP_MOVE_SPEED = 1.2;
const LEADERBOARD_SIZE = 5;

const POWERUP_TYPES = [
    { id: "life", icon: "❤️", color: "#ff7b8b", points: 0, life: 1, time: 0, message: "+1 Leben", messageEn: "+1 life" },
    { id: "score", icon: "✨", color: "#ffd76f", points: 260, life: 0, time: 0, message: "+260 Punkte", messageEn: "+260 points" },
    { id: "time", icon: "⏳", color: "#85d2ff", points: 0, life: 0, time: 20, message: "+20 Sekunden", messageEn: "+20 seconds" }
];

const ACTION_EVENT_INTERVAL_MIN = 9;
const ACTION_EVENT_INTERVAL_MAX = 15;

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
const stationDeadlineEl = document.getElementById("stationDeadline");
const streakEl = document.getElementById("streak");
const livesEl = document.getElementById("lives");
const solvedEl = document.getElementById("solved");
const totalEl = document.getElementById("total");
const highscoreEl = document.getElementById("highscore");

const interactButton = document.getElementById("interactButton");
const jumpButton = document.getElementById("jumpButton");
const feedbackBannerEl = document.getElementById("feedbackBanner");

const questionTitleEl = document.getElementById("questionTitle");
const questionTextEl = document.getElementById("questionText");
const answerButtonsEl = document.getElementById("answerButtons");
const resultMottoEl = document.getElementById("resultMotto");
const resultTextEl = document.getElementById("resultText");
const resultMetaEl = document.getElementById("resultMeta");
const scoreWheelValueEl = document.getElementById("scoreWheelValue");

const leaderboardOptInEl = document.getElementById("leaderboardOptIn");
const playerNameInput = document.getElementById("playerName");
const saveLeaderboardButton = document.getElementById("saveLeaderboardButton");
const skipLeaderboardButton = document.getElementById("skipLeaderboardButton");
const leaderboardListEl = document.getElementById("leaderboardList");
const startLeaderboardListEl = document.getElementById("startLeaderboardList");
const leaderboardStatusEl = document.getElementById("leaderboardStatus");

const canvas = document.getElementById("view");
const ctx = canvas.getContext("2d");

const moveStickEl = document.getElementById("moveStick");
const moveStickKnobEl = document.getElementById("moveStickKnob");
const turnStickEl = document.getElementById("turnStick");
const turnStickKnobEl = document.getElementById("turnStickKnob");
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
let leaderboardEntries = [];

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
        // Suchtfaktor: XP und Level-System
        xp: 0,
        level: 1,
        xpToNextLevel: 500,
        combo: 0,
        maxCombo: 0,
        stations: (isEnglish ? STATION_DEFS_EN : STATION_DEFS).map((station, index) => {
            const moveAxis = index % 2 === 0 ? "x" : "y";
            const range = getStationTravelRange(station.x, station.y, moveAxis);

            return {
                ...station,
                spriteType: STATION_DEFS[index].spriteType,
                x: STATION_DEFS[index].x,
                y: STATION_DEFS[index].y,
                solved: false,
                failed: false,
                baseX: STATION_DEFS[index].x,
                baseY: STATION_DEFS[index].y,
                movePhase: Math.random() * Math.PI * 2 + index * 0.45,
                moveAxis,
                moveMinOffset: range.min,
                moveMaxOffset: range.max
            };
        }),
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
        powerups: [],
        finishReason: "",
        stationDeadlineLeft: STATION_DEADLINE_SECONDS,
        jumpReadyAt: 0,
        jumpAnim: null,
        jumpLift: 0,
        actionPulseLeft: randomBetween(ACTION_EVENT_INTERVAL_MIN, ACTION_EVENT_INTERVAL_MAX)
    };
}

function normalizeAngle(angle) {
    let a = angle;
    while (a < -Math.PI) a += Math.PI * 2;
    while (a > Math.PI) a -= Math.PI * 2;
    return a;
}

function formatPoints(value) {
    return new Intl.NumberFormat(isEnglish ? "en-US" : "de-DE").format(Math.max(0, Math.round(value)));
}

function normalizeLeaderboard(rawEntries) {
    if (!Array.isArray(rawEntries)) {
        return [];
    }

    const normalized = rawEntries
        .map((entry) => {
            if (!entry || typeof entry !== "object") return null;

            const score = Number(entry.score);
            if (!Number.isFinite(score)) return null;

            const trimmedName = typeof entry.name === "string" ? entry.name.trim() : "";
            return {
                name: trimmedName || (isEnglish ? "Anonymous" : "Anonym"),
                score
            };
        })
        .filter(Boolean);

    const bestScoresByName = new Map();

    normalized.forEach((entry) => {
        const key = entry.name.toLocaleLowerCase(isEnglish ? "en-US" : "de-DE");
        const existing = bestScoresByName.get(key);
        if (!existing || entry.score > existing.score) {
            bestScoresByName.set(key, entry);
        }
    });

    return Array.from(bestScoresByName.values())
        .sort((a, b) => b.score - a.score)
        .slice(0, LEADERBOARD_SIZE);
}

function getSupabaseConfig() {
    const url = document.querySelector('meta[name="dreid-supabase-url"]')?.getAttribute("content")?.trim();
    const key = document.querySelector('meta[name="dreid-supabase-key"]')?.getAttribute("content")?.trim();
    const table = document.querySelector('meta[name="dreid-supabase-table"]')?.getAttribute("content")?.trim() || "dreidleaderboard";

    if (!url || !key) {
        return null;
    }

    return {
        url: url.replace(/\/+$/, ""),
        key,
        table
    };
}

async function parseJsonSafely(response) {
    const raw = await response.text();
    if (!raw || !raw.trim()) return null;

    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

async function loadLeaderboardFromSupabase(config) {
    const endpoint = `${config.url}/rest/v1/${encodeURIComponent(config.table)}?select=name,score`;
    const response = await fetch(endpoint, {
        method: "GET",
        headers: {
            apikey: config.key,
            Authorization: `Bearer ${config.key}`,
            Accept: "application/json"
        }
    });

    if (!response.ok) {
        throw new Error(isEnglish ? "Supabase GET failed" : "Supabase GET fehlgeschlagen");
    }

    const payload = await parseJsonSafely(response);
    return normalizeLeaderboard(payload);
}

async function saveLeaderboardToSupabase(config, name, score) {
    const endpoint = `${config.url}/rest/v1/${encodeURIComponent(config.table)}`;
    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            apikey: config.key,
            Authorization: `Bearer ${config.key}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal"
        },
        body: JSON.stringify([{ name, score }])
    });

    if (!response.ok) {
        throw new Error(isEnglish ? "Supabase POST failed" : "Supabase POST fehlgeschlagen");
    }

    return loadLeaderboardFromSupabase(config);
}

function renderLeaderboardList(listEl, entries) {
    if (!listEl) return;

    listEl.innerHTML = "";

    if (!entries.length) {
        const item = document.createElement("li");
        item.textContent = isEnglish ? "No entries yet" : "Noch keine Eintrage";
        listEl.appendChild(item);
        return;
    }

    entries.forEach((entry) => {
        const item = document.createElement("li");
        item.textContent = isEnglish ? `${entry.name}: ${formatPoints(entry.score)} pts` : `${entry.name}: ${formatPoints(entry.score)} Punkte`;
        listEl.appendChild(item);
    });
}

function renderLeaderboard(entries) {
    renderLeaderboardList(leaderboardListEl, entries);
    renderLeaderboardList(startLeaderboardListEl, entries);
}

function setLeaderboardStatus(message, isError = false) {
    if (!leaderboardStatusEl) return;

    leaderboardStatusEl.textContent = message;
    leaderboardStatusEl.classList.toggle("error", isError);
}

function randomBetween(min, max) {
    return min + Math.random() * (max - min);
}

function pickRandomPowerupType() {
    return POWERUP_TYPES[Math.floor(Math.random() * POWERUP_TYPES.length)];
}

function getRandomOpenPosition(minDistance = 1.6) {
    for (let attempt = 0; attempt < 120; attempt += 1) {
        const x = randomBetween(1.3, mapWidth() - 1.3);
        const y = randomBetween(1.3, mapHeight() - 1.3);

        if (isWallCell(Math.floor(x), Math.floor(y)) || isBlocked(x, y)) continue;

        const nearStation = STATION_DEFS.some((station) => Math.hypot(station.x - x, station.y - y) < 0.9);
        if (nearStation) continue;

        if (state && Math.hypot(state.player.x - x, state.player.y - y) < minDistance) continue;

        return { x, y };
    }

    return { x: 1.8, y: 1.8 };
}

function createPowerup() {
    const type = pickRandomPowerupType();
    const start = getRandomOpenPosition(2);
    const angle = randomBetween(0, Math.PI * 2);

    return {
        typeId: type.id,
        icon: type.icon,
        color: type.color,
        x: start.x,
        y: start.y,
        vx: Math.cos(angle) * POWERUP_MOVE_SPEED,
        vy: Math.sin(angle) * POWERUP_MOVE_SPEED,
        respawnAt: 0,
        active: true
    };
}

function spawnPowerups() {
    state.powerups = Array.from({ length: POWERUP_COUNT }, () => createPowerup());
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

    if (stationDeadlineEl) {
        stationDeadlineEl.textContent = String(Math.max(0, Math.ceil(state.stationDeadlineLeft)));
        stationDeadlineEl.classList.toggle("warn", state.stationDeadlineLeft <= 10);
    }

    if (jumpButton) {
        jumpButton.disabled = Date.now() < state.jumpReadyAt;
        jumpButton.classList.toggle("ready", Date.now() >= state.jumpReadyAt);
    }
    
    // Update XP bar
    const xpBarFill = document.getElementById("xpBarFill");
    const xpBarText = document.getElementById("xpBarText");
    const levelDisplay = document.getElementById("levelDisplay");
    if (xpBarFill && state) {
        const xpPercent = Math.min(100, (state.xp / state.xpToNextLevel) * 100);
        xpBarFill.style.width = xpPercent + "%";
    }
    if (xpBarText && state) {
        xpBarText.textContent = Math.floor(state.xp) + " / " + Math.floor(state.xpToNextLevel);
    }
    if (levelDisplay && state) {
        levelDisplay.textContent = state.level;
    }
}




function addXP(amount, reason) {
    if (!state) return;
    
    state.xp += amount;
    
    // Level up check
    while (state.xp >= state.xpToNextLevel) {
        state.xp -= state.xpToNextLevel;
        state.level += 1;
        state.xpToNextLevel = Math.floor(state.xpToNextLevel * 1.3); // 30% more XP per level
        
        // Level up effect
        showFeedback((isEnglish ? "LEVEL UP! " : "LEVEL AUFSTIEG! ") + state.level, "ok");
        const viewEl = document.getElementById("view");
        if (viewEl) {
            viewEl.classList.add("levelup-effect");
            setTimeout(() => viewEl.classList.remove("levelup-effect"), 500);
        }
    }
    
    // XP floating text effect
    showFloatingXP(amount, reason);
}

function showFloatingXP(amount, reason) {
    const canvas = document.getElementById("view");
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = rect.width / 2;
    const y = rect.height / 2 - 50;
    
    const floatEl = document.createElement("div");
    floatEl.className = "floating-xp";
    floatEl.textContent = "+" + amount + " XP";
    floatEl.style.left = x + "px";
    floatEl.style.top = y + "px";
    
    document.body.appendChild(floatEl);
    
    setTimeout(() => floatEl.remove(), 1500);
}
function setInteractButtonState(isNearby, stationLabel = "") {
    if (!interactButton) return;

    interactButton.classList.toggle("is-nearby", isNearby);
    interactButton.disabled = !isNearby;

    if (isNearby && stationLabel) {
        interactButton.dataset.stationName = stationLabel;
        interactButton.setAttribute("aria-label", isEnglish ? `Interact with ${stationLabel}` : `Interagieren mit ${stationLabel}`);
    } else {
        interactButton.removeAttribute("data-station-name");
        interactButton.setAttribute("aria-label", isEnglish ? "Interact" : "Interagieren");
    }
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
        setInteractButtonState(false);
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
        setInteractButtonState(false);
        state.nearbyStationId = null;
        return;
    }

    state.nearbyStationId = bestStation.id;
    setInteractButtonState(true, bestStation.interactionLabel);
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

function drawBackground(width, height, viewOffsetY = 0) {
    const sky = ctx.createLinearGradient(0, 0, 0, height * 0.58);
    sky.addColorStop(0, "#2f6fcc");
    sky.addColorStop(1, "#152b52");
    ctx.fillStyle = sky;
    ctx.fillRect(0, viewOffsetY, width, height * 0.58);

    const floor = ctx.createLinearGradient(0, height * 0.5, 0, height);
    floor.addColorStop(0, "#6a4a2f");
    floor.addColorStop(1, "#332318");
    ctx.fillStyle = floor;
    ctx.fillRect(0, height * 0.5 + viewOffsetY, width, height * 0.5);
}

function renderWorld() {
    resizeCanvasIfNeeded();

    const width = canvas.width;
    const height = canvas.height;
    const rays = Math.max(260, Math.floor(width / 2));
    const stripWidth = width / rays;
    const depth = new Array(rays);

    const viewOffsetY = -Math.round((state.jumpLift || 0) * height * 0.08);

    drawBackground(width, height, viewOffsetY);

    for (let i = 0; i < rays; i += 1) {
        const rayAngle = state.player.angle - FOV / 2 + (i / rays) * FOV;
        const hit = castRay(rayAngle);
        const correctedDist = hit.dist * Math.cos(rayAngle - state.player.angle);
        const wallHeight = Math.min(height, (height / correctedDist) * 0.92);
        const wallY = (height - wallHeight) / 2 + viewOffsetY;

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
        const y = height * 0.5 - spriteHeight * 0.5 + viewOffsetY;

        drawStationSprite(x, y, spriteWidth, spriteHeight, station);
    });

    drawPowerupsInWorld(depth, stripWidth, width, height, viewOffsetY);
    drawMinimap(width);
    drawCrosshair(width, height, viewOffsetY);
}

function drawCrosshair(width, height, viewOffsetY = 0) {
    const x = width / 2;
    const y = height / 2 + viewOffsetY * 0.6;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.82)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - 8, y);
    ctx.lineTo(x + 8, y);
    ctx.moveTo(x, y - 8);
    ctx.lineTo(x, y + 8);
    ctx.stroke();
}

function drawPowerupsInWorld(depth, stripWidth, width, height, viewOffsetY = 0) {
    state.powerups.forEach((powerup) => {
        if (!powerup.active) return;

        const dx = powerup.x - state.player.x;
        const dy = powerup.y - state.player.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 0.15) return;

        const relAngle = normalizeAngle(Math.atan2(dy, dx) - state.player.angle);
        if (Math.abs(relAngle) > FOV * 0.66) return;

        const screenX = (0.5 + relAngle / FOV) * width;
        const spriteHeight = Math.max(14, Math.min(height * 0.42, (height / dist) * 0.36));
        const spriteWidth = spriteHeight * 0.76;
        const rayIndex = Math.floor(screenX / stripWidth);
        if (rayIndex < 0 || rayIndex >= depth.length) return;
        if (dist > depth[rayIndex] + 0.08) return;

        const x = screenX - spriteWidth * 0.5;
        const y = height * 0.5 - spriteHeight * 0.5 + viewOffsetY;

        drawRoundedRect(x, y, spriteWidth, spriteHeight, 8);
        ctx.fillStyle = powerup.color;
        ctx.fill();

        ctx.fillStyle = "rgba(8, 14, 28, 0.38)";
        ctx.font = `${Math.max(12, spriteHeight * 0.54)}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(powerup.icon, x + spriteWidth * 0.5, y + spriteHeight * 0.55);
    });
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

    state.powerups.forEach((powerup) => {
        if (!powerup.active) return;
        ctx.fillStyle = powerup.color;
        ctx.beginPath();
        ctx.arc(x + powerup.x * cell, y + powerup.y * cell, Math.max(2.4, cell * 0.2), 0, Math.PI * 2);
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

    const legendX = x + 8;
    const legendY = y + size - 46;
    const legendW = Math.min(size - 16, 150);
    const legendH = 38;
    drawRoundedRect(legendX, legendY, legendW, legendH, 8);
    ctx.fillStyle = "rgba(7, 14, 25, 0.78)";
    ctx.fill();

    const legend = isEnglish
        ? [["#f2b84b", "open"], ["#1ea38b", "solved"], ["#c93a49", "wrong"]]
        : [["#f2b84b", "offen"], ["#1ea38b", "gelöst"], ["#c93a49", "falsch"]];

    ctx.font = `${Math.max(9, cell * 0.42)}px Arial`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    legend.forEach((entry, idx) => {
        const dotX = legendX + 10 + idx * 45;
        const dotY = legendY + 20;
        ctx.fillStyle = entry[0];
        ctx.beginPath();
        ctx.arc(dotX, dotY, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(240, 247, 255, 0.94)";
        ctx.fillText(entry[1], dotX + 7, dotY);
    });
}

function applyPowerup(powerup) {
    const type = POWERUP_TYPES.find((entry) => entry.id === powerup.typeId);
    if (!type) return;

    if (type.life > 0) {
        state.lives += type.life;
    }
    if (type.points > 0) {
        state.score += type.points;
    }
    if (type.time > 0) {
        state.timeLeft = Math.min(MAX_TIME, state.timeLeft + type.time);
    }

    showFeedback(isEnglish ? `Power-up found: ${type.messageEn || type.message}.` : `Power-up gefunden: ${type.message}.`, "ok");
    updateHud();

    powerup.active = false;
    powerup.respawnAt = Date.now() + POWERUP_RESPAWN_MS + Math.floor(Math.random() * 2500);
}

function updatePowerups(delta) {
    state.powerups.forEach((powerup) => {
        if (!powerup.active) {
            if (Date.now() >= powerup.respawnAt) {
                const fresh = createPowerup();
                Object.assign(powerup, fresh);
            }
            return;
        }

        let nextX = powerup.x + powerup.vx * delta;
        let nextY = powerup.y + powerup.vy * delta;

        if (isBlocked(nextX, powerup.y)) {
            powerup.vx *= -1;
            nextX = powerup.x + powerup.vx * delta;
        }
        if (isBlocked(powerup.x, nextY)) {
            powerup.vy *= -1;
            nextY = powerup.y + powerup.vy * delta;
        }

        powerup.x = nextX;
        powerup.y = nextY;

        if (Math.random() < 0.012) {
            const steer = randomBetween(-0.35, 0.35);
            const angle = Math.atan2(powerup.vy, powerup.vx) + steer;
            powerup.vx = Math.cos(angle) * POWERUP_MOVE_SPEED;
            powerup.vy = Math.sin(angle) * POWERUP_MOVE_SPEED;
        }

        const dist = Math.hypot(powerup.x - state.player.x, powerup.y - state.player.y);
        if (dist < 0.45) {
            applyPowerup(powerup);
        }
    });
}


function getStationTravelRange(x, y, axis) {
    const step = 0.08;
    const maxDistance = 2.8;
    let min = 0;
    let max = 0;

    for (let dist = step; dist <= maxDistance; dist += step) {
        const tx = axis === "x" ? x - dist : x;
        const ty = axis === "y" ? y - dist : y;
        if (isBlocked(tx, ty)) break;
        min = -dist;
    }

    for (let dist = step; dist <= maxDistance; dist += step) {
        const tx = axis === "x" ? x + dist : x;
        const ty = axis === "y" ? y + dist : y;
        if (isBlocked(tx, ty)) break;
        max = dist;
    }

    return { min, max };
}

function updateStations(delta, elapsedSeconds) {
    state.stations.forEach((station) => {
        if (station.solved) return;

        const wave = (Math.sin(elapsedSeconds * 0.9 + station.movePhase) + 1) / 2;
        const offset = station.moveMinOffset + (station.moveMaxOffset - station.moveMinOffset) * wave;
        const candidateX = station.moveAxis === "x" ? station.baseX + offset : station.baseX;
        const candidateY = station.moveAxis === "y" ? station.baseY + offset : station.baseY;

        if (!isBlocked(candidateX, candidateY)) {
            station.x = candidateX;
            station.y = candidateY;
        }
    });
}

function consumeStationDeadline(delta) {
    if (!state || !state.running || state.questionOpen) return;

    state.stationDeadlineLeft = Math.max(0, state.stationDeadlineLeft - delta);
    if (state.stationDeadlineLeft <= 0) {
        state.stationDeadlineLeft = STATION_DEADLINE_SECONDS;
        state.streak = 0;
        state.lives = Math.max(0, state.lives - 1);
        showFeedback(isEnglish ? "Too slow to reach the next station – 1 life lost." : "Zu langsam zur nächsten Station – 1 Leben verloren.", "bad");

        if (state.lives <= 0) {
            void endGame(isEnglish ? "No lives left." : "Keine Leben mehr.");
        }

        updateHud();
    }
}

function startJumpAnimation(targetX, targetY) {
    const now = performance.now();
    state.jumpAnim = {
        startTime: now,
        duration: JUMP_DURATION_MS,
        fromX: state.player.x,
        fromY: state.player.y,
        toX: targetX,
        toY: targetY
    };
}

function updateJumpAnimation(timestamp) {
    if (!state || !state.jumpAnim) {
        if (state) state.jumpLift = 0;
        return false;
    }

    const anim = state.jumpAnim;
    const t = Math.max(0, Math.min(1, (timestamp - anim.startTime) / anim.duration));
    const smooth = t * (2 - t);

    state.player.x = anim.fromX + (anim.toX - anim.fromX) * smooth;
    state.player.y = anim.fromY + (anim.toY - anim.fromY) * smooth;
    state.jumpLift = 4 * t * (1 - t);

    if (t >= 1) {
        state.player.x = anim.toX;
        state.player.y = anim.toY;
        state.jumpAnim = null;
        state.jumpLift = 0;
        return false;
    }

    return true;
}

function triggerActionEvent() {
    if (!state || !state.running) return;

    const roll = Math.random();
    if (roll < 0.5) {
        state.powerups.push(createPowerup());
        showFeedback(isEnglish ? "Action event: bonus orb appeared!" : "Action-Event: Bonus-Orb ist erschienen!", "ok");
        addXP(18, "event");
        return;
    }

    if (roll < 0.8) {
        state.timeLeft = Math.min(MAX_TIME, state.timeLeft + 8);
        state.score += 90;
        showFeedback(isEnglish ? "Action event: time and score boost!" : "Action-Event: Zeit- und Punkte-Boost!", "ok");
        addXP(20, "event");
        updateHud();
        return;
    }

    state.streak += 1;
    state.maxStreak = Math.max(state.maxStreak, state.streak);
    state.score += 70;
    showFeedback(isEnglish ? "Action event: combo charge!" : "Action-Event: Komboladung!", "ok");
    addXP(22, "event");
    updateHud();
}

function updateActionFlow(delta) {
    if (!state || !state.running || state.questionOpen) return;

    state.actionPulseLeft -= delta;
    if (state.actionPulseLeft <= 0) {
        triggerActionEvent();
        state.actionPulseLeft = randomBetween(ACTION_EVENT_INTERVAL_MIN, ACTION_EVENT_INTERVAL_MAX);
    }
}

function tryJump() {
    if (!state || !state.running || state.questionOpen) return;
    if (state.jumpAnim) return;
    if (Date.now() < state.jumpReadyAt) return;

    const facingX = Math.cos(state.player.angle);
    const facingY = Math.sin(state.player.angle);
    const stepSize = 0.08;

    let beforeWallX = state.player.x;
    let beforeWallY = state.player.y;
    let jumpTargetX = state.player.x;
    let jumpTargetY = state.player.y;
    let hitWall = false;
    let wallStartDist = 0;

    for (let dist = stepSize; dist <= JUMP_DISTANCE; dist += stepSize) {
        const testX = state.player.x + facingX * dist;
        const testY = state.player.y + facingY * dist;
        const inBounds = testX >= 0.5 && testX < mapWidth() - 0.5 && testY >= 0.5 && testY < mapHeight() - 0.5;
        if (!inBounds) break;

        const blocked = isBlocked(testX, testY);

        if (!hitWall) {
            if (!blocked) {
                beforeWallX = testX;
                beforeWallY = testY;
                jumpTargetX = testX;
                jumpTargetY = testY;
                continue;
            }

            hitWall = true;
            wallStartDist = dist;
            continue;
        }

        if (blocked) {
            if (dist - wallStartDist > JUMP_WALL_SCAN_LIMIT) {
                break;
            }
            continue;
        }

        jumpTargetX = testX;
        jumpTargetY = testY;
        break;
    }

    const movedDistance = Math.hypot(jumpTargetX - state.player.x, jumpTargetY - state.player.y);
    if (movedDistance < 0.1) {
        const fallbackDistance = Math.hypot(beforeWallX - state.player.x, beforeWallY - state.player.y);
        if (fallbackDistance >= 0.1) {
            jumpTargetX = beforeWallX;
            jumpTargetY = beforeWallY;
        } else {
            showFeedback(isEnglish ? "No jump path in that direction." : "In diese Richtung gibt es keinen Sprungpfad.", "bad");
            return;
        }
    }

    startJumpAnimation(jumpTargetX, jumpTargetY);
    state.jumpReadyAt = Date.now() + JUMP_COOLDOWN_MS;

    const viewEl = document.getElementById("view");
    if (viewEl) {
        viewEl.classList.add("jump-effect");
        setTimeout(() => viewEl.classList.remove("jump-effect"), JUMP_DURATION_MS);
    }

    addXP(10, "jump");
    showFeedback(
        hitWall
            ? (isEnglish ? "Wall vault! 🦘" : "Wandsprung! 🦘")
            : (isEnglish ? "Jump! 🦘" : "Sprung! 🦘"),
        "ok"
    );
    updateHud();
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
    fullscreenButton.textContent = isAnyFullscreenModeActive() ? (isEnglish ? "Exit fullscreen" : "Vollbild verlassen") : (isEnglish ? "Fullscreen" : "Vollbild");
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
            console.warn(isEnglish ? "Native fullscreen failed, windowed fullscreen stays active." : "Nativer Fullscreen fehlgeschlagen, Fenster-Fullscreen bleibt aktiv.", error);
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
        ? (isEnglish ? "Rotate to landscape and enable fullscreen to keep playing." : "Bitte ins Querformat drehen und Vollbild aktivieren, um weiterzuspielen.")
        : (isEnglish ? "Fullscreen is required on smartphones to play. You can exit it anytime from the top left." : "Zum Spielen auf Smartphones ist Vollbild erforderlich. Du kannst es oben links jederzeit verlassen.");

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
    setInteractButtonState(false);
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

    if (!state.running) return;

    if (state.lives <= 0) {
        void endGame(isEnglish ? "No lives left." : "Keine Leben mehr.");
        return;
    }

    if (state.solved >= state.stations.length) {
        void endGame(isEnglish ? "All stations explored." : "Alle Orte im Labyrinth erkundet.");
    }
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

        showFeedback(isEnglish ? `Correct. +${formatPoints(gained)} points. ${station.fact}` : `Richtig. +${formatPoints(gained)} Punkte. ${station.fact}`, "ok");
    } else {
        state.score = Math.max(0, state.score - SCORE_WRONG_PENALTY);
        state.streak = 0;
        state.lives = Math.max(0, state.lives - 1);
        station.failed = true;

        showFeedback(isEnglish ? `Wrong. -${formatPoints(SCORE_WRONG_PENALTY)} points. Correct answer: ${station.options[station.correctIndex]}.` : `Falsch. -${formatPoints(SCORE_WRONG_PENALTY)} Punkte. Richtige Losung: ${station.options[station.correctIndex]}.`, "bad");
    }

    station.solved = true;
    state.solved += 1;
    state.stationDeadlineLeft = STATION_DEADLINE_SECONDS;
    updateHud();

    questionTextEl.textContent = correct
        ? (isEnglish ? `Correct. ${station.successAction}` : `Richtig beantwortet. ${station.successAction}`)
        : (isEnglish ? `Wrong. Correct answer: ${station.options[station.correctIndex]}. ${station.fact}` : `Falsch beantwortet. Richtige Losung: ${station.options[station.correctIndex]}. ${station.fact}`);

    answerButtonsEl.innerHTML = "";
    const continueButton = document.createElement("button");
    continueButton.type = "button";
    continueButton.textContent = isEnglish ? "Continue" : "Weiter";
    continueButton.addEventListener("click", () => {
        closeQuestion();
        if (state.lives <= 0) {
            void endGame(isEnglish ? "No lives left." : "Keine Leben mehr.");
            return;
        }
        if (state.solved >= state.stations.length) {
            void endGame(isEnglish ? "All stations explored." : "Alle Orte im Labyrinth erkundet.");
        }
    });
    answerButtonsEl.appendChild(continueButton);

    resolveTimeoutId = window.setTimeout(() => {
        if (!state || !state.running || !state.questionOpen) return;
        closeQuestion();
        if (state.lives <= 0) {
            void endGame(isEnglish ? "No lives left." : "Keine Leben mehr.");
            return;
        }
        if (state.solved >= state.stations.length) {
            void endGame(isEnglish ? "All stations explored." : "Alle Orte im Labyrinth erkundet.");
        }
    }, 2200);
}

function getResultMotto(score, correctCount, totalStations) {
    const ratio = totalStations > 0 ? correctCount / totalStations : 0;

    if (score >= 1800 && ratio >= 0.83) {
        return isEnglish
            ? "Excellent: strong knowledge and outstanding orientation in the learning world."
            : "Hervorragend: sehr sicheres Wissen und starke Orientierung in der Lernwelt.";
    }
    if (score >= 1200 && ratio >= 0.6) {
        return isEnglish
            ? "Very good: you know many topics and often make the right choices."
            : "Sehr gut: du kennst viele Inhalte und triffst oft die richtigen Entscheidungen.";
    }
    if (score >= 700) {
        return isEnglish
            ? "Good start: the basics are there, and another run will push you further."
            : "Guter Anfang: die Grundlagen sitzen, mit einer weiteren Runde geht noch mehr.";
    }
    return isEnglish
        ? "Solid start: explore the stations again calmly to build more confidence."
        : "Solider Start: erkunde die Stationen in Ruhe noch einmal fur mehr Sicherheit.";
}

async function refreshLeaderboard() {
    const config = getSupabaseConfig();

    if (!config) {
        leaderboardEntries = [];
        renderLeaderboard(leaderboardEntries);
        return;
    }

    try {
        leaderboardEntries = await loadLeaderboardFromSupabase(config);
    } catch {
        leaderboardEntries = [];
    }

    renderLeaderboard(leaderboardEntries);
}

function setupLeaderboardOptIn() {
    if (!leaderboardOptInEl) return;

    leaderboardOptInEl.classList.remove("hidden");
    if (playerNameInput) {
        playerNameInput.value = "";
        playerNameInput.focus();
    }
    setLeaderboardStatus("");
}

async function endGame(reason) {
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
    resultMetaEl.textContent = isEnglish
        ? `Correct answers: ${state.correct}/${total} · Remaining lives: ${state.lives}/${MAX_LIVES}`
        : `Richtige Antworten: ${state.correct}/${total} · Verbleibende Leben: ${state.lives}/${MAX_LIVES}`;
    resultTextEl.textContent = isEnglish
        ? `${state.finishReason} Score: ${formatPoints(state.score)}. Correct answers: ${state.correct}/${total} (${percent}%). Best streak: x${state.maxStreak}. High score: ${formatPoints(state.highscore)}.`
        : `${state.finishReason} Score: ${formatPoints(state.score)}. Richtige Antworten: ${state.correct}/${total} (${percent}%). Beste Serie: x${state.maxStreak}. Highscore: ${formatPoints(state.highscore)}.`;

    startHighscoreEl.textContent = formatPoints(state.highscore);

    questionModalEl.classList.add("hidden");
    setPseudoFullscreen(false);
    updateFullscreenButtonLabel();
    gamePanelEl.classList.add("hidden");
    resultEl.classList.remove("hidden");
    setupLeaderboardOptIn();
    renderLeaderboard(leaderboardEntries);
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
            void endGame(isEnglish ? "Time is up." : "Zeit abgelaufen.");
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
    const elapsedSeconds = timestamp / 1000;

    const gateBlocksInput = mobileFullscreenGateEl && !mobileFullscreenGateEl.classList.contains("hidden");
    const jumpAnimating = updateJumpAnimation(timestamp);
    if (!state.questionOpen && !gateBlocksInput) {
        if (!jumpAnimating) {
            movePlayer(delta);
        }
        updateStations(delta, elapsedSeconds);
        updatePowerups(delta);
        consumeStationDeadline(delta);
        updateActionFlow(delta);
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
    spawnPowerups();
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
    if (leaderboardOptInEl) leaderboardOptInEl.classList.add("hidden");
    setLeaderboardStatus("");
    setInteractButtonState(false);
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
    void refreshLeaderboard();
}

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);
laterButton.addEventListener("click", () => {
    if (!state) return;
    closeQuestion();
});

if (saveLeaderboardButton) {
    saveLeaderboardButton.addEventListener("click", async () => {
        if (!state || !leaderboardOptInEl) return;

        const name = playerNameInput?.value?.trim() || (isEnglish ? "Anonymous" : "Anonym");
        const optimisticEntries = normalizeLeaderboard([...leaderboardEntries, { name, score: state.score }]);
        leaderboardEntries = optimisticEntries;
        renderLeaderboard(leaderboardEntries);

        const config = getSupabaseConfig();
        if (!config) {
            leaderboardOptInEl.classList.add("hidden");
            setLeaderboardStatus(isEnglish ? "Saved locally (Supabase configuration missing)." : "Lokal gespeichert (Supabase-Konfiguration fehlt).", false);
            return;
        }

        saveLeaderboardButton.disabled = true;
        setLeaderboardStatus(isEnglish ? "Saving entry ..." : "Speichere Eintrag ...", false);

        try {
            leaderboardEntries = await saveLeaderboardToSupabase(config, name, state.score);
            renderLeaderboard(leaderboardEntries);
            leaderboardOptInEl.classList.add("hidden");
            setLeaderboardStatus(isEnglish ? "Entry saved successfully." : "Eintrag erfolgreich gespeichert.", false);
        } catch {
            setLeaderboardStatus(isEnglish ? "Server unreachable: entry shown locally only." : "Server nicht erreichbar: Eintrag nur lokal angezeigt.", true);
        } finally {
            saveLeaderboardButton.disabled = false;
        }
    });
}

if (skipLeaderboardButton && leaderboardOptInEl) {
    skipLeaderboardButton.addEventListener("click", () => {
        leaderboardOptInEl.classList.add("hidden");
    });
}

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

    if (event.code === "Enter" || event.code === "Space") {
        event.preventDefault();
        tryJump();
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

if (interactButton) {
    interactButton.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        tryOpenNearbyStation();
    });

    interactButton.addEventListener("click", () => {
        tryOpenNearbyStation();
    });
}


if (jumpButton) {
    jumpButton.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        tryJump();
    });

    jumpButton.addEventListener("click", () => {
        tryJump();
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
