const quizData = [
    {
        question: "Wann beginnt der Schabbat traditionell?",
        answers: ["Freitagabend", "Samstagmorgen", "Sonntagabend", "Montagmorgen"],
        correctIndex: 0,
        explanation: "Der Schabbat beginnt am Freitagabend bei Sonnenuntergang."
    },
    {
        question: "Welches Fest erinnert an den Auszug aus Ägypten?",
        answers: ["Rosch ha-Schana", "Pessach", "Purim", "Sukkot"],
        correctIndex: 1,
        explanation: "Pessach erinnert an den Auszug der Israeliten aus Ägypten."
    },
    {
        question: "Wie heißt der Leuchter für Chanukka mit neun Lichtern?",
        answers: ["Menora", "Chanukkia", "Ner Tamid", "Magen David"],
        correctIndex: 1,
        explanation: "Die Chanukkia hat neun Lichter: acht plus Dienerlicht (Schamasch)."
    },
    {
        question: "Was bedeutet 'koscher' im Kontext von Lebensmitteln?",
        answers: [
            "Scharf gewürzt",
            "Regional angebaut",
            "Nach religiösen Speisegesetzen erlaubt",
            "Nur vegetarisch"
        ],
        correctIndex: 2,
        explanation: "Koscher heißt, dass Lebensmittel den jüdischen Speisegesetzen entsprechen."
    },
    {
        question: "Was wird an Rosch ha-Schana gefeiert?",
        answers: ["Das jüdische Neujahr", "Das Ende des Winters", "Die Ernte", "Ein Fastentag"],
        correctIndex: 0,
        explanation: "Rosch ha-Schana ist das jüdische Neujahrsfest."
    },
    {
        question: "Welcher Tag ist besonders mit Fasten und Versöhnung verbunden?",
        answers: ["Purim", "Jom Kippur", "Pessach", "Lag baOmer"],
        correctIndex: 1,
        explanation: "Jom Kippur gilt als wichtiger Versöhnungs- und Fastentag."
    },
    {
        question: "Wofür ist Purim bekannt?",
        answers: [
            "Für den Auszug aus Ägypten",
            "Für die Rettung der Juden in der Esther-Erzählung",
            "Für das Wochenfest",
            "Für den Schofar am Neujahr"
        ],
        correctIndex: 1,
        explanation: "Purim erinnert an die Rettung aus der Esther-Geschichte."
    },
    {
        question: "In welcher Sprache ist die Tora traditionell geschrieben?",
        answers: ["Aramäisch", "Latein", "Hebräisch", "Arabisch"],
        correctIndex: 2,
        explanation: "Die Tora liegt traditionell in hebräischer Sprache vor."
    },
    {
        question: "Was ist eine Synagoge?",
        answers: [
            "Ein Feiertagsgericht",
            "Ein jüdisches Gotteshaus",
            "Ein Musikinstrument",
            "Ein Pilgerweg"
        ],
        correctIndex: 1,
        explanation: "Die Synagoge ist ein Ort für Gebet, Lernen und Gemeinschaft."
    },
    {
        question: "Welcher Wochentag ist im Judentum der Ruhetag?",
        answers: ["Donnerstag", "Freitag", "Samstag (Schabbat)", "Sonntag"],
        correctIndex: 2,
        explanation: "Der Ruhetag ist der Schabbat."
    }
];

const QUESTION_TIME = 20;
const BASE_POINTS = 100;
const TIME_BONUS_FACTOR = 5;

const numberFormatter = new Intl.NumberFormat("de-DE");

const currentQuestionEl = document.getElementById("currentQuestion");
const totalQuestionsEl = document.getElementById("totalQuestions");
const scoreEl = document.getElementById("score");
const streakEl = document.getElementById("streak");
const timeLeftEl = document.getElementById("timeLeft");
const timeBarEl = document.getElementById("timeBar");
const questionTextEl = document.getElementById("questionText");
const answersEl = document.getElementById("answers");
const feedbackEl = document.getElementById("feedback");
const comboTextEl = document.getElementById("comboText");
const nudgeTextEl = document.getElementById("nudgeText");
const nextButton = document.getElementById("nextButton");
const resultEl = document.getElementById("result");
const resultTextEl = document.getElementById("resultText");
const restartButton = document.getElementById("restartButton");
const startScreenEl = document.getElementById("startScreen");
const startButton = document.getElementById("startButton");
const statusEl = document.querySelector(".status");
const timeTrackEl = document.querySelector(".time-track");
const timePillEl = document.querySelector(".time-pill");
const quizCardEl = document.querySelector(".quiz-card");
const soundToggleButton = document.getElementById("soundToggle");
const scoreWheelEl = document.getElementById("scoreWheel");
const scoreWheelValueEl = document.getElementById("scoreWheelValue");
const scoreMottoEl = document.getElementById("scoreMotto");

