function playSound(note) {
    let audio = new Audio('static/notes/' + note + '.wav');
    audio.play();
}

// Додавання обробника подій до клавіш
var keys = document.querySelectorAll('.key');
keys.forEach(function (key) {
    key.addEventListener('click', function () {
        let note = this.getAttribute('data-note');
        playSound(note);
    });
});