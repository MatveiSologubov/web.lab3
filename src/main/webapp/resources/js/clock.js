"use strict";

const TIME_UPDATE_INTERVAL_MS = 1000;
const SECONDS_PER_UPDATE = 11;

let countdown = SECONDS_PER_UPDATE;
let currentTimeString = getTimeString();
let intervalId = null;
let initialized = false;

function getTimeString() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

function setClock(timeString) {
    const timeElement = document.getElementById('current-time');

    if (timeElement) {
        timeElement.textContent = timeString;
    }
}

function formatCountdown(number) {
    return String(number).padStart(2, '0');
}

function updateTime() {
    countdown -= 1;

    if (countdown <= 0) {
        currentTimeString = getTimeString();
        countdown = SECONDS_PER_UPDATE;
    }

    const formattedCountdown = formatCountdown(countdown);
    setClock(currentTimeString + " (" + formattedCountdown + ")");
}

function initializeClock() {
    if (initialized) {
        return;
    }

    if (intervalId) {
        clearInterval(intervalId);
    }

    const initialFormattedCountdown = formatCountdown(countdown);
    setClock(currentTimeString + " (" + initialFormattedCountdown + ")");

    intervalId = setInterval(updateTime, TIME_UPDATE_INTERVAL_MS);

    initialized = true;
}

document.addEventListener('DOMContentLoaded', initializeClock, {once: true});