const idleNudges = [
    "Weiter so, nächste Frage wartet.",
    "Dranbleiben, du hast einen guten Lauf.",
    "Nur noch ein Klick zur nächsten Runde."
];

let quiz = [];
let index = 0;
let score = 0;
let correctAnswers = 0;
let streak = 0;
let maxStreak = 0;
let timeLeft = QUESTION_TIME;
let answered = false;
let timerId = null;
let nudgeTimeoutId = null;
let wheelAnimId = null;
let wheelTickId = null;
let audioCtx = null;
let soundEnabled = localStorage.getItem("feiertagsquiz_sound") !== "off";

function formatScore(value) {
    return numberFormatter.format(Math.max(0, Math.round(value)));
}

function shuffle(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function buildQuestionSet() {
    return shuffle(quizData).slice(0, 10);
}

function getAudioContext() {
    if (audioCtx) return audioCtx;
    const AudioClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioClass) return null;
    audioCtx = new AudioClass();
    return audioCtx;
}

function unlockAudio() {
    const ctx = getAudioContext();
    if (!ctx || !soundEnabled) return;
    if (ctx.state === "suspended") {
        ctx.resume().catch(() => {});
    }
}

function playTone(freq, duration, type = "sine", volume = 0.03, delay = 0) {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === "suspended") return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const start = ctx.currentTime + delay;
    const end = start + duration;

    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, end);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(end + 0.02);
}

function playSound(name) {
    if (!soundEnabled) return;
    switch (name) {
        case "tap":
            playTone(530, 0.04, "square", 0.02);
            break;
        case "next":
            playTone(450, 0.05, "triangle", 0.025);
            break;
        case "correct":
            playTone(640, 0.08, "sine", 0.03, 0);
            playTone(840, 0.11, "sine", 0.03, 0.07);
            break;
        case "combo":
            playTone(740, 0.05, "triangle", 0.025, 0);
            playTone(980, 0.07, "triangle", 0.025, 0.05);
            playTone(1240, 0.09, "triangle", 0.025, 0.11);
            break;
        case "wrong":
            playTone(210, 0.18, "sawtooth", 0.035);
            break;
        case "timeout":
            playTone(220, 0.09, "square", 0.03, 0);
            playTone(180, 0.12, "square", 0.03, 0.08);
            break;
        case "hurry":
            playTone(980, 0.03, "square", 0.014);
            break;
        case "wheelTick":
            playTone(760, 0.018, "square", 0.009);
            break;
        case "rankLow":
            playTone(430, 0.12, "sine", 0.03, 0);
            playTone(560, 0.15, "sine", 0.03, 0.1);
            break;
        case "rankMid":
            playTone(520, 0.1, "triangle", 0.03, 0);
            playTone(660, 0.12, "triangle", 0.03, 0.1);
            playTone(820, 0.14, "triangle", 0.03, 0.2);
            break;
        case "rankHigh":
            playTone(620, 0.1, "sine", 0.03, 0);
            playTone(820, 0.12, "sine", 0.03, 0.08);
            playTone(1020, 0.14, "sine", 0.03, 0.16);
            playTone(1320, 0.18, "sine", 0.035, 0.25);
            break;
    }
}

function syncSoundToggleUI() {
    soundToggleButton.classList.toggle("off", !soundEnabled);
    soundToggleButton.setAttribute("aria-pressed", soundEnabled ? "true" : "false");
    soundToggleButton.textContent = soundEnabled ? "Sound: An" : "Sound: Aus";
}

function clearTimer() {
    if (timerId) {
        window.clearInterval(timerId);
        timerId = null;
    }
}

function clearNudge() {
    if (nudgeTimeoutId) {
        window.clearTimeout(nudgeTimeoutId);
        nudgeTimeoutId = null;
    }
}

function stopWheelAnimation() {
    if (wheelAnimId) {
        window.cancelAnimationFrame(wheelAnimId);
        wheelAnimId = null;
    }
    if (wheelTickId) {
        window.clearInterval(wheelTickId);
        wheelTickId = null;
    }
    scoreWheelEl.classList.remove("rolling");
}

function setUrgency(active) {
    timePillEl.classList.toggle("urgent", active);
    quizCardEl.classList.toggle("urgent", active);
}

function updateStatus() {
    currentQuestionEl.textContent = String(index + 1);
    totalQuestionsEl.textContent = String(quiz.length);
    scoreEl.textContent = formatScore(score);
    streakEl.textContent = String(streak);
    timeLeftEl.textContent = String(timeLeft);

    const percent = Math.max(0, (timeLeft / QUESTION_TIME) * 100);
    timeBarEl.style.width = `${percent}%`;
    setUrgency(timeLeft <= 5 && !answered);
}

