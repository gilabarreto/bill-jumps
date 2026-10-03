const bill = document.querySelector("[data-bill]");
const chair = document.querySelector("[data-chair]");
const start = document.querySelector("[data-start]");
const scoreElem = document.querySelector("[data-score]");
const game = document.querySelector(".game");
const errorSound = new Audio("./public/sounds/WinError.mp3");

const CHAIR_START = 93; // % from the left where the chair spawns
const CHAIR_END = -2; // % from the left where the chair leaves the screen
const BASE_SPEED = 95; // % per second, one chair per second
const MAX_SPEED = BASE_SPEED * 2;

let best = Number(localStorage.getItem("bill-best")) || 0;
let score = 0;
let isRunning = false;
let gameOverAt = -Infinity;
let runTime, lastTime, chairX;

renderScore();

// Show one section of the window, hide the others
function show(section) {
  for (const el of document.querySelectorAll(".about, .help, .game")) {
    el.classList.toggle("active", el.classList.contains(section));
  }
  // Pause any video playing in the section we're leaving
  for (const iframe of document.querySelectorAll("iframe[src]")) {
    iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', "*");
  }
  // YouTube embeds only load when first opened
  const video = document.querySelector(`.${section} iframe:not([src])`);
  if (video) video.src = video.dataset.src;
}

document.querySelector(".span-about").addEventListener("click", () => show("about"));
document.querySelector(".span-help").addEventListener("click", () => show("help"));
document.getElementById("bill-icon").addEventListener("click", () => show("game"));

// Any key or tap starts the game, then makes Bill jump
document.addEventListener("keydown", (e) => {
  if (e.repeat || e.key === "Tab" || !game.classList.contains("active")) return;
  if (e.key === " ") e.preventDefault(); // Keep space from clicking a focused button
  handleInput();
});
game.addEventListener("pointerdown", handleInput);
bill.addEventListener("animationend", () => bill.classList.remove("jump"));

function handleInput() {
  if (isRunning) {
    bill.classList.add("jump");
  } else if (performance.now() - gameOverAt > 500) {
    // Short cooldown so a mashed key doesn't skip the game over screen
    startGame();
  }
}

function startGame() {
  isRunning = true;
  runTime = 0;
  chairX = CHAIR_START;
  start.classList.add("hide");
  lastTime = performance.now();
  requestAnimationFrame(loop);
}

// Game loop: move the chair, animate Bill, update score and check collision
function loop(now) {
  if (!isRunning) return;
  requestAnimationFrame(loop);

  // Clamp so a background tab doesn't teleport the chair
  const dt = Math.min(now - lastTime, 50);
  lastTime = now;
  // Paused while About or Help is open
  if (!game.classList.contains("active")) return;

  runTime += dt;
  score = Math.floor(runTime / 100);
  renderScore();

  // Chair gets faster as the score grows
  const speed = Math.min(BASE_SPEED * (1 + score / 500), MAX_SPEED);
  chairX -= (speed * dt) / 1000;
  if (chairX < CHAIR_END) chairX = CHAIR_START;
  chair.style.left = `${chairX}%`;

  setBill(bill.classList.contains("jump") ? "still" : score % 2);

  if (isColliding()) gameOver(now);
}

function gameOver(now) {
  isRunning = false;
  gameOverAt = now;
  errorSound.currentTime = 0;
  errorSound.play();
  setBill("dead");
  if (score > best) {
    best = score;
    localStorage.setItem("bill-best", best);
  }
  renderScore();
  start.textContent = "Game Over - Press Any Key Or Click To Restart";
  start.classList.remove("hide");
  document.body.style.backgroundImage = `url('public/imgs/bg/bg-${Math.floor(Math.random() * 10) + 1}.png')`;
}

function renderScore() {
  const pad = (n) => String(n).padStart(5, "0");
  scoreElem.textContent = `HI ${pad(best)} - ${pad(score)}`;
}

function setBill(frame) {
  const src = `public/imgs/bill-${frame}.png`;
  if (!bill.src.endsWith(src)) bill.src = src;
}

// Shrink a box so the transparent edges of the images don't count as hits
function hitbox(el) {
  const r = el.getBoundingClientRect();
  const dx = r.width * 0.2;
  const dy = r.height * 0.1;
  return { left: r.left + dx, right: r.right - dx, top: r.top + dy, bottom: r.bottom - dy };
}

function isColliding() {
  const b = hitbox(bill);
  const c = hitbox(chair);
  return c.left < b.right && c.top < b.bottom && c.right > b.left && c.bottom > b.top;
}
