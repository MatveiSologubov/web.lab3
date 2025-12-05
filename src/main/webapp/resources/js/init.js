"use strict";

window.triggerSubmit = function () {
    const submitButton = document.querySelector('button[id$="submitButton"]');
    if (submitButton) {
        submitButton.click();
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
});