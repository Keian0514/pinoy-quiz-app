"use strict";

const scoresTable = document.querySelector("#scores-table");
const scoresList = document.querySelector("#scores-list");
const emptyState = document.querySelector("#empty-state");
const resetButton = document.querySelector("#reset-leaderboard");

function loadTopScores() {
    let scores = [];

    try {
        const storedScores = JSON.parse(localStorage.getItem("pinoyQuizScores") || "[]");
        if (Array.isArray(storedScores)) {
            scores = storedScores.filter((entry) =>
                entry &&
                typeof entry.name === "string" &&
                entry.name.trim() &&
                Number.isFinite(Number(entry.score))
            );
        }
    } catch {
        scores = [];
    }

    scores.sort((first, second) => Number(second.score) - Number(first.score));
    scoresList.replaceChildren();

    if (scores.length === 0) {
        scoresTable.hidden = true;
        emptyState.hidden = false;
        return;
    }

    scoresTable.hidden = false;
    emptyState.hidden = true;

    scores.forEach((entry, index) => {
        const row = document.createElement("tr");
        const rankCell = document.createElement("td");
        const nameCell = document.createElement("td");
        const scoreCell = document.createElement("td");

        rankCell.textContent = String(index + 1);
        nameCell.textContent = entry.name.trim();
        scoreCell.textContent = String(Number(entry.score));
        row.append(rankCell, nameCell, scoreCell);
        scoresList.append(row);
    });
}

resetButton.addEventListener("click", () => {
    if (!window.confirm(t("resetConfirm"))) return;

    localStorage.removeItem("pinoyQuizScores");
    window.location.reload();
});

loadTopScores();
