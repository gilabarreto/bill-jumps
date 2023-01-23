const bill = document.querySelector("[data-bill");
const chair = document.querySelector("[data-chair]");
const start = document.querySelector("[data-start]");
const scoreElem = document.querySelector("[data-score]");

let score = 0;
let isRunning = false;
let billFrame = 0;

document.addEventListener("keydown", handleStart);

function handleStart() {
  if (isRunning) {
    return;
  }
  isRunning = true;
  start.classList.add("hide")
  chair.classList.add("run");
  handleRun();
  handleScore();
  handleCollision();
}

// Function to reset the game
function reset() {
  score = 0;
  scoreElem.innerHTML = score;
  bill.src = "imgs/bill-still.png"
  start.classList.remove("hide")
  chair.classList.remove("run");
}

// Function to update score
const handleScore = () => {
  scoreInterval = setInterval(() => {
    score += 1;
    scoreElem.innerHTML = score;
  }, 100);
}

// Function to handle run 
const handleRun = () => {
  if (bill.classList == "jump") {
    bill.src = "imgs/bill-still.png"
  }
  runInterval = setTimeout(() => {
    bill.src = `imgs/bill-${billFrame}.png`
    if (billFrame === 0) {
      billFrame = 1;
    } else {
      billFrame = 0;
    } handleRun()
  }, 100);
}

// Function to make Bill jump
function jump() {
  // Check if is jumping, add jump class and remove it
  if (bill.classList != "jump") {
    bill.classList.add("jump");

    setTimeout(() => {
      bill.classList.remove("jump");
    }, 300);
  }
}

// Function to check if Bill hit the chair
const handleCollision = () => {
  collisionInterval = setInterval(() => {

    const billRect = bill.getBoundingClientRect();
    const chairRect = chair.getBoundingClientRect();

    if (chairRect.left < billRect.right &&
      chairRect.top < billRect.bottom &&
      chairRect.right > billRect.left &&
      chairRect.bottom > billRect.top) {
      bill.src = "imgs/bill-dead.png"
      isRunning = false;
      clearInterval(runInterval)
      clearInterval(collisionInterval)
      clearInterval(scoreInterval)
      setTimeout(() => {
        if (confirm("Game Over")) {
          reset()
        }
      }, 15)
    }
  }, 10)
}

// Event listener for keydown to make Bill jump
document.addEventListener("keydown", (e) => {
  jump();
});