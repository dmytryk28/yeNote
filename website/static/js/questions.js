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
    }
];