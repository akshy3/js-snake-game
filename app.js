let canvas = document.getElementById("canvas");
let canvasContext = canvas.getContext("2d");

let welcomeDiv = document.getElementById("welcome-screen");
let playButton = document.getElementById("play-button");
let eatSound = new Audio("./assets/eat-sound.wav");
let gameOverSound = new Audio("./assets/game-over-sound.wav");

const BOARD_SIZE = 30;
const ONE_BLOCK = canvas.width / BOARD_SIZE;
let snake;
let food;
let snakeLength = 0;
let direction;
let fps = 80;
let snakePrevX, snakePrevY;
let game;

function initialization() {
  snake = [
    {
      x: (BOARD_SIZE * ONE_BLOCK) / 2,
      y: (BOARD_SIZE * ONE_BLOCK) / 2,
    },
  ];
  snakeLength = 0;
  fps = 80;
  direction=null;
}

function randomizeFood() {
  food = {
    x: Math.floor(Math.random() * BOARD_SIZE) * ONE_BLOCK,
    y: Math.floor(Math.random() * BOARD_SIZE) * ONE_BLOCK,
  };
}

function draw() {
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  canvasContext.fillStyle = "black";
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);

  for (i in snake) {
    canvasContext.fillStyle = "red";
    canvasContext.fillRect(snake[i].x, snake[i].y, ONE_BLOCK, ONE_BLOCK);
  }

  canvasContext.fillStyle = "green";
  canvasContext.fillRect(food.x, food.y, ONE_BLOCK, ONE_BLOCK);
  canvasContext.fillStyle = "white";
  canvasContext.font = "20px Arial";
  canvasContext.fillText("Score: " + snakeLength, 20, 20);
}
function checkCollision() {
  if (
    snake[0].x == 0 - ONE_BLOCK ||
    snake[0].y == 0 - ONE_BLOCK ||
    snake[0].x == canvas.width ||
    snake[0].y == canvas.height
  ) {
    gameOver();
  }

  for (let i = 1; i < snake.length; i++) {
    if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
      gameOver();
    }
  }

  if (snake[0].x == food.x && snake[0].y == food.y) {
    //eat food
    snake.push({ x: snakePrevX, y: snakePrevY });
    randomizeFood();
    snakeLength = snake.length - 1;
    eatSound.play();
  }
}
function handleKeyDown(e) {
  if (e.key == "ArrowUp" && direction != "down") {
    direction = "up";
  }
  if (e.key == "ArrowDown" && direction != "up") {
    direction = "down";
  }
  if (e.key == "ArrowLeft" && direction != "right") {
    direction = "left";
  }
  if (e.key == "ArrowRight" && direction != "left") {
    direction = "right";
  }
}

function move() {
  snakePrevX = snake[0].x;
  snakePrevY = snake[0].y;

  switch (direction) {
    case "up":
      snake[0].y = snake[0].y - ONE_BLOCK;
      break;
    case "down":
      snake[0].y = snake[0].y + ONE_BLOCK;
      break;
    case "left":
      snake[0].x = snake[0].x - ONE_BLOCK;
      break;
    case "right":
      snake[0].x = snake[0].x + ONE_BLOCK;
      break;
  }
  for (let i = 1; i < snake.length; i++) {
    let tempX = snake[i].x;
    let tempY = snake[i].y;

    snake[i].x = snakePrevX;
    snake[i].y = snakePrevY;

    snakePrevX = tempX;
    snakePrevY = tempY;
  }
}
function gameLoop() {
  move();
  draw();
  checkCollision();
}

function startGame() {
  initialization();
  canvas.style.display = "block";
  welcomeDiv.style.display = "none";
  document.addEventListener("keydown", handleKeyDown);
  randomizeFood();
  game = setInterval(gameLoop, fps);
}
function welcomeScreen() {
  canvas.style.display = "none";
  welcomeDiv.style.display = "block";
}

async function gameOver () {
  clearInterval(game);
  gameOverSound.play();
  await new Promise(r => setTimeout(r, 500));

  
  alert("game over!");
  document.removeEventListener("keydown", handleKeyDown);
  welcomeScreen();
}
