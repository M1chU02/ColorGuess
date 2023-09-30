function randomInteger(max) {
  return Math.floor(Math.random() * (max + 1));
}

function randomRgbColor() {
  let r = randomInteger(255);
  let g = randomInteger(255);
  let b = randomInteger(255);
  return `rgb(${r}, ${g}, ${b})`;
}

function randomHexColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function rgbToHex(rgb) {
  const parts = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (!parts) return rgb;
  const r = parseInt(parts[1]);
  const g = parseInt(parts[2]);
  const b = parseInt(parts[3]);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b)
    .toString(16)
    .slice(1)
    .toUpperCase()}`;
}

function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgb(${r}, ${g}, ${b})`;
}

let numTiles = 3;
let lives = 3;
let points = 0;
let winStreak = 0;
let buyingLivesCost = 30;
let gameOver = false;
let displayRGB = true;
let randomOption;
let correctColor;

function toggleDisplay() {
  displayRGB = !displayRGB;
  updateColorDisplay();
}

function updateColorDisplay() {
  const colorDisplay = document.getElementById("colorDisplay");
  if (displayRGB) {
    colorDisplay.textContent = `RGB Color: ${correctColor}`;
  } else {
    const hexColor = rgbToHex(correctColor);
    colorDisplay.textContent = `HEX Color: ${hexColor}`;
  }
}

function setGameMode(easyMode) {
  numTiles = easyMode ? 3 : 6;
  updateColorGuessButtons();
}

function createColorGuessButtons() {
  const optionsContainer = document.getElementById("options");
  optionsContainer.innerHTML = "";

  for (let i = 1; i <= numTiles; i++) {
    const button = document.createElement("button");
    button.id = `option${i}`;
    button.className = "guessBtn";
    optionsContainer.appendChild(button);

    button.addEventListener("click", () => {
      handleOptionClick(i, randomOption, correctColor);
    });
  }
}

function updateColorGuessButtons() {
  createColorGuessButtons();
}

function buyLives() {
  if (lives <= 4) {
    if (!gameOver && points >= buyingLivesCost) {
      points -= buyingLivesCost;
      lives++;
      document.getElementById(
        "pointsDisplay"
      ).textContent = `Points: ${points}`;
      document.getElementById("livesDisplay").textContent = `Lives: ${lives}`;
    } else {
      displayMessage("Not enough points to buy lives!", "red");
    }
  } else {
    displayMessage("You can have a maximum of 5 lives", "red");
  }
}

function displayMessage(message, color) {
  const messageElement = document.getElementById("message");
  messageElement.textContent = message;
  messageElement.style.color = color;
}

function handleOptionClick(clickedOption, correctOption, correctColor) {
  if (!gameOver) {
    const clickedButton = document.getElementById(`option${clickedOption}`);
    if (clickedButton.classList.contains("disabled")) {
      return;
    }

    if (clickedOption === correctOption) {
      document.getElementById("nextButton").style.display = "block";
      displayMessage("Correct!", "green");
      points += 5;
      if (winStreak >= 3) {
        points++;
      }
      winStreak++;
    } else {
      displayMessage("Wrong! The correct answer was:", "red");
      document.getElementById(`option${correctOption}`).style.backgroundColor =
        correctColor;

      const correctColorDisplay = document.getElementById(
        "correctColorDisplay"
      );
      correctColorDisplay.style.backgroundColor = correctColor;
      correctColorDisplay.style.display = "block";

      lives--;

      if (lives === 0) {
        gameOver = true;
        displayMessage("Game Over!", "red");
        document.getElementById("reset").style.display = "block";
      } else {
        document.getElementById("nextButton").style.display = "block";
      }

      winStreak = 0;
    }

    for (let i = 1; i <= numTiles; i++) {
      const button = document.getElementById(`option${i}`);
      button.classList.add("disabled");
    }

    document.getElementById("livesDisplay").textContent = `Lives: ${lives}`;
    document.getElementById("pointsDisplay").textContent = `Points: ${points}`;
  }
}

function addGuessButtonListeners() {
  for (let i = 1; i <= numTiles; i++) {
    const button = document.getElementById(`option${i}`);
    button.classList.remove("disabled");
  }
}

function setupGame() {
  document.getElementById("nextButton").style.display = "none";
  document.getElementById("correctColorDisplay").style.display = "none";

  correctColor = displayRGB ? randomRgbColor() : randomHexColor();

  document.getElementById("colorDisplay").textContent = displayRGB
    ? `RGB Color: ${correctColor}`
    : `HEX Color: ${correctColor}`;

  randomOption = Math.floor(Math.random() * numTiles) + 1;

  for (let i = 1; i <= numTiles; i++) {
    const button = document.getElementById(`option${i}`);
    const backgroundColor =
      i === randomOption
        ? correctColor
        : displayRGB
        ? randomRgbColor()
        : randomHexColor();
    button.style.backgroundColor = backgroundColor;
  }

  addGuessButtonListeners();

  document.getElementById("nextButton").addEventListener("click", () => {
    document.getElementById("nextButton").style.display = "none";
    displayMessage("");
    document.getElementById("correctColorDisplay").style.display = "none";
    setupGame();
  });
}

function resetGame() {
  gameOver = false;
  points = 0;
  lives = 3;
  displayMessage("");
  document.getElementById("reset").style.display = "none";
  document.getElementById("pointsDisplay").textContent = `Points: ${points}`;
  document.getElementById("livesDisplay").textContent = `Lives: ${lives}`;
  setupGame();
}

document.getElementById("reset").addEventListener("click", resetGame);

document.getElementById("easyMode").addEventListener("click", () => {
  setGameMode(true);
  createColorGuessButtons(numTiles);
  setupGame();
});

document.getElementById("hardMode").addEventListener("click", () => {
  setGameMode(false);
  createColorGuessButtons(numTiles);
  setupGame();
});
document.getElementById("buyLives").addEventListener("click", buyLives);

document
  .getElementById("toggleDisplay")
  .addEventListener("click", toggleDisplay);

createColorGuessButtons(numTiles);
setupGame();
