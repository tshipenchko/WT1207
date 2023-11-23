let {words} = Window;

let wordsList = [];
let currentWordIndex = 0;
let inputHistory = [];
let currentInput = "";
let testActive = false;
let testStart, testEnd;
let missedChars = 0;
let wordsModeCount = 30;

let currentText = "The quick brown fox jumped over the lazy dog";
let customText = "The quick brown fox jumped over the lazy dog";

setInterval(() => {
    if (!testActive) return;
    let time = Math.round((Date.now() - testStart) / 1000);

    $timer.text((time < 10 ? "0" : "") + time);
}, 250);

setInterval(() => {
    if (!testActive) return;
    let time = Math.round((Date.now() - testStart) / 1000);
    let wroteTotal = wordsList.slice(0, currentWordIndex).join(" ").length;
    let wrote = Math.max(0, wroteTotal - missedChars);
    let wpm = Math.round(wrote / 5 / (time / 60));

    if (isNaN(wpm)) wpm = 0;
    else if (wpm === Infinity) wpm = 0;
    $lifeWPM.text((wpm < 10 ? "0" : "") + wpm);
}, 250);

// DOM jQuery elements
const $words = $("#words");
const $caret = $("#caret");
const $wordsInput = $("#wordsInput");
const $restartButton = $("#restartButton");
const $timer = $("#timer");
const $lifeWPM = $("#lifeWPM");
const $choices = $(".choice");


// Utils
const keyCodes = {
    backspace: 8,
    enter: 13,
    space: 32,
}

function generateText() {
    let generatedText = '';

    for (let i = 0; i < wordsModeCount; i++) {
        const randomIndex = Math.floor(Math.random() * words.length);
        const word = words[randomIndex];

        if (i === 0) {
            generatedText += word.charAt(0).toUpperCase() + word.slice(1);
        } else {
            generatedText += word;
        }

        generatedText += ' ';
    }

    return generatedText.trim();
}


function setFocus(focus) {
    if (focus) {
        $("body").css("cursor", "none");
        showCaret();
        stopCaretAnimation();
    } else {
        startCaretAnimation();
        $("body").css("cursor", "default");
    }
}

function initWords() {
    testActive = false;
    wordsList = [];
    currentWordIndex = 0;
    missedChars = 0;
    inputHistory = [];
    currentInput = "";

    // if (testMode == "custom")
    wordsList = [...currentText.split(" ")];

    showWords();
}

function showWords() {
    $words.empty();

    const wordDivs = wordsList.map(word => $("<span>", {
        class: "word",
        html: word.split('').map(letter => `<span class="letter">${letter}</span>`).join("")
    }));

    $words.append(wordDivs);

    updateActiveElement();
    updateCaretPosition();
}

function updateActiveElement() {
    const $word = $("#words .word");

    $word.removeClass("active");
    $word.eq(currentWordIndex).addClass("active").removeClass("error");
}

function highlightBadWord() {
    $(".word.active").addClass("error");
}

function hideCaret() {
    $caret.addClass("d-none");
}

function showCaret() {
    $caret.removeClass("d-none");
    startCaretAnimation();
}

function stopCaretAnimation() {
    $caret.css("animation-name", "none");
}

function startCaretAnimation() {
    $caret.css("animation-name", "caretFlash");
}

function updateCaretPosition() {
    let inputLen = currentInput.length;
    let currentLetterIndex = inputLen - 1;
    if (currentLetterIndex === -1) {
        currentLetterIndex = 0;
    }
    let currentLetter = $($("#words .word.active .letter")[currentLetterIndex]);
    let currentLetterPos = currentLetter.position();
    let letterHeight = currentLetter.height();

    if (inputLen === 0) {
        $caret.css({
            top: currentLetterPos.top - letterHeight / 4,
            left: currentLetterPos.left - $caret.width() / 2
        });
    } else {
        $caret.css({
            top: currentLetterPos.top - letterHeight / 4,
            left: currentLetterPos.left + currentLetter.width() - $caret.width() / 2
        });
    }
}

function restartTest() {
    let oldHeight = $words.height();
    setFocus(false);
    $wordsInput.focus();
    currentText = generateText();
    initWords();
    testActive = false;
    startCaretAnimation();
    $lifeWPM.text("00");
    $timer.text("00");
    let newHeight = $words.css("height", "fit-content").height();
    $words
        .stop(true, true)
        .css("height", oldHeight)
        .animate({height: newHeight}, 250, () => {
            $words.css("height", "fit-content");
            updateCaretPosition();
        });
}

