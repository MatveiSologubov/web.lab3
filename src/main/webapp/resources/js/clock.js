"use strict";

const TIME_UPDATE_INTERVAL_MS = 1000;

function updateTime() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const timeString = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    const timeElement = document.getElementById('current-time');

    if (timeElement) {
        timeElement.textContent = timeString;
    }
}

function initializeClock() {
    updateTime();
    setInterval(updateTime, TIME_UPDATE_INTERVAL_MS);
}

document.addEventListener('DOMContentLoaded', initializeClock);