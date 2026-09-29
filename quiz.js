"use strict";

const requestedCategory = new URLSearchParams(window.location.search)
    .get("category")
    ?.trim()
    .toUpperCase();
const currentCategory = Object.hasOwn(quizData, requestedCategory) ? requestedCategory : "HISTORY";
const levels = Object.keys(quizData[currentCategory]);

function shuffleArray(items) {
    for (let index = items.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [items[index], items[randomIndex]] = [items[randomIndex], items[index]];
    }

    return items;
}

function createShuffledQuizData() {
    return Object.fromEntries(levels.map((level) => [
        level,
        shuffleArray(quizData[currentCategory][level].map((question) => {
            const options = question.options.map((text, index) => ({
                text,
                isCorrect: index === question.answer
            }));
            shuffleArray(options);

            return {
                ...question,
                options: options.map((option) => option.text),
                answer: options.findIndex((option) => option.isCorrect)
            };
        }))
    ]));
}

let activeQuizData = createShuffledQuizData();
let currentLevel = "Easy";
let currentLevelIndex = 0;
let currentQuestionIndex = 0;
let currentScore = 0;
let totalScore = 0;
let hasAnswered = false;
let autoAdvanceTimeout = null;

const categoryTranslationKeys = {
    HISTORY: "history",
    GEOGRAPHY: "geography",
    "MUSIC/ARTS": "musicArts",
    "SOCIAL CULTURE": "socialCulture",
    FOOD: "food",
    "LOGO QUIZ": "logoQuiz"
};

const levelNumber = document.querySelector("#level-number");
const selectedCategoryLabel = document.querySelector("#selected-category");
const totalScoreLabel = document.querySelector("#total-score");
const questionLabel = document.querySelector("#question-label");
const levelScoreLabel = document.querySelector("#level-score");
const progressFill = document.querySelector("#progress-fill");
const questionCard = document.querySelector("#question-card");
const questionImage = document.querySelector("#question-image");
const questionText = document.querySelector("#question-text");
const optionsList = document.querySelector("#options-list");
const answerFeedback = document.querySelector("#answer-feedback");
const nextButton = document.querySelector("#next-button");
const levelModal = document.querySelector("#level-modal");
const modalEyebrow = document.querySelector("#modal-eyebrow");
const modalTitle = document.querySelector("#modal-title");
const modalScore = document.querySelector("#modal-score");
const modalTotal = document.querySelector("#modal-total");
const modalMessage = document.querySelector("#modal-message");
const modalAction = document.querySelector("#modal-action");
const scoreNameField = document.querySelector("#score-name-field");
const scoreNameInput = document.querySelector("#score-name");
const scoreSaveStatus = document.querySelector("#score-save-status");
const gameOverActions = document.querySelector("#game-over-actions");
const restartButton = document.querySelector("#restart-button");

function renderQuestion() {
    const questions = activeQuizData[currentLevel];
    const question = questions[currentQuestionIndex];

    selectedCategoryLabel.textContent = t(categoryTranslationKeys[currentCategory]);
    levelNumber.textContent = String(currentLevelIndex + 1);
    questionLabel.textContent = t("questionProgress", {
        current: currentQuestionIndex + 1,
        total: questions.length
    });
    levelScoreLabel.textContent = t("correctCount", { count: currentScore });
    totalScoreLabel.textContent = String(totalScore);
    progressFill.style.width = `${((currentQuestionIndex + 1) / questions.length) * 100}%`;
    questionText.textContent = question.question;
    questionImage.hidden = !question.image;
    if (question.image) {
        questionImage.src = question.image;
        questionImage.onerror = () => {
            questionImage.hidden = true;
        };
    } else {
        questionImage.removeAttribute("src");
        questionImage.onerror = null;
    }
    answerFeedback.textContent = "";
    answerFeedback.className = "answer-feedback";
    nextButton.disabled = true;
    hasAnswered = false;

    optionsList.replaceChildren();
    question.options.forEach((option, optionIndex) => {
        const optionButton = document.createElement("button");
        const key = document.createElement("span");
        const label = document.createElement("span");

        optionButton.type = "button";
        optionButton.className = "option-button";
        optionButton.setAttribute("aria-pressed", "false");
        key.className = "option-key";
        key.setAttribute("aria-hidden", "true");
        key.textContent = String.fromCharCode(65 + optionIndex);
        label.textContent = option;
        optionButton.append(key, label);
        optionButton.addEventListener("click", () => selectAnswer(optionIndex, optionButton));
        optionsList.append(optionButton);
    });

    questionCard.classList.remove("question-enter");
    void questionCard.offsetWidth;
    questionCard.classList.add("question-enter");
}

