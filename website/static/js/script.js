const groupElements = document.querySelectorAll('.group-1');
groupElements.forEach(element => {
    const id = element.getAttribute('id');
    element.addEventListener('click', () => {
        window.location.href = `/task/${id}`;
    });
});

const startBtn = document.querySelector(".start_button button");
const quizBox = document.querySelector(".quiz_box");
const optionList = document.querySelector(".option_list");
const nextBtn = document.querySelector("footer .next_btn");
const exitBtn = document.querySelector("footer .exit_btn");
const repeatSimultaneouslyBtn = document.querySelector(".repeat_simultaneously_btn");
const repeatSequentlyBtn = document.querySelector(".repeat_sequently_btn");
const taskNum = Number(document.querySelector(".container-start-test").getAttribute('data-task-num'));
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

if (taskNum !== 2)
    repeatSimultaneouslyBtn.onclick = () => {
        playNotes(false, currentNotes);
    };
else repeatSimultaneouslyBtn.style.display = 'none';

repeatSequentlyBtn.onclick = () => {
    playNotes(true, currentNotes);
};

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
    document.querySelector(".que_text").innerHTML = `<span>${currentQue.question}</span>`;
    optionList.innerHTML = currentQue.options.map((option, i) =>
        `<div class="option" onclick="optionSelected(this, ${i})"><span>${option}</span></div>`).join('');
    nextBtn.classList.remove("show");
}

function optionSelected(answer, userAns) {
    let correctAns = currentAnswer;
    const allOptions = optionList.children;
    answer.classList.add(userAns == correctAns ? "correct" : "incorrect");
    currentNotes.forEach(num => {
        document.querySelector(`.key:nth-child(${num})`).classList.add(userAns == correctAns ? "correct" : "incorrect")
    })
    if (userAns != correctAns)
        allOptions[correctAns].classList.add("correct");
    Array.from(allOptions).forEach(option => option.classList.add("disabled"));
    nextBtn.classList.add("show");
}
