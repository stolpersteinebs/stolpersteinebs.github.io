const game = document.getElementById("game");
const player = document.getElementById("player");
const scoreDisplay = document.getElementById("score");
const gameOverScreen = document.getElementById("gameOver");

let score = 0;
let gameRunning = true;

let koscherFoods = ["🍎", "🥕", "🍞", "🐟"];
let nichtKoscherFoods = ["🐷", "🍤", "🦐"];

document.addEventListener("keydown", movePlayer);

function movePlayer(e) {
    let left = player.offsetLeft;

    if (e.key === "ArrowLeft" && left > 0) {
        player.style.left = left - 20 + "px";
    }

    if (e.key === "ArrowRight" && left < 360) {
        player.style.left = left + 20 + "px";
    }
}

function createItem() {
    if (!gameRunning) return;

    const item = document.createElement("div");
    item.classList.add("item");

    let isKoscher = Math.random() > 0.5;
    let food;

    if (isKoscher) {
        food = koscherFoods[Math.floor(Math.random() * koscherFoods.length)];
        item.dataset.koscher = "true";
    } else {
        food = nichtKoscherFoods[Math.floor(Math.random() * nichtKoscherFoods.length)];
        item.dataset.koscher = "false";
    }

    item.textContent = food;
    item.style.left = Math.random() * 360 + "px";

    game.appendChild(item);

    let fallInterval = setInterval(() => {
        if (!gameRunning) {
            clearInterval(fallInterval);
            return;
        }

        item.style.top = item.offsetTop + 5 + "px";

        // Kollision prüfen
        if (
            item.offsetTop > 440 &&
            item.offsetLeft < player.offsetLeft + 40 &&
            item.offsetLeft + 30 > player.offsetLeft
        ) {
            if (item.dataset.koscher === "true") {
                score++;
                scoreDisplay.textContent = score;
            } else {
                endGame();
            }
            item.remove();
            clearInterval(fallInterval);
        }

        // Wenn unten angekommen
        if (item.offsetTop > 500) {
            item.remove();
            clearInterval(fallInterval);
        }

    }, 30);
}

function endGame() {
    gameRunning = false;
    gameOverScreen.classList.remove("hidden");
}

function restartGame() {
    score = 0;
    scoreDisplay.textContent = score;
    gameRunning = true;
    gameOverScreen.classList.add("hidden");

    document.querySelectorAll(".item").forEach(item => item.remove());
}

setInterval(createItem, 1000);
