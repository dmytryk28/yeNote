const startBtn = document.querySelector(".start_btn button");
const quizBox = document.querySelector(".quiz_box");
const optionList = document.querySelector(".option_list");
const nextBtn = document.querySelector("footer .next_btn");
let index = 0;

startBtn.onclick = () => {
    quizBox.classList.add("activeQuiz");
    showQuestion();
};

nextBtn.onclick = () => {
    showQuestion();
};

function showQuestion() {
    document.querySelector(".que_text").innerHTML = `<span>${questions[index].question}</span>`;
    optionList.innerHTML = questions[index].options.map((option, i) =>
        `<div class="option" onclick="optionSelected(this, ${i})"><span>${option}</span></div>`).join('');
    nextBtn.classList.remove("show");
}

function optionSelected(answer, userAns) {
    let correctAns = questions[index].answer;
    const allOptions = optionList.children;
    answer.classList.add(userAns == correctAns ? "correct" : "incorrect");
    if (userAns != correctAns)
        allOptions[correctAns].classList.add("correct");
    Array.from(allOptions).forEach(option => option.classList.add("disabled"));
    nextBtn.classList.add("show");
}