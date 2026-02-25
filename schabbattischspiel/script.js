const order = [
    {
        id: "tischdecke",
        label: "🕊️ Tischdecke",
        hint: "Zuerst wird der Tisch vorbereitet: Eine saubere Tischdecke bildet die Grundlage."
    },
    {
        id: "kerzenstaender",
        label: "🕯️ Kerzen und Kerzenständer",
        hint: "Vor Sonnenuntergang stehen die Schabbatkerzen bereit."
    },
    {
        id: "kidduschbecher",
        label: "🍷 Kidduschbecher",
        hint: "Der Becher für den Kiddusch wird als Nächstes bereitgestellt."
    },
    {
        id: "wein",
        label: "🍇 Wein oder Traubensaft",
        hint: "Nun kommt das Getränk für den Kiddusch dazu."
    },
    {
        id: "challa",
        label: "🍞 Zwei Challot mit Tuch",
        hint: "Die beiden Challot werden bedeckt auf den Tisch gelegt."
    },
    {
        id: "familienbuch",
        label: "📖 Siddur oder Liederheft",
        hint: "Zum Abschluss sind Gebetbuch oder Liederheft griffbereit."
    }
];

const tray = document.getElementById("tray");
const table = document.getElementById("table");
const feedback = document.getElementById("feedback");
const hint = document.getElementById("hint");
const scoreEl = document.getElementById("score");
const stepEl = document.getElementById("step");
const totalEl = document.getElementById("total");
const mistakesEl = document.getElementById("mistakes");
const restartButton = document.getElementById("restartButton");

let placedCount = 0;
let score = 0;
let mistakes = 0;
let available = [];

totalEl.textContent = String(order.length);

function shuffle(list) {
    const copy = [...list];
    for (let i = copy.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function updateHud() {
    scoreEl.textContent = String(score);
    mistakesEl.textContent = String(mistakes);
    stepEl.textContent = String(Math.min(placedCount + 1, order.length));
}

function setFeedback(text, type) {
    feedback.textContent = text;
    feedback.classList.remove("ok", "bad");
    if (type) {
        feedback.classList.add(type);
    }
}

function renderTray() {
    tray.innerHTML = "";
    available.forEach((item) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "item";
        button.textContent = item.label;
        button.setAttribute("aria-label", `${item.label} auswählen`);
        button.addEventListener("click", () => chooseItem(item.id));
        tray.appendChild(button);
    });
}

function chooseItem(id) {
    const expected = order[placedCount];

    if (!expected) {
        return;
    }

    if (id === expected.id) {
        placedCount += 1;
        score += 100;
        available = available.filter((item) => item.id !== id);

        const placed = document.createElement("div");
        placed.className = "item correct";
        placed.textContent = `${placedCount}. ${expected.label}`;
        table.appendChild(placed);

        hint.textContent = expected.hint;
        setFeedback("Richtig! Der Gegenstand passt in die Reihenfolge.", "ok");

        if (placedCount === order.length) {
            stepEl.textContent = String(order.length);
            hint.textContent = "Fertig! Dein Schabbat-Tisch ist vorbereitet. Schabbat Schalom!";
            setFeedback("🎉 Geschafft! Du hast alle Gegenstände in die richtige Reihenfolge gebracht.", "ok");
        }
    } else {
        mistakes += 1;
        score = Math.max(0, score - 20);
        setFeedback("Noch nicht. Überlege, was traditionell zuerst vorbereitet wird.", "bad");
    }

    updateHud();
    renderTray();
}

function resetGame() {
    placedCount = 0;
    score = 0;
    mistakes = 0;
    available = shuffle(order);

    table.innerHTML = "";
    hint.textContent = "Tipp: Man beginnt mit der Grundlage des Tisches.";
    setFeedback("Wähle den ersten Gegenstand.", "");

    updateHud();
    renderTray();
}

restartButton.addEventListener("click", resetGame);

resetGame();
