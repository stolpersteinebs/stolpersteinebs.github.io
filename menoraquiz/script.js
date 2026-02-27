const quizData = [
    {
        question: "Wie viele Arme hat die klassische Menora?",
        answers: ["5", "6", "7", "9"],
        correctIndex: 2,
        explanation: "Die klassische Menora wird mit sieben Armen dargestellt."
    },
    {
        question: "Wo stand die Menora im Tempeldienst?",
        answers: ["In Jerusalem", "In Alexandria", "In Babylon", "In Rom"],
        correctIndex: 0,
        explanation: "Die Menora ist als Tempelsymbol aus Jerusalem bekannt."
    },
    {
        question: "Wofür steht die Menora in vielen Deutungen?",
        answers: ["Für Licht und Orientierung", "Für Handel", "Für Militär", "Für Sport"],
        correctIndex: 0,
        explanation: "Die Menora wird oft als Zeichen für Licht und geistige Orientierung verstanden."
    },
    {
        question: "Welche Darstellung zeigt die Menora in der Antike?",
        answers: ["Der Titusbogen", "Das Kolosseum", "Der Parthenon", "Stonehenge"],
        correctIndex: 0,
        explanation: "Auf dem Titusbogen ist die Menora als Teil der Tempelbeute dargestellt."
    },
    {
        question: "Was zeigt das Wappen des Staates Israel?",
        answers: ["Eine siebenarmige Menora", "Eine neunarmige Chanukkia", "Einen Davidstern", "Eine Tora-Rolle"],
        correctIndex: 0,
        explanation: "Das Staatswappen Israels zeigt eine siebenarmige Menora mit Olivenzweigen."
    },
    {
        question: "Was ist der Hauptunterschied zwischen Menora und Chanukkia?",
        answers: [
            "Kein Unterschied",
            "Menora 7, Chanukkia 9 Lichter",
            "Menora 9, Chanukkia 7 Lichter",
            "Nur die Menora hat Kerzen"
        ],
        correctIndex: 1,
        explanation: "Die Menora hat sieben Arme, die Chanukkia neun Lichter (acht plus Schamasch)."
    },
    {
        question: "Welche Aussage trifft auf die Menora heute zu?",
        answers: [
            "Sie ist nur Deko",
            "Sie ist nur ein Museumsexponat",
            "Sie ist ein wichtiges jüdisches Symbol",
            "Sie wird nicht mehr verwendet"
        ],
        correctIndex: 2,
        explanation: "Die Menora steht bis heute für jüdische Geschichte, Glauben und Identität."
    },
    {
        question: "In welchem Kontext wird die Menora oft erwähnt?",
        answers: ["Tempel und jüdische Symbolik", "Nur Küche", "Nur Musik", "Nur Kleidung"],
        correctIndex: 0,
        explanation: "Die Menora ist eng mit Tempeltradition und jüdischer Symbolik verbunden."
    },
    {
        question: "Welche Form beschreibt die Menora korrekt?",
        answers: [
            "Siebenarmiger Leuchter",
            "Dreieckiges Zeichen",
            "Rundes Amulett",
            "Buchrolle"
        ],
        correctIndex: 0,
        explanation: "Die Menora ist ein siebenarmiger Leuchter."
    },
    {
        question: "Welche Aussage ist richtig?",
        answers: [
            "Die Menora ist nur ein Festsymbol für Chanukka",
            "Die Menora gehört zu den zentralen jüdischen Symbolen",
            "Die Menora hat immer neun Lichter",
            "Die Menora stammt aus dem Mittelalter"
        ],
        correctIndex: 1,
        explanation: "Die Menora ist ein zentrales jüdisches Symbol mit antiken Wurzeln."
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
        message = "Perfekt! Du kennst die Menora richtig gut.";
    } else if (score >= Math.ceil(maxScore * 0.75)) {
        message = "Sehr gut! Du hast ein solides Wissen über die Menora.";
    } else if (score >= Math.ceil(maxScore * 0.5)) {
        message = "Gut gemacht! Mit etwas Übung weißt du noch mehr über die Menora.";
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
