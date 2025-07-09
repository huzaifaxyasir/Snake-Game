const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const box = 20;
let score = 0;
let highScore = 0;
let snake, food, dx, dy;
let gameLoop, lastTime = 0, speed = 8;

// Sound effects
const eatSound = new Audio('eat.mp3');
const gameOverSound = new Audio('gameover.mp3');

const landing = document.getElementById('landing');
const gameContainer = document.getElementById('gameContainer');
const gameOverScreen = document.getElementById('gameOver');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const homeBtn = document.getElementById('homeBtn');
const scoreDisplay = document.getElementById('currentScore');
const highScoreDisplay = document.getElementById('highScore');
const finalScore = document.getElementById('finalScore');
const difficultySelect = document.getElementById('difficultySelect');

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);
homeBtn.addEventListener('click', goHome);

function startGame() {
  landing.style.display = 'none';
  gameOverScreen.style.display = 'none';
  gameContainer.style.display = 'block';

  speed = parseInt(difficultySelect.value);
  score = 0;
  snake = [{ x: 15 * box, y: 15 * box }];
  food = randomFood();
  dx = 0; dy = 0;

  updateHUD();

  document.addEventListener('keydown', setDirection);

  cancelAnimationFrame(gameLoop);
  lastTime = 0;
  gameLoop = requestAnimationFrame(draw);
}

function goHome() {
  gameOverScreen.style.display = 'none';
  landing.style.display = 'block';
}

function randomFood() {
  let newFood;
  do {
    newFood = {
      x: Math.floor(Math.random() * (canvas.width / box)) * box,
      y: Math.floor(Math.random() * (canvas.height / box)) * box
    };
  } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
  return newFood;
}

function setDirection(event) {
  const key = event.key;
  if (key === 'ArrowLeft' && dx === 0) { dx = -box; dy = 0; }
  else if (key === 'ArrowUp' && dy === 0) { dx = 0; dy = -box; }
  else if (key === 'ArrowRight' && dx === 0) { dx = box; dy = 0; }
  else if (key === 'ArrowDown' && dy === 0) { dx = 0; dy = box; }
}

function draw(currentTime) {
  if (!lastTime) lastTime = currentTime;
  const deltaTime = (currentTime - lastTime) / 1000;

  if (deltaTime > 1 / speed) {
    lastTime = currentTime;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = `${box}px Arial`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('🍎', food.x, food.y);

    if (dx !== 0 || dy !== 0) {
      const head = { x: snake[0].x + dx, y: snake[0].y + dy };

      if (
        head.x < 0 || head.y < 0 ||
        head.x >= canvas.width || head.y >= canvas.height ||
        collision(head, snake)
      ) {
        gameOverSound.play();
        showGameOver();
        return;
      }

      snake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        score++;
        eatSound.play();
        if (score > highScore) highScore = score;
        updateHUD();
        food = randomFood();
      } else {
        snake.pop();
      }
    }

    for (let i = 0; i < snake.length; i++) {
      ctx.fillStyle = i === 0 ? '#ffe1b9' : '#ad853a';
      ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }
  }

  gameLoop = requestAnimationFrame(draw);
}

function updateHUD() {
  scoreDisplay.innerText = `Score: ${score}`;
  highScoreDisplay.innerText = `High Score: ${highScore}`;
}

function collision(head, array) {
  return array.some(segment => segment.x === head.x && segment.y === head.y);
}

function showGameOver() {
  cancelAnimationFrame(gameLoop);
  gameContainer.style.display = 'none';
  gameOverScreen.style.display = 'block';
  finalScore.innerText = `Your final score: ${score}`;
}
