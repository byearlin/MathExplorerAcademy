// script.js

const problemElement = document.getElementById('problem');
const answerInput = document.getElementById('answer');
const submitButton = document.getElementById('submit');
const feedbackElement = document.getElementById('feedback');
const scoreElement = document.getElementById('score');
const streakElement = document.getElementById('streak');
const leaderboardElement = document.getElementById('leaderboard');

let score = 0;
let streak = 0;
let currentProblem;
let currentAnswer;

// Sound Effects
const correctSound = new Audio('correct.mp3');  // Replace with your sound file
const incorrectSound = new Audio('incorrect.mp3'); // Replace with your sound file

// Scoring System
const baseScore = 10;
const streakMultipliers = [1, 1.5, 2, 2.5]; // Multipliers for streaks of 0, 1, 2, 3+

// Leaderboard Data (Example - using Local Storage)
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

function generateAdditionProblem() {
    const num1 = Math.floor(Math.random() * 9000) + 1000; // 4-digit number
    const num2 = Math.floor(Math.random() * 9000) + 1000; // 4-digit number
    currentProblem = `${num1} + ${num2}`;
    currentAnswer = num1 + num2;
}

function generateMultiplicationProblem() {
    const num1 = Math.floor(Math.random() * 90) + 10; // 2-digit number
    const num2 = Math.floor(Math.random() * 9) + 1;   // 1-digit number
    currentProblem = `${num1} x ${num2}`;
    currentAnswer = num1 * num2;
}

function generateProblem(type) {
    if (type === 'addition') {
        generateAdditionProblem();
    } else if (type === 'multiplication') {
        generateMultiplicationProblem();
    }
    problemElement.textContent = currentProblem;
    answerInput.value = ''; // Clear the input field
    answerInput.focus();      // Focus the input field
}

function checkAnswer() {
    const userAnswer = parseInt(answerInput.value);

    if (userAnswer === currentAnswer) {
        correctSound.play();
        feedbackElement.textContent = "Correct!";
        feedbackElement.style.color = "green";

        // Calculate Score
        const streakMultiplierIndex = Math.min(streak, streakMultipliers.length - 1);
        const scoreIncrease = baseScore * streakMultipliers[streakMultiplierIndex];

        score += scoreIncrease;
        streak++;

        // Update Scoreboard
        updateScoreboard();

        // Generate new addition or multiplication problem based on a random choice.
        const problemType = Math.random() < 0.5 ? 'addition' : 'multiplication'; // Randomly choose addition or multiplication
        generateProblem(problemType);

    } else {
        incorrectSound.play();
        feedbackElement.textContent = "Try Again!";
        feedbackElement.style.color = "red";
        streak = 0;
        updateScoreboard();
    }

}

function updateScoreboard() {
    scoreElement.textContent = score;
    streakElement.textContent = streak;
}

function loadLeaderboard() {
    leaderboardElement.innerHTML = ''; // Clear existing list items
    leaderboard.sort((a, b) => b.score - a.score); // Sort by score (descending)

    for (let i = 0; i < Math.min(5, leaderboard.length); i++) { // Display top 5
        const entry = leaderboard[i];
        const listItem = document.createElement('li');
        listItem.textContent = `${entry.name}: ${entry.score}`;
        leaderboardElement.appendChild(listItem);
    }
}

function saveLeaderboard() {
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

// Example: Adding a new score (you'd need a user input for the name)
function addScore(name, score) {
    leaderboard.push({ name: name, score: score });
    saveLeaderboard();
    loadLeaderboard();
}

submitButton.addEventListener('click', checkAnswer);

// Initial Problem Generation
generateProblem('addition'); // Start with addition

// Load leaderboard on page load
loadLeaderboard();