function selectAnswer(selectedIndex, selectedButton) {
    if (hasAnswered) return;

    hasAnswered = true;
    const question = activeQuizData[currentLevel][currentQuestionIndex];
    const optionButtons = [...optionsList.querySelectorAll(".option-button")];
    const isCorrect = selectedIndex === question.answer;

    optionButtons.forEach((button, index) => {
        button.disabled = true;
        if (index === selectedIndex) {
            button.setAttribute("aria-pressed", "true");
        }
        if (index === question.answer) {
            button.classList.add("is-correct");
        }
    });

    if (isCorrect) {
        currentScore += 1;
        totalScore += 1;
        answerFeedback.textContent = t("correctFeedback");
        answerFeedback.classList.add("is-correct");
    } else {
        selectedButton.classList.add("is-incorrect");
        answerFeedback.textContent = t("incorrectFeedback", { answer: question.options[question.answer] });
        answerFeedback.classList.add("is-incorrect");
    }

    levelScoreLabel.textContent = t("correctCount", { count: currentScore });
    totalScoreLabel.textContent = String(totalScore);
    nextButton.disabled = false;
}

function showLevelSummary() {
    const isFinalLevel = currentLevelIndex === levels.length - 1;
    const nextLevel = levels[currentLevelIndex + 1];
    const levelQuestionCount = activeQuizData[currentLevel].length;
    const categoryQuestionCount = levels.reduce(
        (count, level) => count + activeQuizData[level].length,
        0
    );

    const translatedLevel = t(currentLevel.toLowerCase());
    const translatedCategory = t(categoryTranslationKeys[currentCategory]);

    modalEyebrow.textContent = t(isFinalLevel ? "quizComplete" : "levelComplete");
    modalTitle.textContent = t(isFinalLevel ? "allDone" : "levelUp");
    modalScore.textContent = t("levelScore", {
        level: translatedLevel,
        score: currentScore,
        total: levelQuestionCount
    });
    modalTotal.textContent = t("categoryScore", {
        category: translatedCategory,
        score: totalScore,
        total: categoryQuestionCount
    });
    modalMessage.textContent = isFinalLevel
        ? t("finalMessage", { category: translatedCategory })
        : t("movingToLevel", { level: t(nextLevel.toLowerCase()) });
    scoreNameField.hidden = !isFinalLevel;
    gameOverActions.hidden = !isFinalLevel;
    scoreSaveStatus.textContent = "";
    modalAction.dataset.action = isFinalLevel ? "save-score" : "continue";
    modalAction.textContent = isFinalLevel
        ? t("saveScore")
        : t("continueToLevel", { level: t(nextLevel.toLowerCase()) });
    if (isFinalLevel) {
        scoreNameInput.value = localStorage.getItem("pinoyQuizPlayerName") || "";
    }
    levelModal.showModal();

    if (!isFinalLevel) {
        autoAdvanceTimeout = window.setTimeout(advanceFromModal, 2400);
    }
}

function advanceFromModal() {
    window.clearTimeout(autoAdvanceTimeout);
    autoAdvanceTimeout = null;
    levelModal.close();

    if (currentLevelIndex === levels.length - 1) {
        currentLevelIndex = 0;
        totalScore = 0;
        activeQuizData = createShuffledQuizData();
    } else {
        currentLevelIndex += 1;
    }

    currentLevel = levels[currentLevelIndex];
    currentQuestionIndex = 0;
    currentScore = 0;
    renderQuestion();
}

function saveFinalScore() {
    if (modalAction.disabled) return;

    const name = scoreNameInput.value.trim() || "Kabayan";

    try {
        const savedScores = JSON.parse(localStorage.getItem("pinoyQuizScores") || "[]");
        const scores = Array.isArray(savedScores)
            ? savedScores
                .filter((entry) =>
                    entry &&
                    typeof entry.name === "string" &&
                    entry.name.trim() &&
                    Number.isFinite(Number(entry.score))
                )
                .map((entry) => ({ ...entry, name: entry.name.trim(), score: Number(entry.score) }))
            : [];
        const newScore = {
            name,
            score: totalScore,
            category: currentCategory,
            date: new Date().toISOString()
        };
        scores.push(newScore);
        scores.sort((first, second) => second.score - first.score);
        const topScores = scores.slice(0, 10);

        localStorage.setItem("pinoyQuizScores", JSON.stringify(topScores));
        localStorage.setItem("pinoyQuizPlayerName", name);
        scoreSaveStatus.textContent = t(topScores.includes(newScore) ? "scoreSaved" : "scoreOutsideTopTen");
        modalAction.disabled = true;
    } catch {
        scoreSaveStatus.textContent = t("scoreSaveFailure");
    }
}

function restartCurrentGame() {
    window.clearTimeout(autoAdvanceTimeout);
    autoAdvanceTimeout = null;
    levelModal.close();
    currentLevelIndex = 0;
    currentLevel = levels[0];
    currentQuestionIndex = 0;
    currentScore = 0;
    totalScore = 0;
    hasAnswered = false;
    activeQuizData = createShuffledQuizData();
    modalAction.disabled = false;
    renderQuestion();
}

nextButton.addEventListener("click", () => {
    if (!hasAnswered) return;

    if (currentQuestionIndex < activeQuizData[currentLevel].length - 1) {
        currentQuestionIndex += 1;
        renderQuestion();
    } else {
        showLevelSummary();
    }
});

modalAction.addEventListener("click", () => {
    if (modalAction.dataset.action === "save-score") {
        saveFinalScore();
        return;
    }

    advanceFromModal();
});
restartButton.addEventListener("click", restartCurrentGame);
levelModal.addEventListener("cancel", (event) => event.preventDefault());

renderQuestion();