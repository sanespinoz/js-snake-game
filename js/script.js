const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const score = document.querySelector(".score--value");
const finalScore = document.querySelector(".final-score > span");
const menu = document.querySelector(".menu-screen");
const buttonPlay = document.querySelector(".btn-play");
//const audio = new Audio("../assets/audio.mp3");
const basePath = location.hostname.includes("github.io")
  ? "/js-snake-game/"
  : "/";
const audio = new Audio(`${basePath}assets/audio.mp3`);

console.log(score);
const size = 30;
//multiplo de 30
const initialPosition = { x: 270, y: 240 };
let snake = [initialPosition];

const incrementScore = () => {
  score.innerText = +score.innerText + 10;
};

const randomNumber = (min, max) => {
  return Math.round(Math.random() * (max - min) + min);
};

const randomPosition = () => {
  const number = randomNumber(0, canvas.width - size);
  return Math.round(number / 30) * 30;
};

const randomColor = () => {
  const red = randomNumber(0, 255);
  const green = randomNumber(0, 255);
  const blue = randomNumber(0, 255);
  return `rgb(${red}, ${green}, ${blue})`;
};

const food = {
  x: randomPosition(0, 570),
  y: randomPosition(0, 570),
  color: randomColor(),
};

let direction;
let loopId;

const drawFood = () => {
  //desestructurar
  const { x, y, color } = food;
  ctx.shadowColor = color;
  ctx.shadowBlur = 6;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, size, size);
  ctx.shadowBlur = 0;
};

const drawSnake = () => {
  ctx.fillStyle = "#ddd";
  snake.forEach((position, index) => {
    if (index == snake.length - 1) {
      ctx.fillStyle = "white";
    }

    ctx.fillRect(position.x, position.y, size, size);
  });
};

const moveSnake = () => {
  if (!direction) return;
  const head = snake.at(-1);

  if (direction == "right") {
    snake.push({ x: head.x + size, y: head.y });
  }
  if (direction == "left") {
    snake.push({ x: head.x - size, y: head.y });
  }
  if (direction == "down") {
    snake.push({ x: head.x, y: head.y + size });
  }
  if (direction == "up") {
    snake.push({ x: head.x, y: head.y - size });
  }

  snake.shift();
};

const checkEat = () => {
  const head = snake.at(-1);

  if (head.x == food.x && head.y == food.y) {
    incrementScore();
    snake.push(head);
    audio.play();

    let x = randomPosition();
    let y = randomPosition();

    while (snake.find((position) => position.x == x && position.y == y)) {
      let x = randomPosition();
      let y = randomPosition();
    }
    food.x = x;
    food.y = y;
    food.color = randomColor();
  }
};

const drawGrid = () => {
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#191919";

  for (let i = 30; i < canvas.width; i += 30) {
    // Líneas verticales
    ctx.beginPath();
    ctx.moveTo(i, 0); // Cambia lineTo a moveTo para iniciar el trazo
    ctx.lineTo(i, 600);
    ctx.stroke();
  }

  for (let i = 30; i < canvas.height; i += 30) {
    // Líneas horizontales
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(canvas.width, i);
    ctx.stroke();
  }
};

const checkCollision = () => {
  const head = snake[snake.length - 1];
  const neckIndex = snake.length - 2;
  const canvasLimit = canvas.width - size;
  const wallCollition =
    head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit;

  const selfCollition = snake.find((position, index) => {
    return index < neckIndex && position.x == head.x && position.y == head.y;
  });

  if (wallCollition || selfCollition) {
    gameOver();
  }
};
const gameOver = () => {
  direction = undefined;

  menu.style.display = "flex";
  finalScore.innerText = score.innerText;
  canvas.style.filter = "blur(2px)";
};
const gameLoop = () => {
  clearInterval(loopId);
  ctx.clearRect(0, 0, 600, 600);

  // Dibuja la cuadrícula antes de la serpiente
  drawGrid();
  drawFood();
  moveSnake();
  drawSnake();
  checkEat();
  checkCollision();

  loopId = setInterval(() => {
    gameLoop();
  }, 300);
};

gameLoop();

document.addEventListener("keydown", ({ key }) => {
  console.log(key);
  if (key == "ArrowRight" && direction != "left") {
    direction = "right";
  }
  if (key == "ArrowLeft" && direction != "right") {
    direction = "left";
  }
  if (key == "ArrowDown" && direction != "up") {
    direction = "down";
  }
  if (key == "ArrowUp" && direction != "down") {
    direction = "up";
  }
});

buttonPlay.addEventListener("click", () => {
  score.innerText = "00";
  menu.style.display = "none";
  canvas.style.filter = "none";

  snake = [initialPosition];
});
