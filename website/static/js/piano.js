document.getElementById('piano-down').style.display = 'block';
document.getElementById('piano-down').addEventListener('click', function () {
    const pianoContainer = document.querySelector('.piano-container');
    if (pianoContainer.style.maxHeight) {
        pianoContainer.style.maxHeight = null;
    } else {
        pianoContainer.style.maxHeight = pianoContainer.scrollHeight + "px";
    }
});

function playSound(note) {
    let audio = new Audio('/static/notes/' + note + '.wav');
    audio.volume = 1; // Встановлюємо гучність на максимум
    audio.play();
    setTimeout(function () {
        let fadeOutInterval = setInterval(function () {
            if (audio.volume > 0.1) { // Знижуємо гучність до 0.1
                audio.volume -= 0.05;
            } else {
                clearInterval(fadeOutInterval);
                audio.pause(); // Зупиняємо звук
            }
        }, 100); // Інтервал для плавного згасання
    }, 500); // Час перед згасанням
}

const keys = document.querySelectorAll('.key');
keys.forEach(function (key) {
    key.addEventListener('click', function () {
        let note = this.getAttribute('data-note');
        playSound(note);
    });
});

function playNotes(isSequential, keyNumbers) {
    const notes = keyNumbers.map(number => {
        const keyElement = document.querySelector(`.key:nth-child(${number})`);
        return keyElement ? keyElement.getAttribute('data-note') : null;
    }).filter(note => note !== null);

    if (isSequential) {
        let delay = 0;
        notes.forEach(note => {
            setTimeout(() => playSound(note), delay);
            delay += 500;
        });
    } else {
        notes.forEach(note => playSound(note));
    }
}