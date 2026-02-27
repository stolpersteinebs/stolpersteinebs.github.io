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
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

const fallbackFoods = {
    kosherFoods: [
        { name: "Apfel", image: "images/koschere/apple.png" },
        { name: "Karotte", image: "images/koschere/carrot.png" }
    ],
    nonKosherFoods: [
        { name: "Schweinesteak", image: "images/nicht-koschere/Schweinesteak.png" }
    ]
};

const powerupTypes = [
    { key: "shield", label: "Schutz", icon: "🛡️", colorClass: "powerup-shield" },
    { key: "slow", label: "Zeitlupe", icon: "⏱️", colorClass: "powerup-slow" },
    { key: "double", label: "Doppel-Punkte", icon: "✨", colorClass: "powerup-double" }
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

function getStoredLeaderboard() {
    try {
        const parsed = JSON.parse(localStorage.getItem("koscher_leaderboard") || "[]");
        return Array.isArray(parsed)
            ? parsed.map((score) => Number(score)).filter((score) => Number.isFinite(score))
            : [];
    } catch {
        return [];
    }
}

function saveLeaderboard(score) {
    const leaderboard = getStoredLeaderboard();
    leaderboard.push(score);
    leaderboard.sort((a, b) => b - a);

    const topScores = leaderboard.slice(0, leaderboardSize);
    try {
        localStorage.setItem("koscher_leaderboard", JSON.stringify(topScores));
    } catch {
        // Ignorieren: Bestenliste bleibt dann nur für die Sitzung sichtbar.
    }

    renderLeaderboard(topScores);
}

function renderLeaderboard(scores = getStoredLeaderboard()) {
    leaderboardList.innerHTML = "";

    if (scores.length === 0) {
        const emptyItem = document.createElement("li");
        emptyItem.textContent = "Noch keine Einträge";
        leaderboardList.appendChild(emptyItem);
        return;
    }

    scores.slice(0, leaderboardSize).forEach((score, index) => {
        const item = document.createElement("li");
        item.textContent = `${index + 1}. Platz: ${score} Punkte`;
        leaderboardList.appendChild(item);
    });
}

function createInitialState() {
    return {
        running: true,
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
    const isKosher = Math.random() < 0.65;
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
        activatePowerup(item.powerupType);
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

function updatePlayer(deltaSeconds) {
    const move = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
    if (move === 0) return;

    state.playerX += move * playerSpeed * deltaSeconds;
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
    statusDisplay.classList.add("hidden");

    if (state.score > state.highscore) {
        state.highscore = state.score;
        persistHighscore(state.highscore);
    }

    saveLeaderboard(state.score);
    updateHUD();
    resultText.textContent = `${reason} Dein Ergebnis: ${state.score} Punkte.`;
    gameOverScreen.classList.remove("hidden");
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

    startScreen.classList.add("hidden");
    gameOverScreen.classList.add("hidden");
    statusDisplay.classList.add("hidden");

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

restartButton.addEventListener("click", startGame);
startButton.addEventListener("click", startGame);

bindButtonHold(leftBtn, "left");
bindButtonHold(rightBtn, "right");
bindTouchFieldControl();

window.addEventListener("resize", () => {
    if (!state) {
        centerPlayerIdle();
        return;
    }
    state.playerX = clamp(state.playerX, 0, gameWidth() - playerWidth);
    positionPlayer();
});

renderIdleHUD();
renderLeaderboard();
centerPlayerIdle();
