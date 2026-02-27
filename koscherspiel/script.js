const game = document.getElementById("game");
const player = document.getElementById("player");
const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");
const levelDisplay = document.getElementById("level");
const highscoreDisplay = document.getElementById("highscore");
const powerupStateDisplay = document.getElementById("powerupState");
const leaderboardList = document.getElementById("leaderboardList");
const statusDisplay = document.getElementById("status");
const startScreen = document.getElementById("startScreen");
const startButton = document.getElementById("startButton");
const gameOverScreen = document.getElementById("gameOver");
const resultText = document.getElementById("resultText");
const restartButton = document.getElementById("restartButton");
const leaderboardOptIn = document.getElementById("leaderboardOptIn");
const playerNameInput = document.getElementById("playerName");
const saveLeaderboardButton = document.getElementById("saveLeaderboardButton");
const skipLeaderboardButton = document.getElementById("skipLeaderboardButton");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

const fallbackFoods = {
    kosherFoods: [
        { name: "Apfel", image: "images/koschere/apple.png" },
        { name: "Karotte", image: "images/koschere/carrot.png" },
        { name: "Brokkoli", image: "images/koschere/Brokkoli.png" },
    ],
    nonKosherFoods: [
        { name: "Schweinesteak", image: "images/nicht-koschere/Schweinesteak.png" }
    ]
};

const powerupTypes = [
    { key: "shield", label: "Schutz", icon: "🛡️", colorClass: "powerup-shield" },
    { key: "slow", label: "Zeitlupe", icon: "⏱️", colorClass: "powerup-slow" },
    { key: "double", label: "Doppel-Punkte", icon: "✨", colorClass: "powerup-double" },
    { key: "life", label: "Extra-Leben", icon: "❤️", colorClass: "powerup-life" }
];

function readFoodData() {
    const foodDataElement = document.getElementById("foodData");

    if (!foodDataElement) {
        return fallbackFoods;
    }

    try {
        const parsed = JSON.parse(foodDataElement.textContent);

        if (!Array.isArray(parsed.kosherFoods) || !Array.isArray(parsed.nonKosherFoods)) {
            return fallbackFoods;
        }

        const kosherFoods = parsed.kosherFoods.filter((food) => food && food.image);
        const nonKosherFoods = parsed.nonKosherFoods.filter((food) => food && food.image);

        if (kosherFoods.length === 0 || nonKosherFoods.length === 0) {
            return fallbackFoods;
        }

        return { kosherFoods, nonKosherFoods };
    } catch {
        return fallbackFoods;
    }
}

const { kosherFoods, nonKosherFoods } = readFoodData();

const playerWidth = 52;
const playerSpeed = 340;
const itemWidth = 40;
const powerupDurationMs = 6000;
const leaderboardSize = 5;
const maxLevel = 10;
const defaultLeaderboardApiPath = "/api/koscher-leaderboard.php";

const keys = {
    left: false,
    right: false
};

let state = null;
let loopId = null;
let lastTime = 0;
let statusTimeoutId = null;

function getStoredHighscore() {
    try {
        return Number(localStorage.getItem("koscher_highscore") || 0);
    } catch {
        return 0;
    }
}

function persistHighscore(value) {
    try {
        localStorage.setItem("koscher_highscore", String(value));
    } catch {
        // Ignorieren: Spiel soll auch ohne localStorage funktionieren.
    }
}

function normalizeLeaderboard(rawEntries) {
    if (!Array.isArray(rawEntries)) {
        return [];
    }

    const normalizedEntries = rawEntries
        .map((entry) => {
            if (typeof entry === "number") {
                return { name: "Anonym", score: entry };
            }

            if (!entry || typeof entry !== "object") {
                return null;
            }

            const score = Number(entry.score);
            if (!Number.isFinite(score)) {
                return null;
            }

            const trimmedName = typeof entry.name === "string" ? entry.name.trim() : "";
            return {
                name: trimmedName || "Anonym",
                score
            };
        })
        .filter(Boolean);

    const bestScoresByName = new Map();

    normalizedEntries.forEach((entry) => {
        const key = entry.name.toLocaleLowerCase("de-DE");
        const existing = bestScoresByName.get(key);

        if (!existing || entry.score > existing.score) {
            bestScoresByName.set(key, entry);
        }
    });

    return Array.from(bestScoresByName.values())
        .sort((a, b) => b.score - a.score)
        .slice(0, leaderboardSize);
}


