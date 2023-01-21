const bill = document.getElementById("bill");
const chair = document.getElementById("chair");


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
let isDead = setInterval(() => {

  let billRect = bill.getBoundingClientRect();
  let chairRect = chair.getBoundingClientRect();

  if (chairRect.left < billRect.right &&
    chairRect.top < billRect.bottom &&
    chairRect.right > billRect.left &&
    chairRect.bottom > billRect.top) {
    alert("Game Over")
  }

}, 10)


// Event listener for keydown to make Bill jump
document.addEventListener("keydown", (e) => {
  jump();
});