const groupElements = document.querySelectorAll('.group-1');
groupElements.forEach(element => {
    const id = element.getAttribute('id');
    element.addEventListener('click', () => {
        window.location.href = `/task/${id}`;
    });
});

const taskNum = Number(document.querySelector(".container-start-test").getAttribute('data-task-num'));
const withOptions = taskNum < 3;
const startBtn = document.querySelector(".start_button button");
const quizBox = document.querySelector(".quiz_box");
const optionList = document.querySelector(withOptions ? ".option_list" : ".piano");
const nextBtn = document.querySelector("footer .next_btn");
const exitBtn = document.querySelector("footer .exit_btn");
const repeatSimultaneouslyBtn = document.querySelector(".repeat_simultaneously_btn");
const repeatSequentlyBtn = document.querySelector(".repeat_sequently_btn");
const currentQue = questions[taskNum];
document.querySelector(".test-name").textContent = currentQue.name;
document.querySelector(".description").textContent = currentQue.description;
let currentAnswer = null;
let currentNotes = null;


startBtn.onclick = () => {
    clearScreen();
    quizBox.classList.add("activeQuiz");
    showQuestion();
};

nextBtn.onclick = () => {
    keys.forEach(key => {
        key.classList.remove('correct', 'incorrect');
    });
    showQuestion();
};

if (taskNum < 2)
    repeatSimultaneouslyBtn.onclick = () => {
        playNotes(false, currentNotes);
    };
else repeatSimultaneouslyBtn.style.display = 'none';

if (taskNum < 3)
    repeatSequentlyBtn.onclick = () => {
        playNotes(true, currentNotes);
    };
else repeatSequentlyBtn.style.display = 'none';

document.getElementById('piano-down').addEventListener('click', function () {
    const pianoContainer = document.querySelector('.piano-container');
    if (pianoContainer.style.maxHeight) {
        pianoContainer.style.maxHeight = null;
    } else {
        pianoContainer.style.maxHeight = pianoContainer.scrollHeight + "px";
    }
});

function clearScreen() {
    const startButtonContainer = document.querySelector(".container-start-test");
    const quizBox = document.querySelector(".quiz_box");
    startButtonContainer.style.display = "none";
    quizBox.style.display = "block";
}

function showQuestion() {
    currentQue.generate();
    nextBtn.classList.remove("show");
    document.querySelector(".que_text").innerHTML = `<span>${currentQue.question}</span>`;
    if (withOptions) {
        optionList.innerHTML = currentQue.options.map((option, i) =>
        `<div class="option" onclick="optionSelected(this, ${i})"><span>${option}</span></div>`).join('');
    }
    else for (let i = 1; i <= 61; i++) {
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
}

function updateStatistics(ansIsCorrect) {
    const user = localStorage.getItem('user');
    if (!user) return;
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', `../../api/v1/users/${JSON.parse(user)._id}/${taskNum}/${Number(ansIsCorrect)}`);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send();
}