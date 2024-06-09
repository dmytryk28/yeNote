let taskNum = Number(window.location.href.split('/')[4]);
const random = taskNum === 100;
let withOptions, optionList;
const numOfTypes = 4;
const exitBtn = document.querySelector("footer .exit_btn");
if (random) {
    document.querySelector(".test-name").textContent = 'Випадкове завдання';
    document.querySelector(".description").textContent = 'Ви побачите випадкове завдання, що належить до однієї з 4 категорій.';
} else {
    document.querySelector(".test-name").textContent = questions[taskNum].name;
    document.querySelector(".description").textContent = questions[taskNum].description;
}
let currentAnswer = null;
let currentNotes = null;

startBtn.onclick = () => {
    document.getElementById('piano-down').click();
    clearScreen();
    if (random) update();
    quizBox.classList.add("activeQuiz");
    showQuestion();
};

nextBtn.onclick = () => {
    keys.forEach(key => {
        key.classList.remove('correct', 'incorrect');
    });
    if (random) update();
    showQuestion();
};

function update() {
    if (random) {
        taskNum = Math.floor(Math.random() * numOfTypes);
        document.querySelector(".option_list").innerHTML = '';
        document.getElementById('notation').innerHTML = '';
    }
    if (taskNum < 2) {
        repeatSimultaneouslyBtn.style.display = 'block';
        repeatSimultaneouslyBtn.onclick = () => {
            playNotes(false, currentNotes);
        };
    } else repeatSimultaneouslyBtn.style.display = 'none';

    if (taskNum < 3) {
        repeatSequentlyBtn.style.display = 'block';
        repeatSequentlyBtn.onclick = () => {
            playNotes(true, currentNotes);
        };
    } else repeatSequentlyBtn.style.display = 'none';
    withOptions = taskNum < 3;
    optionList = document.querySelector(withOptions ? ".option_list" : ".piano");
}

update();

function showQuestion() {
    questions[taskNum].generate();
    nextBtn.classList.remove("show");
    document.querySelector(".que_text").innerHTML = `<span>${questions[taskNum].question}</span>`;
    if (withOptions) {
        optionList.innerHTML = questions[taskNum].options.map((option, i) =>
            `<div class="option" onclick="optionSelected(this, ${i})"><span>${option}</span></div>`).join('');
    } else for (let i = 1; i <= 61; i++) {
        let child = document.querySelector(`.key:nth-child(${i})`);
        child.onclick = () => optionSelected(child, i);
    }
}

function optionSelected(answer, userAns) {
    const correctAns = currentAnswer;
    const ansIsCorrect = userAns === correctAns
    const allOptions = optionList.children;
    updateStatistics(ansIsCorrect);
    answer.classList.add(ansIsCorrect ? "correct" : "incorrect");
    if (withOptions) currentNotes.forEach(num => {
        document.querySelector(`.key:nth-child(${num})`).classList.add(ansIsCorrect ? "correct" : "incorrect")
    });
    if (!ansIsCorrect)
        allOptions[correctAns - !withOptions].classList.add("correct");
    Array.from(allOptions).forEach(option => option.classList.add("disabled"));
    nextBtn.classList.add("show");
    if (taskNum === 3) {
        document.querySelectorAll('.key').forEach(key => {
            key.onclick = () => {};
        })
    }
}

function updateStatistics(ansIsCorrect) {
    const user = localStorage.getItem('user');
    if (!user) return;
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', `/api/v1/users/${JSON.parse(user)._id}/${taskNum}/${Number(ansIsCorrect)}`);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send();
}