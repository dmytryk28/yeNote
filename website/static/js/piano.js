function playSound(note) {
    let audio = new Audio('static/notes/' + note + '.wav');
    audio.volume = 1; // Встановлюємо гучність на максимум
    audio.play();
    setTimeout(function() {
        let fadeOutInterval = setInterval(function() {
            if (audio.volume > 0.1) { // Знижуємо гучність до 0.1
                audio.volume -= 0.05;
            } else {
                clearInterval(fadeOutInterval);
                audio.pause(); // Зупиняємо звук
            }
        }, 100); // Інтервал для плавного згасання
    }, 500); // Час перед згасанням
}

var keys = document.querySelectorAll('.key');
keys.forEach(function (key) {
    key.addEventListener('click', function () {
        let note = this.getAttribute('data-note');
        playSound(note);
    });
});