function showComboText() {
    if (streak >= 2) {
        comboTextEl.classList.remove("hidden");
        comboTextEl.classList.toggle("hot", streak >= 4);
        comboTextEl.textContent = `Serie x${streak} - Bonus aktiv!`;
    } else {
        comboTextEl.className = "combo hidden";
        comboTextEl.textContent = "";
    }
}

function resetRoundHints() {
    comboTextEl.className = "combo hidden";
    comboTextEl.textContent = "";
    nudgeTextEl.classList.add("hidden");
    nudgeTextEl.textContent = "";
    feedbackEl.className = "feedback hidden";
    feedbackEl.textContent = "";
    nextButton.classList.add("hidden");
    nextButton.classList.remove("cta");
    setUrgency(false);
    clearNudge();
}

function startTimer() {
    clearTimer();
    timeLeft = QUESTION_TIME;
    updateStatus();

    timerId = window.setInterval(() => {
        if (answered) return;
        timeLeft -= 1;
        updateStatus();

        if (timeLeft === 8 || timeLeft === 5 || timeLeft === 3) {
            setPostAnswerNudge("Schnell, entscheide dich.");
            playSound("hurry");
        }

        if (timeLeft <= 0) {
            clearTimer();
            handleAnswer(-1, true);
        }
    }, 1000);
}

function renderQuestion() {
    const q = quiz[index];
    answered = false;
    resetRoundHints();

    questionTextEl.textContent = q.question;
    answersEl.innerHTML = "";

    q.answers.forEach((answer, answerIndex) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "answer";
        button.textContent = answer;
        button.addEventListener("click", () => {
            unlockAudio();
            playSound("tap");
            handleAnswer(answerIndex, false);
        });
        answersEl.appendChild(button);
    });

    startTimer();
}

function setPostAnswerNudge(text) {
    nudgeTextEl.textContent = text;
    nudgeTextEl.classList.remove("hidden");
}

function scheduleIdleNudge() {
    clearNudge();
    nudgeTimeoutId = window.setTimeout(() => {
        if (nextButton.classList.contains("hidden")) return;
        const text = idleNudges[Math.floor(Math.random() * idleNudges.length)];
        setPostAnswerNudge(text);
    }, 2600);
}

function handleAnswer(selectedIndex, timedOut) {
    if (answered) return;
    answered = true;
    clearTimer();

    const q = quiz[index];
    const buttons = answersEl.querySelectorAll(".answer");
    const isCorrect = selectedIndex === q.correctIndex && !timedOut;

    buttons.forEach((button, i) => {
        button.disabled = true;
        if (i === q.correctIndex) {
            button.classList.add("correct");
        } else if (!timedOut && i === selectedIndex) {
            button.classList.add("wrong");
        }
    });

    if (isCorrect) {
        correctAnswers += 1;
        streak += 1;
        maxStreak = Math.max(maxStreak, streak);

        const timeBonus = timeLeft * TIME_BONUS_FACTOR;
        const streakBonus = streak >= 2 ? Math.min(150, (streak - 1) * 25) : 0;
        const gainedPoints = BASE_POINTS + timeBonus + streakBonus;
        score += gainedPoints;

        feedbackEl.className = "feedback ok";
        feedbackEl.textContent = `Richtig. +${formatScore(gainedPoints)} Punkte (${BASE_POINTS} Basis, +${timeBonus} Zeitbonus, +${streakBonus} Serienbonus). ${q.explanation}`;
        showComboText();
        setPostAnswerNudge("Stark! Weiter zur nächsten Frage.");
        playSound("correct");
        if (streak >= 4) {
            playSound("combo");
        }
    } else if (timedOut) {
        streak = 0;
        feedbackEl.className = "feedback bad";
        feedbackEl.textContent = `Zeit abgelaufen. Die richtige Antwort war markiert. ${q.explanation}`;
        setPostAnswerNudge("Kein Problem, weiter geht's.");
        playSound("timeout");
    } else {
        streak = 0;
        feedbackEl.className = "feedback bad";
        feedbackEl.textContent = `Nicht ganz. ${q.explanation}`;
        setPostAnswerNudge("Neue Chance in der nächsten Frage.");
        playSound("wrong");
    }

    updateStatus();
    nextButton.textContent = index + 1 < quiz.length ? "Nächste Frage" : "Ergebnis anzeigen";
    nextButton.classList.remove("hidden");
    nextButton.classList.add("cta");
    scheduleIdleNudge();
}

