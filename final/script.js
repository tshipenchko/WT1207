/* Section Main: typing animation */
$(() => {
    const texts = [
        "Welcome to Typing Game!",
        "Practice your typing skills",
        "Improve your accuracy",
        "Increase your speed",
        "Have fun with typing!"
    ];

    let index = 0;
    let isTyping = true;
    let currentText = '';
    let letterIndex = 0;
    const $typingText = $('#typing-text');

    const type = () => {
        if (isTyping) {
            currentText = texts[index];
            $typingText.text(currentText.slice(0, ++letterIndex));

            if (letterIndex === currentText.length) {
                isTyping = false;
                setTimeout(erase, 3000);
            }
            setTimeout(type, 50);
        }
    };

    const erase = () => {
        if (!isTyping) {
            $typingText.text(currentText.slice(0, --letterIndex));

            if (letterIndex === 0) {
                isTyping = true;
                index = (index + 1) % texts.length;
                setTimeout(type, 500);
            }
            setTimeout(erase, 10);
        }
    };

    type();
});


/* Section HowTo: keyboard */
document.addEventListener("DOMContentLoaded", () => {
    const keyboardRows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM", " "];
    const keyboardText = keyboardRows.join("");
    const keyboardFragment = document.createDocumentFragment();

    const generateKeyboard = () => {
        keyboardRows.forEach(row => {
            const newRow = document.createElement("div");
            newRow.classList.add("row");

            row.split('').forEach(letter => {
                const key = document.createElement("div");
                key.classList.add("key");
                key.textContent = letter;
                newRow.appendChild(key);
            });

            keyboardFragment.appendChild(newRow);
        });

        const $keyboard = document.querySelector('.keyboard');
        $keyboard.appendChild(keyboardFragment);
    }

    const animateKeyboad = () => {
        const text = "Hello world".toUpperCase();
        const keys = Array.from(document.querySelectorAll('.keyboard .key'));

        let index = 0;
        const type = () => {
            const char = text[index];
            const charIndex = keyboardText.indexOf(char);
            const key = keys[charIndex];

            key.classList.add("active");
            setTimeout(() => {
                key.classList.remove("active");
            }, 1000);

            index = (index + 1) % text.length;

            setTimeout(type, index === 0 ? 2200 : 1100);
        }

        setTimeout(type, 1100);
    }

    generateKeyboard();
    animateKeyboad();
});


/* Section WhyPlay: carousel animation */
document.addEventListener("DOMContentLoaded", function () {
    const carousel = document.getElementById('why-play-carousel');
    const iconElements = carousel.querySelectorAll('.icon-element');

    carousel.addEventListener("slide.bs.carousel", (event) => {
        const activeSlide = event.relatedTarget;
        const activeIconElement = activeSlide.querySelector('.big-icon');

        iconElements.forEach((icon) => {
            icon.classList.remove("show");
        });

        activeIconElement.classList.add("show");
    });
});
