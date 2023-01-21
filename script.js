const bill = document.getElementById("bill");

function jump() {
  if (bill.classList != "jump") {
    bill.classList.add("jump");

    setTimeout(() => {
      bill.classList.remove("jump");
    }, 300);
  }
}

document.addEventListener("keydown", (e) => {
  jump();
});