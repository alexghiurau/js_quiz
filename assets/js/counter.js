// from https://github.com/JamieMcGibbon/TechnicalCafe/blob/master/Misc%20Tutorials/Stopwatch%20Tutorial/script.js

// hold time values
let seconds = 0;
let minutes = 0;

// on-screen values
let displaySeconds = 0;
let displayMinutes = 0;

let interval = null;

// hold status of counter
let status = 'stopped';

function counter() {
    seconds++;

    // when to increment next value
    if (seconds / 60 === 1) {
        seconds = 0;
        minutes++;

        if (minutes / 60 === 1) {
            minutes = 0;
            minutes++;
        }
    }

    // handle single digit numbers
    if (seconds < 10) {
        displaySeconds = '0' + seconds.toString();
    } else {
        displaySeconds = seconds;
    }

    if (minutes < 10) {
        displayMinutes = '0' + minutes.toString();
    } else {
        displayMinutes = minutes;
    }

    // display updated time on page
    document.getElementById('counter').innerHTML = displayMinutes + ':' + displaySeconds;
}

function startStopCounter() {
    if (status === 'stopped') {
        // start counter
        interval = window.setInterval(counter, 1000);
        status = 'counting';
    } else {
        window.clearInterval(interval);
        status = 'stopped';
    }
}
