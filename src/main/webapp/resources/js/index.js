"use strict";

const MAX_X = 4;
const MIN_X = -4;
const MAX_Y = 3;
const MIN_Y = -3;
const INPUT_MAX_LENGTH = 13;

const STORAGE_KEYS = {
    CURRENT_R: 'currentR',
    X_VALUE: 'xValue',
    Y_VALUE: 'yValue',
};

const table = document.getElementById('resultsTable');
const xSpinnerInput = document.querySelector('input[id*="xSpinner_input"]');
const yInput = document.querySelector('input[id*="yInput"]');

function updatePointsData() {
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

function valuesOutOfBounds(xValue, yValue) {
    if (xValue > MAX_X || xValue < MIN_X) {
        return true;
    }

    return yValue > MAX_Y || yValue < MIN_Y;
}

function submitForm(actualX, actualY) {
    console.log(actualX, actualY);

    // TODO: Fix that abomination
    const roundedX = Math.round(actualX * 2) / 2;
    const roundedY = Math.round(actualY * 100) / 100;

    if (xSpinnerInput) {
        xSpinnerInput.value = roundedX;

        const event = new Event('change', {bubbles: true});
        xSpinnerInput.dispatchEvent(event);

        const inputEvent = new Event('input', {bubbles: true});
        xSpinnerInput.dispatchEvent(inputEvent);
    }

    if (yInput) {
        yInput.value = roundedY;

        const event = new Event('change', {bubbles: true});
        yInput.dispatchEvent(event);

        const inputEvent = new Event('input', {bubbles: true});
        yInput.dispatchEvent(inputEvent);
    }

    if (valuesOutOfBounds(actualX, actualY)) {
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
});