function getScoreRank(points) {
    if (points >= 2600) {
        return { motto: "Legendär! Du warst heute absolut unschlagbar.", color: "#1ea38b", sound: "rankHigh" };
    }
    if (points >= 1900) {
        return { motto: "Sehr stark! Das war eine richtig überzeugende Runde.", color: "#2f6fcc", sound: "rankHigh" };
    }
    if (points >= 1300) {
        return { motto: "Klasse gespielt! Du hast ein starkes Ergebnis erzielt.", color: "#6f5bd4", sound: "rankMid" };
    }
    if (points >= 800) {
        return { motto: "Gute Leistung! Du bist klar auf dem richtigen Weg.", color: "#d1812f", sound: "rankMid" };
    }
    return { motto: "Solider Anfang! Nächste Runde wird noch besser.", color: "#c93a49", sound: "rankLow" };
}

function animateScoreWheel(target, done) {
    stopWheelAnimation();
    scoreWheelEl.classList.remove("hidden");
    scoreWheelEl.classList.add("rolling");
    scoreWheelValueEl.textContent = "0";

    const duration = Math.min(4200, Math.max(1500, 1200 + target * 1.2));
    let startTime = null;
    let shown = 0;

    wheelTickId = window.setInterval(() => {
        playSound("wheelTick");
    }, 80);

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min(1, (timestamp - startTime) / duration);
        const eased = 1 - Math.pow(1 - progress, 2.7);
        const noise = progress < 0.9 ? Math.floor((1 - progress) * 70 + Math.random() * 20) : 0;

        let next = Math.floor(target * eased) + noise;
        next = Math.max(shown, Math.min(target, next));

        if (next !== shown) {
            shown = next;
            scoreWheelValueEl.textContent = formatScore(shown);
        }

        if (progress < 1) {
            wheelAnimId = window.requestAnimationFrame(step);
            return;
        }

        stopWheelAnimation();
        scoreWheelValueEl.textContent = formatScore(target);
        if (done) done();
    }

    wheelAnimId = window.requestAnimationFrame(step);
}

function showResult() {
    clearTimer();
    clearNudge();
    setUrgency(false);

    const highscore = Number(localStorage.getItem("feiertagsquiz_highscore") || 0);
    const newHighscore = score > highscore ? score : highscore;
    if (newHighscore !== highscore) {
        localStorage.setItem("feiertagsquiz_highscore", String(newHighscore));
    }

    const rank = getScoreRank(score);
    scoreMottoEl.textContent = "";
    scoreMottoEl.style.color = rank.color;
    resultTextEl.textContent = `Du hast ${formatScore(score)} Punkte erreicht. Richtige Antworten: ${correctAnswers}/${quiz.length}. Beste Serie: x${maxStreak}. Highscore: ${formatScore(newHighscore)}.`;

    resultEl.classList.remove("hidden");
    quizCardEl.classList.add("hidden");

    animateScoreWheel(score, () => {
        scoreMottoEl.textContent = rank.motto;
        playSound(rank.sound);
    });
}

function showStartScreen() {
    clearTimer();
    clearNudge();
    stopWheelAnimation();
    setUrgency(false);

    startScreenEl.classList.remove("hidden");
    statusEl.classList.add("hidden");
    timeTrackEl.classList.add("hidden");
    quizCardEl.classList.add("hidden");
    resultEl.classList.add("hidden");

    currentQuestionEl.textContent = "1";
    totalQuestionsEl.textContent = "10";
    scoreEl.textContent = "0";
    streakEl.textContent = "0";
    timeLeftEl.textContent = String(QUESTION_TIME);
    timeBarEl.style.width = "100%";
}

function nextStep() {
    if (!answered) return;
    playSound("next");

    if (index + 1 < quiz.length) {
        index += 1;
        renderQuestion();
    } else {
        showResult();
    }
}

function startQuiz() {
    clearTimer();
    clearNudge();
    stopWheelAnimation();

    quiz = buildQuestionSet();
    index = 0;
    score = 0;
    correctAnswers = 0;
    streak = 0;
    maxStreak = 0;
    answered = false;
    timeLeft = QUESTION_TIME;

    startScreenEl.classList.add("hidden");
    statusEl.classList.remove("hidden");
    timeTrackEl.classList.remove("hidden");
    resultEl.classList.add("hidden");
    scoreWheelEl.classList.add("hidden");
    scoreWheelValueEl.textContent = "0";
    scoreMottoEl.textContent = "";
    quizCardEl.classList.remove("hidden");
    renderQuestion();
}

soundToggleButton.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    localStorage.setItem("feiertagsquiz_sound", soundEnabled ? "on" : "off");
    syncSoundToggleUI();
    unlockAudio();
    playSound("tap");
});

document.addEventListener("pointerdown", unlockAudio, { passive: true });
startButton.addEventListener("click", () => {
    unlockAudio();
    playSound("tap");
    startQuiz();
});
nextButton.addEventListener("click", () => {
    unlockAudio();
    nextStep();
});
restartButton.addEventListener("click", () => {
    unlockAudio();
    playSound("next");
    startQuiz();
});

syncSoundToggleUI();
showStartScreen();
