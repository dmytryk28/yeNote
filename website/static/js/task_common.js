const startBtn = document.querySelector(".start_button button");
const quizBox = document.querySelector(".quiz_box");
const nextBtn = document.querySelector("footer .next_btn");
const repeatSimultaneouslyBtn = document.querySelector(".repeat_simultaneously_btn");
const repeatSequentlyBtn = document.querySelector(".repeat_sequently_btn");
function clearScreen() {
    document.querySelector(".container-start-test").style.display = "none";
    quizBox.style.display = "block";
}