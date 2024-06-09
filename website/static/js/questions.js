const questions = [
    {
        name: "Інтервали",
        description: "Ви почуєте 2 ноти, що складають собою інтервал. Потрібно визначити, який з 12 інтервалів звучить.",
        question: "Який інтервал звучить?",
        options: [
            "Мала секунда",
            "Велика секунда",
            "Мала терція",
            "Велика терція",
            "Кварта",
            "Тритон",
            "Квінта",
            "Мала секста",
            "Велика секста",
            "Мала септима",
            "Велика септима",
            "Октава"
        ],
        generate: () => {
            const base = Math.floor(Math.random() * 60) + 1;
            let interval = Math.floor(Math.random() * 12) + 1;
            if (base + interval > 61) interval = 61 - base;
            currentNotes = [base, base + interval];
            playNotes(true, currentNotes);
            currentAnswer = interval - 1;
        }
    },
    {
        name: "Мінор чи мажор?",
        description: "Ви почуєте 3 ноти, що складають собою акорд. Потрібно визначити, який він: мінорний чи мажорний.",
        question: "Який акорд звучить?",
        options: ["Мінор", "Мажор"],
        generate: () => {
            const base = Math.floor(Math.random() * 54) + 1;
            const major = Number(Math.random() >= 0.5);
            currentNotes = [base, 3 + base + major, 7 + base];
            playNotes(true, currentNotes);
            currentAnswer = major;
        }
    },
    {
        name: "Діатонічні лади",
        description: "Ви почуєте 8 нот, що складають собою лад. Останній ступінь дублює перший на октаву вище. Потрібно визначити, який із 7 діатонічних ладів звучить.",
        question: "Який діатонічний лад звучить?",
        options: [
            "Йонійський",
            "Дорійський",
            "Фригійський",
            "Лідійський",
            "Міксолідійський",
            "Еолійський",
            "Локрійський"
        ],
        generate: () => {
            currentAnswer = Math.floor(Math.random() * 7);
            const semi1 = 6 - currentAnswer;
            const semi2 = semi1 + (currentAnswer > 2 ? 3 : -4);
            let next = Math.floor(Math.random() * 49) + 1;
            currentNotes = [next];
            for (let i = 0; i < 7; i++) {
                next += i === semi1 || i === semi2 ? 1 : 2;
                currentNotes.push(next);
            }
            playNotes(true, currentNotes);
        }
    },
    {
        name: "Нотний стан",
        description: "Ви побачите нотний стан зі скрипковим або басовим ключем і однією нотою. Потрібно визначити, яку ноту зображено та натиснути відповідну клавішу піаніно.",
        question: "Зіграйте цю ноту на піаніно:",
        options: null,
        generate: () => {
            const notation = document.getElementById('notation');
            notation.innerHTML = ``;
            currentAnswer = Math.floor(Math.random() * 61) + 1;;
            const note = document.querySelector(`.key:nth-child(${currentAnswer})`).getAttribute('data-note')
            let noteChars = note.split('');
            noteChars[0] = noteChars[0].toLowerCase();
            const isBlack = noteChars.length === 3;
            if (isBlack) {
                const change = Math.random() >= 0.5;
                noteChars[1] = change ? 'b' : '#';
                if (change) noteChars[0] = noteChars[0] === 'g' ? 'a'
                    : String.fromCharCode(noteChars[0].charCodeAt(0) + 1);
            }
            noteChars.splice(noteChars.length - 1, 0, '/');
            const {Renderer, Stave, StaveNote, Voice, Formatter, Accidental,Beam} = Vex.Flow;
            const renderer = new Renderer(notation, Renderer.Backends.SVG);
            renderer.resize(450, 160);
            const context = renderer.getContext();
            const stave = new Stave(50, 50, 450);
            const clef = currentAnswer > 24 ? 'treble' : 'bass';
            stave.addClef(clef);
            stave.setContext(context).draw();
            let staveNote = new StaveNote({
                keys: [noteChars.join('')],
                duration: 'q',
                clef: clef
            });
            if (isBlack) staveNote.addModifier(new Accidental(noteChars[1]), 0);
            const beams = Beam.generateBeams([staveNote]);
            Formatter.FormatAndDraw(context, stave, [staveNote]);
            beams.forEach(b => b.setContext(context).draw());
            document.getElementsByTagName('svg').item(0).style.scale = '1.3';
        }
    }
];