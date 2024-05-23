const startBtn = document.querySelector(".start_button button");
const quizBox = document.querySelector(".quiz_box");
const optionList = document.querySelector(".option_list");
const nextBtn = document.querySelector("footer .next_btn");
const exitBtn = document.querySelector("footer .exit_btn");
let index = 0;
let currentQue = null;
let currentNotes = null;

startBtn.onclick = () => {
    clearScreen();
    quizBox.classList.add("activeQuiz");
    showQuestion();
};

nextBtn.onclick = () => {
    showQuestion();
};

document.getElementById('piano-down').addEventListener('click', function() {
    const pianoContainer = document.querySelector('.piano-container');

    // Переключаємо клас 'active' для плавного виїжджання/заїжджання
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
    currentQue = questions[index];
    generateQuestion();
    document.querySelector(".que_text").innerHTML = `<span>${currentQue.question}</span>`;
    optionList.innerHTML = currentQue.options.map((option, i) =>
        `<div class="option" onclick="optionSelected(this, ${i})"><span>${option}</span></div>`).join('');
    nextBtn.classList.remove("show");
}

function generateQuestion() {
    const key = Math.floor(Math.random() * 54) + 1;
    const major = Number(Math.random() >= 0.5);
    currentNotes = [key, key + 3 + major, key + 7];
    playNotes(true, currentNotes);
    currentQue.answer = major;
}

function optionSelected(answer, userAns) {
    let correctAns = currentQue.answer;
    const allOptions = optionList.children;
    answer.classList.add(userAns == correctAns ? "correct" : "incorrect");
    currentNotes.forEach(num => {document.querySelector(`.key:nth-child(${num})`).classList.add(userAns == correctAns ? "correct" : "incorrect")})
    if (userAns != correctAns)
        allOptions[correctAns].classList.add("correct");
    Array.from(allOptions).forEach(option => option.classList.add("disabled"));
    nextBtn.classList.add("show");
}