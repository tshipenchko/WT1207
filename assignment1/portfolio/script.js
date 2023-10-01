const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

const randomChar = () => chars[Math.floor(Math.random() * (chars.length - 1))];
const randomString = length => Array.from(Array(length)).map(randomChar).join("");

const card = document.querySelector("#logo-animation .animated-logo");
const letters = card.querySelector(".card-letters");

const handleOnMove = e => {
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  letters.style.setProperty("--x", `${x}px`);
  letters.style.setProperty("--y", `${y}px`);

  letters.innerText = randomString(1500);
}

card.onmousemove = e => handleOnMove(e);
card.ontouchmove = e => handleOnMove(e.touches[0]);
