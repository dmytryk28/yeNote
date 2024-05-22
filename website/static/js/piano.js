document.addEventListener("DOMContentLoaded", function() {
    const keys = document.querySelectorAll(".key");
    const sustainCheckbox = document.getElementById("sustain");
    const minPlayTime = 500; // Мінімальна тривалість звучання в мілісекундах

    keys.forEach(key => {
        const note = key.getAttribute("data-note");
        let audio = new Audio(`static/notes/${note}.wav`);
        let playStartTime = 0;

        key.addEventListener("mousedown", () => {
            playStartTime = Date.now();
            playNoteWithSustain(audio);
        });
        key.addEventListener("mouseup", () => {
            const elapsedTime = audio.currentTime - playStartTime;
            if (elapsedTime >= minPlayTime) {
                stopNoteWithoutSustain(audio);
            } else {
                setTimeout(() => stopNoteWithoutSustain(audio), minPlayTime - elapsedTime);
            }
        });
        key.addEventListener("mouseleave", () => {
            const elapsedTime = audio.currentTime - playStartTime;
            if (elapsedTime >= minPlayTime) {
                stopNoteWithoutSustain(audio);
            } else {
                setTimeout(() => stopNoteWithoutSustain(audio), minPlayTime - elapsedTime);
            }
        });
    });

    function playNoteWithSustain(audio) {
        audio.currentTime = 0;
        audio.volume = 1; // Встановити гучність на максимум
        audio.play();
    }

    function stopNoteWithoutSustain(audio) {
        if (!sustainCheckbox.checked) {
            let fadeOutInterval = setInterval(() => {
                if (audio.volume > 0.1) {
                    audio.volume -= 0.1;
                } else {
                    clearInterval(fadeOutInterval);
                    audio.pause();
                    audio.currentTime = 0;
                    audio.volume = 1; // Відновити гучність для наступного відтворення
                }
            }, 50); // Інтервал для поступового зменшення гучності
        }
    }
});