function getEntriesFromPayload(payload) {
    if (Array.isArray(payload)) {
        return payload;
    }

    if (!payload || typeof payload !== "object") {
        return null;
    }

    if (Array.isArray(payload.entries)) {
        return payload.entries;
    }

    if (Array.isArray(payload.leaderboard)) {
        return payload.leaderboard;
    }

    if (Array.isArray(payload.scores)) {
        return payload.scores;
    }

    return null;
}

async function parseJsonSafely(response) {
    const raw = await response.text();

    if (!raw || !raw.trim()) {
        return null;
    }

    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

function getStoredLeaderboard() {
    try {
        const parsed = JSON.parse(localStorage.getItem("koscher_leaderboard") || "[]");
        return normalizeLeaderboard(parsed);
    } catch {
        return [];
    }
}

function persistLeaderboardLocally(scores) {
    try {
        localStorage.setItem("koscher_leaderboard", JSON.stringify(scores));
    } catch {
        // Ignorieren: Bestenliste bleibt dann nur temporär sichtbar.
    }
}

function getLeaderboardApiUrl() {
    const metaApiUrl = document
        .querySelector('meta[name="koscher-leaderboard-api"]')
        ?.getAttribute("content")
        ?.trim();

    if (metaApiUrl) {
        return metaApiUrl;
    }

    const fromWindow = typeof window.KOSCHER_LEADERBOARD_API_URL === "string"
        ? window.KOSCHER_LEADERBOARD_API_URL.trim()
        : "";

    if (fromWindow) {
        return fromWindow;
    }

    return defaultLeaderboardApiPath;
}

async function requestLeaderboard({ method, body }) {
    const apiUrl = getLeaderboardApiUrl();

    try {
        const response = await fetch(apiUrl, {
            method,
            headers: {
                "Accept": "application/json",
                ...(body ? { "Content-Type": "application/json" } : {})
            },
            ...(body ? { body: JSON.stringify(body) } : {})
        });

        if (!response.ok) {
            return { ok: false, payload: null, url: apiUrl };
        }

        const payload = await parseJsonSafely(response);
        return { ok: true, payload, url: apiUrl };
    } catch {
        return { ok: false, payload: null, url: apiUrl };
    }
}

async function loadLeaderboard() {
    const result = await requestLeaderboard({ method: "GET" });

    if (result.ok) {
        const serverEntries = getEntriesFromPayload(result.payload);
        const normalized = normalizeLeaderboard(serverEntries);

        if (normalized.length > 0) {
            persistLeaderboardLocally(normalized);
            renderLeaderboard(normalized);
            return;
        }
    }

    renderLeaderboard(getStoredLeaderboard());
}

async function saveLeaderboard(name, score) {
    const cleanedName = (name || "Anonym").trim() || "Anonym";
    const leaderboard = getStoredLeaderboard();
    leaderboard.push({ name: cleanedName, score });
    const topScores = normalizeLeaderboard(leaderboard);

    persistLeaderboardLocally(topScores);

    const result = await requestLeaderboard({
        method: "POST",
        body: { name: cleanedName, score }
    });

    if (result.ok) {
        const serverEntries = getEntriesFromPayload(result.payload);
        const normalized = normalizeLeaderboard(serverEntries);

        if (normalized.length > 0) {
            persistLeaderboardLocally(normalized);
            renderLeaderboard(normalized);
        } else {
            renderLeaderboard(topScores);
        }

        return { savedOnServer: true };
    }

    renderLeaderboard(topScores);
    return { savedOnServer: false };

}

function renderLeaderboard(scores = getStoredLeaderboard()) {
    if (!leaderboardList) return;

    leaderboardList.innerHTML = "";

    if (scores.length === 0) {
        const emptyItem = document.createElement("li");
        emptyItem.textContent = "Noch keine Einträge";
        leaderboardList.appendChild(emptyItem);
        return;
    }

    scores.slice(0, leaderboardSize).forEach((entry, index) => {
        const item = document.createElement("li");
        item.textContent = `${index + 1}. ${entry.name}: ${entry.score} Punkte`;
        leaderboardList.appendChild(item);
    });
}

function createInitialState() {
    return {
        running: true,
        leaderboardSubmitted: false,
        score: 0,
        lives: 3,
        level: 1,
        playerX: 0,
        spawnTimer: 0,
        items: [],
        highscore: getStoredHighscore(),
        activePowerups: {
            shield: 0,
            slow: 0,
            double: 0
        }
    };
}

function gameWidth() {
    return game.clientWidth;
}

function gameHeight() {
    return game.clientHeight;
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function activePowerupLabel() {
    if (!state) return "Keins";

    const now = Date.now();
    const active = powerupTypes
        .filter((type) => state.activePowerups[type.key] > now)
        .map((type) => type.label);

    return active.length > 0 ? active.join(", ") : "Keins";
}

function updateHUD() {
    if (!state) return;
    scoreDisplay.textContent = String(state.score);
    livesDisplay.textContent = String(state.lives);
    levelDisplay.textContent = String(state.level);
    highscoreDisplay.textContent = String(state.highscore);
    powerupStateDisplay.textContent = activePowerupLabel();
}

function renderIdleHUD() {
    scoreDisplay.textContent = "0";
    livesDisplay.textContent = "3";
    levelDisplay.textContent = "1";
    highscoreDisplay.textContent = String(getStoredHighscore());
    powerupStateDisplay.textContent = "Keins";
}

function setStatus(text, type = "normal") {
    if (!statusDisplay) return;

    statusDisplay.textContent = text;
    statusDisplay.classList.remove("hidden", "danger");

    if (type === "danger") {
        statusDisplay.classList.add("danger");
    }

    if (statusTimeoutId) {
        window.clearTimeout(statusTimeoutId);
    }

    statusTimeoutId = window.setTimeout(() => {
        statusDisplay.classList.add("hidden");
    }, 900);
}

function positionPlayer() {
    player.style.transform = `translate(${state.playerX}px, 0)`;
}

function centerPlayerIdle() {
    const centeredX = (gameWidth() - playerWidth) / 2;
    player.style.transform = `translate(${Math.max(0, centeredX)}px, 0)`;
}

function clearItems() {
    game.querySelectorAll(".item").forEach((itemEl) => itemEl.remove());
    if (state) {
        state.items = [];
    }
}

function currentSpawnInterval() {
    return Math.max(420, 1000 - (state.level - 1) * 80);
}

function hasPowerup(powerupKey) {
    return state.activePowerups[powerupKey] > Date.now();
}

function currentFallSpeed() {
    const baseSpeed = 120 + (state.level - 1) * 22;
    return hasPowerup("slow") ? baseSpeed * 0.68 : baseSpeed;
}

function spawnPowerup() {
    const type = powerupTypes[Math.floor(Math.random() * powerupTypes.length)];
    return {
        isPowerup: true,
        powerupType: type.key,
        className: `item powerup ${type.colorClass}`,
        icon: type.icon,
        label: type.label
    };
}

function spawnFood() {
    const isKosher = Math.random() < 0.82;
    const foodList = isKosher ? kosherFoods : nonKosherFoods;
    const selectedFood = foodList[Math.floor(Math.random() * foodList.length)];

    return {
        isPowerup: false,
        isKosher,
        className: "item",
        image: selectedFood.image,
        label: selectedFood.name
    };
}

function spawnItem() {
    const itemEl = document.createElement("div");
    const spawned = Math.random() < 0.12 ? spawnPowerup() : spawnFood();
    itemEl.className = spawned.className;

    const x = Math.random() * (gameWidth() - itemWidth);
    const y = -40;

    if (spawned.isPowerup) {
        itemEl.textContent = spawned.icon;
        itemEl.setAttribute("role", "img");
        itemEl.setAttribute("aria-label", spawned.label);
    } else {
        const img = document.createElement("img");
        img.src = spawned.image;
        img.alt = spawned.label;
        itemEl.appendChild(img);
    }

    itemEl.style.transform = `translate(${x}px, ${y}px)`;
    game.appendChild(itemEl);

    state.items.push({
        el: itemEl,
        x,
        y,
        isPowerup: spawned.isPowerup,
        powerupType: spawned.powerupType,
        isKosher: spawned.isKosher
    });
}

function intersects(a, b) {
    return !(
        a.x + a.width < b.x ||
        a.x > b.x + b.width ||
        a.y + a.height < b.y ||
        a.y > b.y + b.height
    );
}

function activatePowerup(powerupKey) {
    state.activePowerups[powerupKey] = Date.now() + powerupDurationMs;
    const powerup = powerupTypes.find((type) => type.key === powerupKey);
    setStatus(`Power-Up aktiv: ${powerup.label}`);
    updateHUD();
}

function consumeShieldIfActive() {
    if (!hasPowerup("shield")) {
        return false;
    }

    state.activePowerups.shield = 0;
    setStatus("Schutzschild hat dich gerettet!");
    updateHUD();
    return true;
}

function handleCatch(item, index) {
    if (item.isPowerup) {
        if (item.powerupType === "life") {
            state.lives += 1;
            setStatus("+1 Leben durch Power-Up!");
            updateHUD();
        } else {
            activatePowerup(item.powerupType);
        }
        removeItem(index);
        return;
    }

    if (item.isKosher) {
        const points = hasPowerup("double") ? 2 : 1;
        state.score += points;
        setStatus(`+${points} Koscher!`);
    } else if (!consumeShieldIfActive()) {
        state.lives -= 1;
        state.score = Math.max(0, state.score - 1);
        setStatus("-1 Leben: Nicht koscher!", "danger");
    }

    removeItem(index);
    recalcLevel();

    if (state.level >= maxLevel) {
        endGame("Geschafft! Du hast alle Level gemeistert.");
        return;
    }

    updateHUD();

    if (state.lives <= 0) {
        endGame("Keine Leben mehr.");
    }
}

function handleMissed(item, index) {
    if (!item.isPowerup && item.isKosher && !consumeShieldIfActive()) {
        state.lives -= 1;
        setStatus("Koscher verpasst!", "danger");
        updateHUD();
    }

    removeItem(index);

    if (state.lives <= 0) {
        endGame("Zu viele koschere Lebensmittel verpasst.");
    }
}

function removeItem(index) {
    const [removed] = state.items.splice(index, 1);
    if (removed) {
        removed.el.remove();
    }
}

function recalcLevel() {
    state.level = Math.floor(state.score / 8) + 1;
}

function currentPlayerSpeed() {
    if (!state) return playerSpeed;
    if (state.level < 5) return playerSpeed;
    return playerSpeed + (state.level - 4) * 28;
}

function updatePlayer(deltaSeconds) {
    const move = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
    if (move === 0) return;

    state.playerX += move * currentPlayerSpeed() * deltaSeconds;
    state.playerX = clamp(state.playerX, 0, gameWidth() - playerWidth);
    positionPlayer();
}

function updateItems(deltaSeconds) {
    const playerRect = {
        x: state.playerX,
        y: gameHeight() - 14 - 36,
        width: playerWidth,
        height: 36
    };

    for (let i = state.items.length - 1; i >= 0; i -= 1) {
        const item = state.items[i];
        item.y += currentFallSpeed() * deltaSeconds;
        item.el.style.transform = `translate(${item.x}px, ${item.y}px)`;

        const itemRect = {
            x: item.x,
            y: item.y,
            width: itemWidth,
            height: itemWidth
        };

        if (intersects(itemRect, playerRect)) {
            handleCatch(item, i);
            continue;
        }

        if (item.y > gameHeight()) {
            handleMissed(item, i);
        }
    }
}

function clearExpiredPowerups() {
    const now = Date.now();
    let changed = false;

    powerupTypes.forEach((type) => {
        if (state.activePowerups[type.key] > 0 && state.activePowerups[type.key] <= now) {
            state.activePowerups[type.key] = 0;
            changed = true;
        }
    });

    if (changed) {
        updateHUD();
    }
}

function updateSpawn(deltaSeconds) {
    state.spawnTimer += deltaSeconds * 1000;
    const interval = currentSpawnInterval();

    if (state.spawnTimer >= interval) {
        state.spawnTimer = 0;
        spawnItem();
    }
}

function gameLoop(timestamp) {
    if (!state.running) return;

    if (!lastTime) lastTime = timestamp;
    const deltaSeconds = Math.min((timestamp - lastTime) / 1000, 0.033);
    lastTime = timestamp;

    clearExpiredPowerups();
    updatePlayer(deltaSeconds);
    updateSpawn(deltaSeconds);
    updateItems(deltaSeconds);

    loopId = window.requestAnimationFrame(gameLoop);
}

function endGame(reason) {
    state.running = false;
    keys.left = false;
    keys.right = false;

    if (loopId) {
        window.cancelAnimationFrame(loopId);
        loopId = null;
    }

    if (statusTimeoutId) {
        window.clearTimeout(statusTimeoutId);
        statusTimeoutId = null;
    }
    if (statusDisplay) statusDisplay.classList.add("hidden");

    if (state.score > state.highscore) {
        state.highscore = state.score;
        persistHighscore(state.highscore);
    }

    if (leaderboardOptIn) {
        if (state.score > 0) {
            leaderboardOptIn.classList.remove("hidden");
        } else {
            leaderboardOptIn.classList.add("hidden");
        }
    }

    updateHUD();
    if (resultText) resultText.textContent = `${reason} Dein Ergebnis: ${state.score} Punkte.`;
    if (gameOverScreen) gameOverScreen.classList.remove("hidden");
}

function startGame() {
    if (loopId) {
        window.cancelAnimationFrame(loopId);
        loopId = null;
    }
    if (statusTimeoutId) {
        window.clearTimeout(statusTimeoutId);
        statusTimeoutId = null;
    }

    clearItems();
    state = createInitialState();
    updateHUD();

    if (startScreen) startScreen.classList.add("hidden");
    if (gameOverScreen) gameOverScreen.classList.add("hidden");
    if (leaderboardOptIn) leaderboardOptIn.classList.add("hidden");
    if (playerNameInput) {
        playerNameInput.value = "";
        playerNameInput.disabled = false;
    }
    if (saveLeaderboardButton) saveLeaderboardButton.disabled = false;
    if (skipLeaderboardButton) skipLeaderboardButton.disabled = false;
    if (statusDisplay) statusDisplay.classList.add("hidden");

    state.playerX = (gameWidth() - playerWidth) / 2;
    positionPlayer();

    lastTime = 0;
    loopId = window.requestAnimationFrame(gameLoop);
}

function setDirection(direction, active) {
    if (!state || !state.running) return;
    keys[direction] = active;
}

function bindButtonHold(button, direction) {
    const down = (event) => {
        event.preventDefault();
        setDirection(direction, true);
    };
    const up = (event) => {
        event.preventDefault();
        setDirection(direction, false);
    };

    button.addEventListener("pointerdown", down);
    button.addEventListener("pointerup", up);
    button.addEventListener("pointerleave", up);
    button.addEventListener("pointercancel", up);

    button.addEventListener("touchstart", down, { passive: false });
    button.addEventListener("touchend", up, { passive: false });
    button.addEventListener("touchcancel", up, { passive: false });
}

function bindTouchFieldControl() {
    const touchToDirection = (touchX) => {
        const gameRect = game.getBoundingClientRect();
        const relativeX = touchX - gameRect.left;
        return relativeX < gameRect.width / 2 ? "left" : "right";
    };

    const onTouchStart = (event) => {
        if (!state || !state.running) return;
        if (event.target.closest("button")) return;

        event.preventDefault();
        const direction = touchToDirection(event.touches[0].clientX);
        keys.left = direction === "left";
        keys.right = direction === "right";
    };

    const onTouchMove = (event) => {
        if (!state || !state.running) return;
        event.preventDefault();

        const direction = touchToDirection(event.touches[0].clientX);
        keys.left = direction === "left";
        keys.right = direction === "right";
    };

    const onTouchEnd = () => {
        keys.left = false;
        keys.right = false;
    };

    game.addEventListener("touchstart", onTouchStart, { passive: false });
    game.addEventListener("touchmove", onTouchMove, { passive: false });
    game.addEventListener("touchend", onTouchEnd);
    game.addEventListener("touchcancel", onTouchEnd);
}

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        setDirection("left", true);
    }
    if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        setDirection("right", true);
    }
});

