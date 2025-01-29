let display = document.getElementById('display');
let currentInput = '0';
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;

document.querySelectorAll('.buttons button').forEach(button => {
    button.addEventListener('click', () => handleInput(button.dataset.value));
});

document.addEventListener('keydown', (e) => {
    const key = e.key.toUpperCase();
    if (/^[0-9A-F\.\+\-\*\/=C]|Backspace|Enter/.test(key)) {
        e.preventDefault();
        handleInput(key === 'Enter' ? '=' : key === 'Backspace' ? '←' : key);
    }
});

function handleInput(value) {
    if (value === 'C') {
        resetCalculator();
    } else if (value === '←') {
        currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : '0';
    } else if (value === '.') {
        if (!currentInput.includes('.')) {
            currentInput += '.';
        }
    } else if (isHexDigit(value)) {
        if (waitingForSecondOperand) {
            currentInput = value;
            waitingForSecondOperand = false;
        } else {
            currentInput = currentInput === '0' ? value : currentInput + value;
        }
    } else if (isOperator(value)) {
        handleOperator(value);
    } else if (value === '=') {
        performCalculation();
    }
    
    updateDisplay();
}

function isHexDigit(value) {
    return /^[0-9A-F]$/i.test(value);
}

function isOperator(value) {
    return /^[\+\-\*\/]$/.test(value);
}

function handleOperator(nextOperator) {
    const inputValue = parseFloat(currentInput, 16);
    
    if (operator && waitingForSecondOperand) {
        operator = nextOperator;
        return;
    }
    
    if (firstOperand === null) {
        firstOperand = inputValue;
    } else if (operator) {
        const result = calculate(firstOperand, inputValue, operator);
        currentInput = result.toString(16).toUpperCase();
        firstOperand = result;
    }
    
    waitingForSecondOperand = true;
    operator = nextOperator;
}

function performCalculation() {
    if (operator === null || waitingForSecondOperand) return;
    
    const inputValue = parseFloat(currentInput, 16);
    const result = calculate(firstOperand, inputValue, operator);
    
    currentInput = Number.isInteger(result) ? 
        result.toString(16).toUpperCase() : 
        result.toString(16).toUpperCase();
    
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
}

function calculate(first, second, operator) {
    switch(operator) {
        case '+': return first + second;
        case '-': return first - second;
        case '*': return first * second;
        case '/': return second !== 0 ? first / second : NaN;
        default: return second;
    }
}

function resetCalculator() {
    currentInput = '0';
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
}

function updateDisplay() {
    display.textContent = currentInput.toUpperCase();
}

// Initialize calculator
resetCalculator();