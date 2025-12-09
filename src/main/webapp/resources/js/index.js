"use strict";

const MAX_X = 4;
const MIN_X = -4;
const MAX_Y = 3;
const MIN_Y = -3;

function updatePointsData() {
    const table = document.getElementById('resultsTable');
    if (!table) return;

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

    // TODO: Don't access session storage every time
    currentR = parseFloat(sessionStorage.getItem('currentR')) || 1;
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

    const xSpinnerInput = document.querySelector('input[id*="xSpinner_input"]');
    if (xSpinnerInput) {
        xSpinnerInput.value = roundedX;

        const event = new Event('change', {bubbles: true});
        xSpinnerInput.dispatchEvent(event);

        const inputEvent = new Event('input', {bubbles: true});
        xSpinnerInput.dispatchEvent(inputEvent);
    }

    const yInput = document.querySelector('input[id*="yInput"]');
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

function handleRChange(value) {
    currentR = parseFloat(value);

    sessionStorage.setItem('currentR', value);

    scheduleRedraw();
}

document.addEventListener('DOMContentLoaded', function () {
    initializeClock();

    updatePointsData();
});
