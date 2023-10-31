$(() => {
    const $firstNumber = $("#firstNumber");
    const $secondNumber = $("#secondNumber");
    const $operator = $("#operator");
    const $resultNumber = $("#resultNumber");

    const calculate = () => {
        const firstNumber = parseFloat($firstNumber.val());
        const secondNumber = parseFloat($secondNumber.val());
        const operator = $operator.val();

        switch (operator) {
            case "addition":
                $resultNumber.val(firstNumber + secondNumber);
                break;
            case "subtraction":
                $resultNumber.val(firstNumber - secondNumber);
                break;
            case "multiplication":
                $resultNumber.val(firstNumber * secondNumber);
                break;
            case "division":
                if (secondNumber === 0) {
                    $resultNumber.val("You can't divide by zero!");
                    break;
                }

                $resultNumber.val(firstNumber / secondNumber);
                break;
            case "modulus":
                if (secondNumber === 0) {
                    $resultNumber.val("You can't divide by zero!");
                    break;
                }

                $resultNumber.val(firstNumber % secondNumber);
                break;
            case "power":
                $resultNumber.val(Math.pow(firstNumber, secondNumber));
                break;
            default:
                $resultNumber.val("OMG! You hacked my calculator!");
        }
    }

    calculate();
    $firstNumber.on("input", calculate);
    $secondNumber.on("input", calculate);
    $operator.on("change", calculate);
})
