"use strict"

const STORAGE_KEYS = {
    CURRENT_R: 'currentR',
    X_VALUE: 'xValue',
    Y_VALUE: 'yValue',
    NO_REDIRECT: 'noRedirect',
    AUTO_SUBMIT: 'autoSubmit',
    SETTINGS_VISIBLE: 'settingsVisible'
};

const MIN_X_VALUE = -3;
const MAX_X_VALUE = 5;
const INPUT_MAX_LENGTH = 13;

let currentR = parseFloat(sessionStorage.getItem(STORAGE_KEYS.CURRENT_R)) || 1;

function loadSettings() {
    const savedR = sessionStorage.getItem(STORAGE_KEYS.CURRENT_R);
    if (savedR && rSelect) {
        rSelect.value = savedR;
        currentR = parseFloat(savedR);
    }

    const savedX = sessionStorage.getItem(STORAGE_KEYS.X_VALUE);
    if (savedX && xInput) {
        xInput.value = savedX;
        validateXInput(savedX);
    }

    const savedY = sessionStorage.getItem(STORAGE_KEYS.Y_VALUE);
    if (savedY && yRadioGroup) {
        const yRadio = document.querySelector(`input[name="y"][value="${savedY}"]`);
        if (yRadio) {
            yRadio.checked = true;
        }
    }

    const savedNoRedirect = sessionStorage.getItem(STORAGE_KEYS.NO_REDIRECT);
    if (savedNoRedirect && noRedirectCheckbox) {
        noRedirectCheckbox.checked = savedNoRedirect === 'true';
    }

    const savedAutoSubmit = sessionStorage.getItem(STORAGE_KEYS.AUTO_SUBMIT);
    if (savedAutoSubmit && autoSubmitCheckbox) {
        autoSubmitCheckbox.checked = savedAutoSubmit === 'true';
    }

    const settingsVisible = sessionStorage.getItem(STORAGE_KEYS.SETTINGS_VISIBLE);
    updateSettingsPanelVisibility(settingsVisible === 'true');
}

function updateSettingsPanelVisibility(isVisible) {
    if (settingsPanel) {
        settingsPanel.style.display = isVisible ? 'block' : 'none';

        const icon = settingsToggle?.querySelector('i');
        if (icon) {
            icon.className = isVisible ? 'fas fa-times' : 'fas fa-cog';
        }
    }
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

function validateXInput(value) {
    if (value === '' || value === '-') return false;

    const numValue = parseFloat(value);
    const outOfBounds = isNaN(numValue) || numValue < MIN_X_VALUE || numValue > MAX_X_VALUE;

    if (errorElement) {
        if (outOfBounds) {
            errorElement.style.display = 'flex';
            if (xInput) xInput.classList.add('input-error');
            if (submitButton) submitButton.disabled = true;
        } else {
            errorElement.style.display = 'none';
            if (xInput) xInput.classList.remove('input-error');
            if (submitButton) submitButton.disabled = false;
        }
    }

    return outOfBounds;
}

function handleXInputChange(e) {
    const formattedValue = formatTextInput(e.target.value);
    e.target.value = formattedValue;
    sessionStorage.setItem(STORAGE_KEYS.X_VALUE, formattedValue);
}

function handleXInputPaste(e) {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text');
    if (xInput) {
        xInput.value = formatTextInput(pasteData);
        sessionStorage.setItem(STORAGE_KEYS.X_VALUE, xInput.value);
    }
}

function handleXInputBlur(e) {
    const formattedData = formatTextInput(e.target.value);

    if (formattedData === '-') {
        e.target.value = '';
        sessionStorage.setItem(STORAGE_KEYS.X_VALUE, '');
    } else {
        e.target.value = formattedData;
        sessionStorage.setItem(STORAGE_KEYS.X_VALUE, formattedData);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const rSelect = document.getElementById('r-select');
    const settingsToggle = document.getElementById('settings-toggle');
    const settingsPanel = document.getElementById('settings-panel');
    const xInput = document.getElementById('x-input');
    const noRedirectCheckbox = document.getElementById("no-redirect");
    const autoSubmitCheckbox = document.getElementById("auto-submit");
    const yRadioGroup = document.getElementById("y-radio-group");

    window.xInput = xInput;
    window.yRadioGroup = yRadioGroup;
    window.rSelect = rSelect;
    window.autoSubmitCheckbox = autoSubmitCheckbox;

    loadSettings();

    if (typeof drawGraph === 'function') {
        drawGraph(currentR);
    }

    if (rSelect) {
        rSelect.addEventListener('change', function (e) {
            currentR = parseFloat(e.target.value);
            sessionStorage.setItem(STORAGE_KEYS.CURRENT_R, currentR.toString());

            if (typeof offsetX !== 'undefined') offsetX = 0;
            if (typeof offsetY !== 'undefined') offsetY = 0;
            if (typeof scale !== 'undefined') scale = 1.0;

            if (typeof drawGraph === 'function') {
                drawGraph(currentR);
            }
        });
    }

    if (settingsToggle && settingsPanel) {
        settingsToggle.addEventListener('click', function () {
            const isVisible = settingsPanel.style.display !== 'none';
            const newVisibility = !isVisible;

            updateSettingsPanelVisibility(newVisibility);
            sessionStorage.setItem(STORAGE_KEYS.SETTINGS_VISIBLE, newVisibility.toString());
        });
    }

    if (xInput) {
        xInput.addEventListener('input', function () {
            sessionStorage.setItem(STORAGE_KEYS.X_VALUE, xInput.value);
        });

        xInput.addEventListener('change', function () {
            validateXInput(this.value);
        });

        xInput.addEventListener('input', handleXInputChange);
        xInput.addEventListener('paste', handleXInputPaste);
        xInput.addEventListener('blur', handleXInputBlur);
    }

    if (yRadioGroup) {
        yRadioGroup.addEventListener('change', function (e) {
            if (e.target.name === 'y') {
                sessionStorage.setItem(STORAGE_KEYS.Y_VALUE, e.target.value);
            }
        });
    }

    if (noRedirectCheckbox) {
        noRedirectCheckbox.addEventListener('change', function () {
            sessionStorage.setItem(STORAGE_KEYS.NO_REDIRECT, this.checked.toString());
        });
    }

    if (autoSubmitCheckbox) {
        autoSubmitCheckbox.addEventListener('change', function () {
            sessionStorage.setItem(STORAGE_KEYS.AUTO_SUBMIT, this.checked.toString());
        });
    }
});

window.updateXInput = function (value) {
    const xInput = document.querySelector('input[id*="xSpinner_input"]');
    if (xInput) {
        xInput.value = value;
        xInput.dispatchEvent(new Event('change'));
        sessionStorage.setItem('xValue', value);
    }
};

window.updateYInput = function (value) {
    const yInput = document.querySelector('input[id*="yInput"]');
    if (yInput) {
        yInput.value = value;
        yInput.dispatchEvent(new Event('change'));
        sessionStorage.setItem('yValue', value.toString());
    }
};