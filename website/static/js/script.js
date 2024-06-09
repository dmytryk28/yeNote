// Get the task number from the URL
let taskNum = Number(window.location.href.split('/')[4]);
const random = taskNum === 100; // Check if the task number is 100 (random task)
let withOptions, optionList;
const numOfTypes = 4; // Number of task types
const exitBtn = document.querySelector("footer .exit_btn");

// If the task is random, update the test name and description
if (random) {
    document.querySelector(".test-name").textContent = 'Випадкові тести';
    document.querySelector(".description").textContent = 'Ви побачите випадкові тести з 4 категорій.';
} else {
    // Otherwise, set the name and description based on the task number
    document.querySelector(".test-name").textContent = questions[taskNum].name;
    document.querySelector(".description").textContent = questions[taskNum].description;
}

let currentAnswer = null;
let currentNotes = null;

// Start button click event
startBtn.onclick = () => {
    document.getElementById('piano-down').click(); // Simulate a click on the piano down button
    clearScreen(); // Clear the screen
    if (random) update(); // Update if the task is random
    quizBox.classList.add("activeQuiz"); // Activate the quiz box
    showQuestion(); // Show the question
};

// Next button click event
nextBtn.onclick = () => {
    // Remove 'correct' and 'incorrect' classes from all keys
    keys.forEach(key => {
        key.classList.remove('correct', 'incorrect');
    });
    if (random) update(); // Update if the task is random
    showQuestion(); // Show the next question
};

// Update the task if random
function update() {
    if (random) {
        taskNum = Math.floor(Math.random() * numOfTypes); // Generate a random task number
        document.querySelector(".option_list").innerHTML = ''; // Clear the options list
        document.getElementById('notation').innerHTML = ''; // Clear the notation
    }
    if (taskNum < 2) {
        // Show the simultaneous repeat button for specific task numbers
        repeatSimultaneouslyBtn.style.display = 'block';
        repeatSimultaneouslyBtn.onclick = () => {
            playNotes(false, currentNotes); // Play notes simultaneously
        };
    } else repeatSimultaneouslyBtn.style.display = 'none';

    if (taskNum < 3) {
        // Show the sequential repeat button for specific task numbers
        repeatSequentlyBtn.style.display = 'block';
        repeatSequentlyBtn.onclick = () => {
            playNotes(true, currentNotes); // Play notes sequentially
        };
    } else repeatSequentlyBtn.style.display = 'none';
    withOptions = taskNum < 3; // Determine if options are used based on the task number
    optionList = document.querySelector(withOptions ? ".option_list" : ".piano"); // Select the appropriate option list
}

// Initial update call
update();

// Function to show the question
function showQuestion() {
    questions[taskNum].generate(); // Generate the question
    nextBtn.classList.remove("show"); // Hide the next button
    document.querySelector(".que_text").innerHTML = `<span>${questions[taskNum].question}</span>`; // Display the question text
    if (withOptions) {
        // Display options if applicable
        optionList.innerHTML = questions[taskNum].options.map((option, i) =>
            `<div class="option" onclick="optionSelected(this, ${i})"><span>${option}</span></div>`).join('');
    } else {
        // Set up click events for piano keys
        for (let i = 1; i <= 61; i++) {
            let child = document.querySelector(`.key:nth-child(${i})`);
            child.onclick = () => optionSelected(child, i);
        }
    }
}

// Function to handle option selection
function optionSelected(answer, userAns) {
    const correctAns = currentAnswer; // Get the correct answer
    const ansIsCorrect = userAns === correctAns; // Check if the user's answer is correct
    const allOptions = optionList.children; // Get all options
    updateStatistics(ansIsCorrect); // Update statistics
    answer.classList.add(ansIsCorrect ? "correct" : "incorrect"); // Highlight the selected option
    if (withOptions) currentNotes.forEach(num => {
        document.querySelector(`.key:nth-child(${num})`).classList.add(ansIsCorrect ? "correct" : "incorrect");
    });
    if (!ansIsCorrect)
        allOptions[correctAns - !withOptions].classList.add("correct"); // Highlight the correct answer if the user's answer is incorrect
    Array.from(allOptions).forEach(option => option.classList.add("disabled")); // Disable all options
    nextBtn.classList.add("show"); // Show the next button
    if (taskNum === 3) {
        document.querySelectorAll('.key').forEach(key => {
            key.onclick = () => {}; // Disable all key clicks for task number 3
        });
    }
}

// Function to update statistics
function updateStatistics(ansIsCorrect) {
    const user = localStorage.getItem('user'); // Get the user from local storage
    if (!user) return;
    const xhr = new XMLHttpRequest(); // Create a new XMLHttpRequest
    xhr.open('PUT', `/api/v1/users/${JSON.parse(user)._id}/${taskNum}/${Number(ansIsCorrect)}`); // Set up the request
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8'); // Set the request header
    xhr.send(); // Send the request
}