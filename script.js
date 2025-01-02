document.addEventListener('DOMContentLoaded', () => {
    primary.value = '0'; // initialization
});

// selector variables
const numBtn = document.querySelectorAll('.btn');
const periodBtn = document.querySelector('.btn-period')
const operationBtn = document.querySelectorAll('.btn-operation');
const equalBtn = document.querySelector('.btn-equal');
const deleteBtn = document.querySelector('.btn-delete');
const clearBtn = document.querySelector('.btn-clear');
const primary = document.querySelector('.primary');
const secondary = document.querySelector('.secondary');
const operators = ["+", "-", "/", "*"]; // check for operators
// boolean variables
let resetInput = true; // reset the primary input ?
let resetSolution = false;  // reset solution ?
let secondaryFilled = false; // is secondary input filled ?
let resultUndefined = false; // result is undefined ?
// holders variables
var saved = '';
var solution = '';
var compute = '';
var result = '';
// symbols
const symbols = new Map([
    [' × ', '*'],
    [' ÷ ', '/'],
]);


// functions
const handleOperation = (operation) => {
    // resetInput is false and the secondary is filled and there are operator in secondary
    if (resetInput != true && secondaryFilled != false && operators.some(char => secondary.value.includes(char))) {
        // compute the secondary and primary
        compute = secondary.value + primary.value;
        result = math.evaluate(compute);
        primary.value = result;
        secondary.value = result + operation;
    } else {
        // fill the secondary with input from primary
        secondary.value = primary.value + operation;
        secondaryFilled = true; // secondary is now filled
    }
};

const firstComputation = () => {
    solution = secondary.value += primary.value + '=';
    compute = solution.replace(/=/g, "");
    result = math.evaluate(compute);
    secondary.value = solution;
    primary.value = result;
    resetSolution = true;
};

const continousComputation = () => {
    const num1 = primary.value;
    solution = secondary.value.replace(/^-?\d*\.?\d+(?=\s*[+\-/*])/, num1);
    compute = solution.replace(/=/g, "");
    result = math.evaluate(compute);
    secondary.value = solution;
    primary.value = result;
    resetSolution = true;
}

const computeSaved = () => {
    // load and compute the saved
    const num1 = primary.value;
    solution = saved.replace(/^-?\d*\.?\d+(?=\s*[+\-/*])/, num1);
    compute = solution.replace(/=/g, "");
    result = math.evaluate(compute);
    secondary.value = solution;
    primary.value = result;

    // clear saved
    saved = '';
    // reset solution on input
    resetSolution = true;
};

const deleteFunction = () => {
    if (resetInput != false) {
        secondary.value = '';
    } else {
        if (primary.value.length != 1) {
            primary.value = primary.value.slice(0, -1);
        } else {
            primary.value = '0'; // prevents empty input
            resetInput = true; // allow resetInput
        }
    }
};

const clearFunction = () => {
    primary.value = '0';
    secondary.value = '';
    saved = '';
    resetInput = true;
    resetSolution = false;
    secondaryFilled = false;
};

// number input
numBtn.forEach((num) => {
    num.addEventListener('click', () => {
        const input = num.getAttribute('data-value');

        // normal computation already happen ex. (1+2=3)
        if (resetInput != false && secondary.value.includes('=') && operators.some(char => secondary.value.includes(char))) {
            saved = secondary.value; // save the secondary value
        }

        if (resetSolution != false) {
            secondary.value = '';
            resetSolution = false;
        }

        // number input
        if (resetInput != true) { // resetInput is false
            primary.value += input; // append the inputed numbers
        } else {
            primary.value = input; // set the existing number
            resetInput = false; // dont set the next numbers
        }
    
    });
});

// period input
periodBtn.addEventListener('click', () => {
    if (!primary.value.includes('.')){
        primary.value += '.';
        resetInput = false;
    }
});


// operation input
operationBtn.forEach((operation) => {
    operation.addEventListener('click', () => {
        const input = operation.getAttribute('data-value');

        // disable solution reset
        resetSolution = false;
        // clear saved
        saved = '';
        // handle the operation process
        handleOperation(input);
        // operation is clicked start a new input
        resetInput = true;

    });
});

// equal input
equalBtn.addEventListener('click', () => {

    if (resetInput != true && secondaryFilled != false && operators.some(char => secondary.value.includes(char))) {
        // first computation
        firstComputation();
    } else if (operators.some(char => secondary.value.includes(char))) {
        if (secondary.value.includes('=')) {
            // first computation already happen
            continousComputation();
        } else {
            // catches operation recomputation after first computation
            firstComputation();
        }
    } else {
        // default equal input
        secondary.value = primary.value + '=';
    }

    // load and compute the saved
    if (saved != '') {
        computeSaved();
    }
    // euqal is clicked start a new input
    resetInput = true;

});


// delete input
deleteBtn.addEventListener('click', () => {
    deleteFunction();
});

// clear input
clearBtn.addEventListener('click', () => {
    clearFunction();
});