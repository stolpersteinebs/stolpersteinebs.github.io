const game = document.getElementById("game");
const player = document.getElementById("player");
const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");
const levelDisplay = document.getElementById("level");
const highscoreDisplay = document.getElementById("highscore");
const statusDisplay = document.getElementById("status");
const startScreen = document.getElementById("startScreen");
const startButton = document.getElementById("startButton");
const gameOverScreen = document.getElementById("gameOver");
const resultText = document.getElementById("resultText");
const restartButton = document.getElementById("restartButton");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

const kosherFoods = ["🍎", "🥕", "🍞", "🐟", "🫒", "🍇", "🥔"];
const nonKosherFoods = ["🐷", "🍤", "🦐", "🦀", "🐙"];

const playerWidth = 44;
const playerSpeed = 340; // px/s
const itemWidth = 34;

const keys = {
    left: false,
    right: false
};

let state = null;
let loopId = null;
let lastTime = 0;
let statusTimeoutId = null;
let activeTouchId = null;

function getStoredHighscore() {
    return Number(localStorage.getItem("koscher_highscore") || 0);
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
        highscore: getStoredHighscore()
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

function updateHUD() {
    if (!state) return;
    scoreDisplay.textContent = String(state.score);
    livesDisplay.textContent = String(state.lives);
    levelDisplay.textContent = String(state.level);
    highscoreDisplay.textContent = String(state.highscore);
}

function renderIdleHUD() {
    scoreDisplay.textContent = "0";
    livesDisplay.textContent = "3";
    levelDisplay.textContent = "1";
    highscoreDisplay.textContent = String(getStoredHighscore());
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
    // Mit steigendem Level schneller, aber nie unter 420ms.
    return Math.max(420, 1000 - (state.level - 1) * 80);
}

function currentFallSpeed() {
    return 120 + (state.level - 1) * 22;
}

function spawnItem() {
    const itemEl = document.createElement("div");
    itemEl.className = "item";

    const isKosher = Math.random() < 0.65;
    const foodList = isKosher ? kosherFoods : nonKosherFoods;
    const x = Math.random() * (gameWidth() - itemWidth);
    const y = -40;

    itemEl.textContent = foodList[Math.floor(Math.random() * foodList.length)];
    itemEl.dataset.kosher = isKosher ? "true" : "false";
    itemEl.style.transform = `translate(${x}px, ${y}px)`;
    game.appendChild(itemEl);

    state.items.push({
        el: itemEl,
        x,
        y,
        isKosher
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

function handleCatch(item, index) {
    if (item.isKosher) {
        state.score += 1;
        setStatus("+1 Koscher!", "normal");
    } else {
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
    if (item.isKosher) {
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
    if (activeTouchId !== null) return;

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

    updatePlayer(deltaSeconds);
    updateSpawn(deltaSeconds);
    updateItems(deltaSeconds);

    loopId = window.requestAnimationFrame(gameLoop);
}

function endGame(reason) {
    state.running = false;
    keys.left = false;
    keys.right = false;
    activeTouchId = null;

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
        localStorage.setItem("koscher_highscore", String(state.highscore));
    }

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
    activeTouchId = null;

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
    const movePlayerToTouchX = (touchX) => {
        const gameRect = game.getBoundingClientRect();
        const relativeX = touchX - gameRect.left;
        state.playerX = clamp(relativeX - playerWidth / 2, 0, gameRect.width - playerWidth);
        positionPlayer();
    };

    const findTouchById = (touches, id) => {
        for (let i = 0; i < touches.length; i += 1) {
            if (touches[i].identifier === id) return touches[i];
        }
        return null;
    };

    const onTouchStart = (event) => {
        if (!state || !state.running) return;
        if (event.target.closest("button")) return;

        const touch = event.changedTouches[0];
        if (!touch) return;

        event.preventDefault();
        activeTouchId = touch.identifier;
        keys.left = false;
        keys.right = false;
        movePlayerToTouchX(touch.clientX);
    };

    const onTouchMove = (event) => {
        if (!state || !state.running || activeTouchId === null) return;
        event.preventDefault();

        const activeTouch = findTouchById(event.touches, activeTouchId);
        if (!activeTouch) return;

        movePlayerToTouchX(activeTouch.clientX);
    };

    const onTouchEnd = (event) => {
        if (activeTouchId === null) return;

        const endedTouch = findTouchById(event.changedTouches, activeTouchId);
        if (!endedTouch) return;

        activeTouchId = null;
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
centerPlayerIdle();
