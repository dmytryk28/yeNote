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
        generating: () => {
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
        options: [
            "Мінор",
            "Мажор"
        ],
        generating: () => {
            const base = Math.floor(Math.random() * 54) + 1;
            const major = Number(Math.random() >= 0.5);
            currentNotes = [base, 3 + base + major, 7 + base];
            playNotes(true, currentNotes);
            currentAnswer = major;
        }
    }
];