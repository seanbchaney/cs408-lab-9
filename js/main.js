// set up canvas

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

// Score counter
const scoreDisplay = document.querySelector("p");
let ballCount = 0;

// function to generate random number
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function to generate random RGB color value
function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

// Shape class
class Shape {
  constructor(x, y, velX, velY) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
  }
}

// Ball class
class Ball extends Shape {
  constructor(x, y, velX, velY, color, size) {
    super(x, y, velX, velY);
    this.color = color;
    this.size = size;
    this.exists = true;
    ballCount++;
    updateScore();
  }

  draw() {
    if (!this.exists) return;
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  update() {
    if (!this.exists) return;
    if (this.x + this.size >= width || this.x - this.size <= 0) {
      this.velX = -this.velX;
    }
    if (this.y + this.size >= height || this.y - this.size <= 0) {
      this.velY = -this.velY;
    }
    this.x += this.velX;
    this.y += this.velY;
  }

  collisionDetect() {
    if (!this.exists) return;
    for (const ball of balls) {
      if (ball.exists && ball !== this) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < this.size + ball.size) {
          ball.color = this.color = randomRGB();
        }
      }
    }
  }
}

// EvilCircle class
class EvilCircle extends Shape {
  constructor(x, y) {
    super(x, y, 12.5, 12.5);
    this.size = 12.5;
    this.color = "white";
    this.keys = { a: false, d: false, w: false, s: false };

    window.addEventListener("keydown", (e) => this.keys[e.key] = true);
    window.addEventListener("keyup", (e) => this.keys[e.key] = false);
  }

  draw() {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
  }

  checkBounds() {
    if (this.x - this.size <= 0) this.x = this.size;
    if (this.x + this.size >= width) this.x = width - this.size;
    if (this.y - this.size <= 0) this.y = this.size;
    if (this.y + this.size >= height) this.y = height - this.size;
  }

  move() {
    if (this.keys["a"]) this.x -= this.velX;
    if (this.keys["d"]) this.x += this.velX;
    if (this.keys["w"]) this.y -= this.velY;
    if (this.keys["s"]) this.y += this.velY;
  }

  collisionDetect() {
    for (const ball of balls) {
      if (ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < this.size + ball.size) {
          ball.exists = false;
          ballCount--;
          updateScore();
        }
      }
    }
  }
}

// Ball array
const balls = [];
while (balls.length < 25) {
  const size = random(10, 20);
  const ball = new Ball(
    random(size, width - size),
    random(size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomRGB(),
    size
  );
  balls.push(ball);
}

// EvilCircle instance
const evil = new EvilCircle(width / 2, height / 2);

// Score updater
function updateScore() {
  scoreDisplay.textContent = `Ball count: ${ballCount}`;
}

// Animation loop
function loop() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, width, height);
  for (const ball of balls) {
    ball.draw();
    ball.update();
    ball.collisionDetect();
  }
  evil.draw();
  evil.checkBounds();
  evil.move();
  evil.collisionDetect();
  requestAnimationFrame(loop);
}
loop();
