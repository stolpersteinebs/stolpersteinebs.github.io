const quizData = [
    {
        question: "Wofür steht die Menora in vielen jüdischen Traditionen?",
        answers: [
            "Nur für ein bestimmtes Fest",
            "Für Licht, Weisheit und die Verbindung zu Gott",
            "Für die vier Jahreszeiten",
            "Für militärische Stärke"
        ],
        correctIndex: 1,
        explanation: "Die Menora gilt als Symbol für Licht, göttliche Gegenwart und geistige Orientierung."
    },
    {
        question: "Was ist der Unterschied zwischen Menora und Chanukkia?",
        answers: [
            "Es gibt keinen Unterschied",
            "Die Menora hat 7 Arme, die Chanukkia 9 Lichter",
            "Die Menora wird nur zu Purim genutzt",
            "Die Chanukkia steht nur in Synagogen"
        ],
        correctIndex: 1,
        explanation: "Die klassische Menora hat sieben Arme; die Chanukkia besitzt acht plus Schamasch, also neun Lichter."
    },
    {
        question: "Was symbolisiert der Davidstern (Magen David) heute häufig?",
        answers: [
            "Nur ein Ornament ohne Bedeutung",
            "Jüdische Identität und Gemeinschaft",
            "Ein Erntesymbol",
            "Ein Fastengebot"
        ],
        correctIndex: 1,
        explanation: "Der Davidstern ist ein verbreitetes Zeichen jüdischer Identität und Zugehörigkeit."
    },
    {
        question: "Wozu dient eine Mesusa an der Tür?",
        answers: [
            "Zur Dekoration ohne religiösen Bezug",
            "Als Erinnerung an Gebote und Schutzsymbol am Haus",
            "Als Kerzenhalter",
            "Als Kalender"
        ],
        correctIndex: 1,
        explanation: "In der Mesusa befindet sich ein Textabschnitt aus der Tora; sie erinnert an Glauben und Gebote."
    },
    {
        question: "Was ist ein Schofar?",
        answers: [
            "Ein Gebetsbuch",
            "Ein Widderhorn, das zu bestimmten Anlässen geblasen wird",
            "Ein Speisegesetz",
            "Ein Leuchter mit sieben Armen"
        ],
        correctIndex: 1,
        explanation: "Der Schofar ist ein traditionelles Horninstrument, besonders zu Rosch ha-Schana und Jom Kippur."
    },
    {
        question: "Welche Aussage passt zur Tora-Rolle?",
        answers: [
            "Sie enthält zentrale Texte des Judentums",
            "Sie ist nur ein modernes Schulbuch",
            "Sie wird nur außerhalb von Synagogen gelesen",
            "Sie ersetzt alle Feiertage"
        ],
        correctIndex: 0,
        explanation: "Die Tora ist zentral für Glauben, Lehre und Gottesdienst."
    },
    {
        question: "Warum hat die Chanukkia ein zusätzliches Licht (Schamasch)?",
        answers: [
            "Es zählt nicht als Licht",
            "Damit entzündet man die anderen Lichter",
            "Für die Dekoration",
            "Als Zeichen für die 12 Stämme"
        ],
        correctIndex: 1,
        explanation: "Der Schamasch dient als Dienerlicht, mit dem die anderen Kerzen angezündet werden."
    },
    {
        question: "Was beschreibt am besten die Bedeutung religiöser Symbole?",
        answers: [
            "Sie sind unwichtig im Alltag",
            "Sie verbinden Geschichte, Glauben und Gemeinschaft",
            "Sie gelten nur für Kinder",
            "Sie haben nur musealen Wert"
        ],
        correctIndex: 1,
        explanation: "Religiöse Symbole können Identität stiften und Traditionen über Generationen weitergeben."
    }
];

const startScreen = document.getElementById("startScreen");
const quizScreen = document.getElementById("quizScreen");
const resultScreen = document.getElementById("resultScreen");

const startBtn = document.getElementById("startBtn");
const nextBtn = document.getElementById("nextBtn");
const restartBtn = document.getElementById("restartBtn");

const currentQuestionEl = document.getElementById("currentQuestion");
const totalQuestionsEl = document.getElementById("totalQuestions");
const scoreEl = document.getElementById("score");
const questionTextEl = document.getElementById("questionText");
const answersEl = document.getElementById("answers");
const feedbackEl = document.getElementById("feedback");
const resultTextEl = document.getElementById("resultText");

let questionIndex = 0;
let score = 0;
let answered = false;

totalQuestionsEl.textContent = String(quizData.length);

function startQuiz() {
    questionIndex = 0;
    score = 0;

    startScreen.classList.add("hidden");
    resultScreen.classList.add("hidden");
    quizScreen.classList.remove("hidden");

    renderQuestion();
}

function renderQuestion() {
    const item = quizData[questionIndex];
    answered = false;

    currentQuestionEl.textContent = String(questionIndex + 1);
    scoreEl.textContent = String(score);
    questionTextEl.textContent = item.question;
    answersEl.innerHTML = "";

    feedbackEl.classList.add("hidden");
    feedbackEl.classList.remove("good", "bad");
    feedbackEl.textContent = "";
    nextBtn.classList.add("hidden");

    item.answers.forEach((answer, idx) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = answer;
        btn.className = "answer-btn";
        btn.addEventListener("click", () => checkAnswer(idx, btn));
        answersEl.appendChild(btn);
    });
}

function checkAnswer(selectedIndex) {
    if (answered) {
        return;
    }
    answered = true;

    const item = quizData[questionIndex];
    const buttons = Array.from(answersEl.querySelectorAll("button"));
    const isCorrect = selectedIndex === item.correctIndex;

    buttons.forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === item.correctIndex) {
            btn.classList.add("correct");
        }
        if (idx === selectedIndex && !isCorrect) {
            btn.classList.add("wrong");
        }
    });

    if (isCorrect) {
        score += 1;
        scoreEl.textContent = String(score);
        feedbackEl.textContent = `Richtig! ${item.explanation}`;
        feedbackEl.classList.add("good");
    } else {
        feedbackEl.textContent = `Nicht ganz. ${item.explanation}`;
        feedbackEl.classList.add("bad");
    }

    feedbackEl.classList.remove("hidden");
    nextBtn.classList.remove("hidden");
}

function showResult() {
    quizScreen.classList.add("hidden");
    resultScreen.classList.remove("hidden");

    const maxScore = quizData.length;
    let message = "Starker Anfang!";

    if (score === maxScore) {
        message = "Perfekt! Du kennst die Bedeutung der Symbole richtig gut.";
    } else if (score >= Math.ceil(maxScore * 0.75)) {
        message = "Sehr gut! Du hast ein solides Wissen über die Symbole.";
    } else if (score >= Math.ceil(maxScore * 0.5)) {
        message = "Gut gemacht! Mit etwas Übung schaffst du noch mehr.";
    }

    resultTextEl.textContent = `Du hast ${score} von ${maxScore} Punkten. ${message}`;
}

nextBtn.addEventListener("click", () => {
    questionIndex += 1;
    if (questionIndex >= quizData.length) {
        showResult();
        return;
    }
    renderQuestion();
});

startBtn.addEventListener("click", startQuiz);
restartBtn.addEventListener("click", startQuiz);
