"use strict";

window.triggerSubmit = function () {
    const submitButton = document.querySelector('button[id$="submitButton"]');
    if (submitButton) {
        submitButton.click();
    }
};

window.updatePointsData = function() {
    const table = document.getElementById('resultsTable');
    if (!table) return;

    window.pointsData = [];

    const rows = table.querySelectorAll('tbody tr, tr:not(.ui-datatable-header)');
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 6) {
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

    if (typeof drawGraph === 'function') {
        const currentR = parseFloat(sessionStorage.getItem('currentR')) || 1;
        drawGraph(currentR);
    }
};

document.addEventListener('DOMContentLoaded', function () {
    const rValue = parseFloat(document.getElementById('currentRValue')?.value) || 1;
    if (rValue) {
        sessionStorage.setItem('currentR', rValue.toString());
    }

    if (typeof initializeClock === 'function') {
        initializeClock();
    }

    if (typeof drawGraph === 'function') {
        drawGraph(rValue || 1);
    }

    const rSelect = document.getElementById('rSpinner_input');
    if (rSelect) {
        rSelect.addEventListener('change', function (e) {
            const newR = parseFloat(e.target.value);
            if (newR && typeof drawGraph === 'function') {
                sessionStorage.setItem('currentR', newR.toString());
                drawGraph(newR);
            }
        });
    }

    if (window.updatePointsData) {
        window.updatePointsData();
    }
});