"use strict";

const MAX_X = 4;
const MIN_X = -4;
const MAX_Y = 3;
const MIN_Y = -3;
const INPUT_MAX_LENGTH = 13;
const X_STEP_SIZE = 0.5;

const STORAGE_KEYS = {
    CURRENT_R: 'currentR',
    X_VALUE: 'xValue',
    Y_VALUE: 'yValue',
};

function updatePointsData() {
    const table = document.getElementById('resultsTable');
    if (!table) {
        return;
    }

    window.pointsData = [];

    const rows = table.querySelectorAll('tbody tr, tr:not(.ui-datatable-header)');
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length === 6) {
            const x = parseFloat(cells[0].textContent);
            const y = parseFloat(cells[1].textContent);
            const r = parseFloat(cells[2].textContent);
            const isHit = cells[3].textContent.trim() === 'HIT';
            const processTimeInMs = parseFloat(cells[4].textContent);
            const requestTime = cells[5].textContent;

            window.pointsData.push({
                x: x,
                y: y,
                r: r,
                isHit: isHit,
                requestTime: requestTime,
                processTimeInMs: processTimeInMs
            });
        }
    });

    scheduleRedraw();
}

function setXValue(value) {
    const xInput = document.querySelector('[id$=":xSpinner_input"]');
    if (xInput) {
        xInput.value = value;
        xInput.dispatchEvent(new Event('change', {bubbles: true}));
    }
}

function setYValue(value) {
    const yInput = document.querySelector('[id$=":yInput"]');
    if (yInput) {
        yInput.value = value;
        yInput.dispatchEvent(new Event('input'));
        yInput.dispatchEvent(new Event('change', {bubbles: true}));
    }
}

function setRValue(value) {
    const rInput = document.querySelector('[id$=":rSpinner_input"]');
    if (rInput) {
        rInput.value = value;
        rInput.dispatchEvent(new Event('change', {bubbles: true}));
    }
}

function valuesOutOfBounds(xValue, yValue) {
    if (xValue > MAX_X || xValue < MIN_X) {
        return true;
    }

    return yValue > MAX_Y || yValue < MIN_Y;
}

function submitForm(actualX, actualY) {
    const formattedX = Math.round(parseFloat(actualX) / X_STEP_SIZE) * X_STEP_SIZE;
    const formattedY = parseFloat(actualY).toFixed(2);

    setXValue(formattedX);
    setYValue(formattedY);

    if (valuesOutOfBounds(formattedX, formattedY)) {
        return;
    }

    displayPoint = null;

    const submitButton = document.querySelector('button[id$="submitButton"]');
    if (submitButton) {
        submitButton.click();
    }
}

function handleXChange(value) {
    sessionStorage.setItem(STORAGE_KEYS.X_VALUE, value);
}

function handleYChange(value) {
    sessionStorage.setItem(STORAGE_KEYS.Y_VALUE, value);
}

function handleRChange(value) {
    currentR = parseFloat(value);

    sessionStorage.setItem(STORAGE_KEYS.CURRENT_R, value);

    scheduleRedraw();
}

function formatTextInput(text) {
    let value = text.replace(/,/g, '.');

    value = value.replace(/[^\d.-]/g, '');

    if (value.includes('-')) {
        if (!value.startsWith('-')) {
            value = value.replace(/-/g, '');
        }

        const minusCount = (value.match(/-/g) || []).length;
        if (minusCount > 1) {
            value = '-' + value.replace(/-/g, '');
        }
    }

    const dotCount = (value.match(/\./g) || []).length;
    if (dotCount > 1) {
        const firstDotIndex = value.indexOf('.');

        const beforeFirstDot = value.substring(0, firstDotIndex + 1);
        const afterFirstDot = value.substring(firstDotIndex + 1);

        value = beforeFirstDot + afterFirstDot.replace(/\./g, '');
    }

    if (value.startsWith('.')) {
        value = '0' + value;
    } else if (value.startsWith('-.')) {
        value = '-0' + value.substring(1);
    }

    if (value.length > INPUT_MAX_LENGTH) {
        value = value.slice(0, INPUT_MAX_LENGTH);
    }

    return value;
}

function validateInput(input) {
    input.value = formatTextInput(input.value);
}

document.addEventListener('DOMContentLoaded', function () {
    initializeClock();

    updatePointsData();

    currentR = sessionStorage.getItem(STORAGE_KEYS.CURRENT_R) || 1;
    setRValue(currentR);

    let xValue = sessionStorage.getItem(STORAGE_KEYS.X_VALUE) || 1;
    setXValue(xValue);

    let yValue = sessionStorage.getItem(STORAGE_KEYS.Y_VALUE) || 1;
    setYValue(yValue);
});

