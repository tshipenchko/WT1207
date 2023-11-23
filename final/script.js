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