document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        setDirection("left", false);
    }
    if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        setDirection("right", false);
    }
});

if (restartButton) {
    restartButton.addEventListener("click", startGame);
}
if (startButton) {
    startButton.addEventListener("click", startGame);
}

if (saveLeaderboardButton && skipLeaderboardButton && playerNameInput && leaderboardOptIn) {
    saveLeaderboardButton.addEventListener("click", async () => {
        if (!state) return;
        if (state.leaderboardSubmitted) return;

        state.leaderboardSubmitted = true;
        saveLeaderboardButton.disabled = true;
        skipLeaderboardButton.disabled = true;
        playerNameInput.disabled = true;
        const playerName = playerNameInput.value.trim();
        const result = await saveLeaderboard(playerName || "Anonym", state.score);
        leaderboardOptIn.classList.add("hidden");

        if (result.savedOnServer) {
            setStatus("In die Server-Bestenliste eingetragen!");
            return;
        }

        const apiUrl = getLeaderboardApiUrl();
        setStatus(`Server nicht erreicht (${apiUrl}) – lokal eingetragen.`, "danger");
    });

    skipLeaderboardButton.addEventListener("click", () => {
        if (!state || state.leaderboardSubmitted) return;

        state.leaderboardSubmitted = true;
        saveLeaderboardButton.disabled = true;
        skipLeaderboardButton.disabled = true;
        playerNameInput.disabled = true;
        leaderboardOptIn.classList.add("hidden");
    });
}

if (leftBtn) {
    bindButtonHold(leftBtn, "left");
}
if (rightBtn) {
    bindButtonHold(rightBtn, "right");
}
if (game) {
    bindTouchFieldControl();
}

window.addEventListener("resize", () => {
    if (!state) {
        centerPlayerIdle();
        return;
    }
    state.playerX = clamp(state.playerX, 0, gameWidth() - playerWidth);
    positionPlayer();
});

renderIdleHUD();
loadLeaderboard();
centerPlayerIdle();