function changeCustomText() {
    currentText = prompt("Enter your custom text", customText);
    wordsModeCount = 0;
    initWords();
}

function compareInput() {
    const $activeWord = $(".word.active");

    $activeWord.empty();
    let ret = "";
    let currentWord = wordsList[currentWordIndex];
    for (let i = 0; i < currentInput.length; i++) {
        if (currentWord[i] === currentInput[i]) {
            ret += `<span class="letter correct">${currentWord[i]}</span>`;
        } else if (currentWord[i] === undefined) {
            ret += `<span class="letter incorrect extra">${currentInput[i]}</span>`;
        } else {
            ret += `<span class="letter incorrect">${currentWord[i]}</span>`;
        }
    }
    if (currentInput.length < currentWord.length) {
        for (let i = currentInput.length; i < currentWord.length; i++) {
            ret += `<span class="letter">${currentWord[i]}</span>`;
        }
    }
    if (currentWord === currentInput && currentWordIndex === wordsList.length - 1) {
        inputHistory.push(currentInput);
        currentInput = "";
        showResult();
    }

    $activeWord.html(ret);
}

function showResult() {
    testEnd = Date.now();
    testActive = false;
    // alert("Test finished");
}

function onFocusedBackspace(event) {
    if (currentInput === "" && inputHistory.length > 0) {
        if (
            inputHistory[currentWordIndex - 1] ===
            wordsList[currentWordIndex - 1] ||
            $($(".word")[currentWordIndex - 1]).hasClass("hidden")
        ) {
            return;
        } else {
            if (event.ctrlKey || event.altKey) {
                currentInput = "";
                inputHistory.pop();
            } else {
                currentInput = inputHistory.pop();
            }
            currentWordIndex--;
            updateActiveElement();
            compareInput();
        }
    } else {
        if (event["ctrlKey"]) {
            currentInput = "";
        } else {
            currentInput = currentInput.substring(0, currentInput.length - 1);
        }
        compareInput();
    }
    updateCaretPosition();
}

function onFocusedSpace() {
    if (currentInput === "") return;
    let currentWord = wordsList[currentWordIndex];

    if (currentWord === currentInput) {
        inputHistory.push(currentInput);
        currentInput = "";
        currentWordIndex++;
        updateActiveElement();
        updateCaretPosition();
    } else {
        inputHistory.push(currentInput);
        highlightBadWord();
        currentInput = "";
        currentWordIndex++;
        if (currentWordIndex === wordsList.length) {
            showResult();
            return;
        }
        updateActiveElement();
        updateCaretPosition();
    }
}


// Main entry point
$(() => restartTest())


// ctrl+backspace and space events
$(document).keydown((event) => {
    if (!$wordsInput.is(":focus")) return;

    if (event.keyCode === keyCodes.backspace) {
        event.preventDefault();
        if (!testActive) return;
        onFocusedBackspace(event);
    }
    if (event.keyCode === keyCodes.space) {
        if (!testActive) return;
        event.preventDefault();
        onFocusedSpace();
    }
});

// Main text input source
$(document).keypress((event) => {
    if (!$wordsInput.is(":focus")) return;
    if (event.keyCode === keyCodes.enter) return;
    if (event.keyCode === keyCodes.space) return;
    if (currentInput === "" && inputHistory.length === 0) {
        testActive = true;
        stopCaretAnimation();
        setFocus(true);
        testStart = Date.now();
    } else if (!testActive) return;

    if (
        wordsList[currentWordIndex].substring(
            currentInput.length,
            currentInput.length + 1
        ) !== event.key
    ) missedChars++;

    currentInput += event.key;
    setFocus(true);
    compareInput();
    updateCaretPosition();
});


$wordsInput.keypress((event) => event.preventDefault());
$words.click(() => $wordsInput.focus());
$wordsInput.on("focus", () => showCaret());
$wordsInput.on("focusout", () => hideCaret());
$restartButton.click(() => restartTest());
$restartButton.keypress((event) => {
    if (event.keyCode !== keyCodes.enter) return;

    restartTest();
    $wordsInput.focus();
});

$(window).resize(() => updateCaretPosition());
$(document).mousemove(() => setFocus(false));

// Some choices
$choices.each((index, choice) => {
    $(choice).click(() => {
        const text = $(choice).text();
        if (text === "custom text") {
            changeCustomText();
            $choices.removeClass("active");
            choice.classList.add("active");
            return;
        }

        const wordsCount = parseInt(text);
        if (isNaN(wordsCount)) return;

        wordsModeCount = wordsCount;
        currentText = generateText();
        initWords();
        $choices.removeClass("active");
        choice.classList.add("active");
    });
});
