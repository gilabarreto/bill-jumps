const bill = document.querySelector("[data-bill");
const chair = document.querySelector("[data-chair]");
const start = document.querySelector("[data-start]");
const scoreElem = document.querySelector("[data-score]");
const errorSound = new Audio("./public/sounds/WinError.mp3")

let score = 0;
let isRunning = false;
let billFrame = 0;

document.addEventListener("keydown", handleStart);

// Fucntion to start the game
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
  bill.src = "public/imgs/bill-still.png"
  document.body.style.backgroundImage = `url('public/imgs/bg/bg-${Math.floor(Math.random() * 10) + 1}.png')`
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
    bill.src = "public/imgs/bill-still.png"
  }
  runInterval = setTimeout(() => {
    bill.src = `public/imgs/bill-${billFrame}.png`
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

// Function to check if Bill hits the chair
const handleCollision = () => {
  collisionInterval = setInterval(() => {

    const billRect = bill.getBoundingClientRect();
    const chairRect = chair.getBoundingClientRect();

    if (chairRect.left < billRect.right &&
      chairRect.top < billRect.bottom &&
      chairRect.right > billRect.left &&
      chairRect.bottom > billRect.top) {
      errorSound.play();
      bill.src = "public/imgs/bill-dead.png"
      isRunning = false;
      clearInterval(runInterval)
      clearInterval(collisionInterval)
      clearInterval(scoreInterval)
      setTimeout(() => {
        alert("Game Over")
        reset()
      }, 15)
    }
  }, 10)
}

// Event listener for keydown to make Bill jump
document.addEventListener("keydown", (e) => {
  jump();
});