const buttonColors = ["red", "blue", "green", "yellow"];

let gamePattern = [];
let userPattern = [];

let started = false;
let level = 0;

let heading = document.querySelector("h1");

let score = document.querySelector("#score");

let restart = document.querySelector("#restart-msg");

let highScoreElem = document.querySelector("#high-score");

let highScore = sessionStorage.getItem("simonHighScore") || 0;

let buttonFlash = function (btn) {
  btn.classList.add("flash");
  setTimeout(function () {
    btn.classList.remove("flash");
  }, 200);
};

let allButtons = document.querySelectorAll(".btn");
for (let btn of allButtons) {
  btn.addEventListener("click", function () {
    if (!started) return;
    buttonFlash(this);
    userPattern.push(this.getAttribute("id"));
    playSound(this.id);
    checkAnswer(userPattern.length - 1);
  });
}

let checkAnswer = function (index) {
  if (userPattern[index] == gamePattern[index]) {
    if (userPattern.length == gamePattern.length) {
      setTimeout(levelUp, 1000);
      score.innerText = `Score : ${level}`;
    }
  } else {
    playSound("wrong");
    heading.innerHTML = `Game over !! `;
    heading.style.color = "red";
    score.innerText = `Score : ${level - 1}`;
    restart.innerHTML = "🎮 Press any key to restart or tap outside box 🎮";
    restart.style.color = "#e74c3c";
    document.body.classList.add("game-over");
    setTimeout(() => {
      document.body.classList.remove("game-over");
    }, 200);
    if (level - 1 > highScore) {
      highScore = level - 1;
      sessionStorage.setItem("simonHighScore", highScore);
    }
    highScoreElem.innerText = `High Score: ${highScore}`;

    reset();
  }
};

let playSound = function (color) {
  try {
    let audio = new Audio(`./sounds/${color}.mp3`);
    audio.play();
  } catch {
    console.log("Audio not available");
  }
};

let reset = function () {
  started = false;
  level = 0;
  heading.style.color = "black";
  userPattern = [];
  gamePattern = [];
};

let levelUp = function () {
  level++;
  userPattern = [];
  heading.innerText = `Level ${level}`;
  let randomIndex = Math.floor(Math.random() * 4);

  let randomColor = buttonColors[randomIndex];
  let randomButton = document.querySelector(`.${randomColor}`);
  buttonFlash(randomButton);
  playSound(randomColor);

  gamePattern.push(randomColor);
  console.log(gamePattern);
};

document.addEventListener("keypress", function () {
  if (!started) {
    started = true;
    score.innerHTML = "";
    levelUp();
  }
});

document.body.addEventListener("click", function (event) {
  if (!started && !event.target.classList.contains("btn")) {
    started = true;
    score.innerHTML = "";
    levelUp();
  }
});
