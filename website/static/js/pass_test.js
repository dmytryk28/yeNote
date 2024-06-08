const taskId = window.location.href.split('/')[4];
let taskIndex = -1;
const user = JSON.parse(localStorage.getItem('user'));

let task = await getData(`tasks/${taskId}`);
let results = [];
results = await getData(`students_tasks/${user._id}/${taskId}`);
const viewResults = 'result' in results;

async function getData(url) {
    try {
        const response = await fetch(`/api/v1/${url}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json;charset=UTF-8'}
        });
        if (response.ok) return await response.json();
        else alert('Сталася помилка 1');
    } catch (error) {
        alert('Сталася помилка 2');
    }
}

if (viewResults) {
    results = results.result;
    startBtn.innerText = 'Переглянути';
}

const prevBtn = document.querySelector('.prev_btn');
const optionList = document.querySelector('.option_list');
const queText = document.querySelector('.que_text');
const numberOfQuestions = task.questions.length;
const mediaDiv = document.getElementById('media');
mediaDiv.style.marginTop = '12px';
mediaDiv.style.marginBottom = '12px';
const quizHeader = document.getElementById('quiz-header');
let answers = [];
for (let i = 0; i < numberOfQuestions; i++)
    answers.push({answer: undefined});

function formatDateTime(datetime) {
    const [date, time] = datetime.split('T');
    const [year, month, day] = date.split('-');
    const formattedDate = `${day}.${month}.${year}`;
    return `${time} ${formattedDate}`;
}

document.querySelector(".test-name").textContent = task.name;
const description = document.querySelector(".description");
description.textContent = task.description;
if (viewResults) {
    const [f, s] = score();
    description.insertAdjacentHTML('afterend',
        `<p id="total-max-mark" style="font-size: 24px; font-weight: 500">Оцінка: <b>${f}/${s}</b></p>`);
} else {
    description.insertAdjacentHTML('afterend',
        `<p class="datetime">Доступно з ${formatDateTime(task.time_start)} до ${formatDateTime(task.time_end)}</p>`);
}

function score() {
    let myScore = 0;
    let max = 0;
    results.forEach((que, index) => {
        myScore += que.score;
        max += task.questions[index].max_mark;
    });
    return [myScore, max];
}

startBtn.onclick = () => {
    quizHeader.insertAdjacentHTML('beforebegin', `<p id="score"></p>`);
    taskIndex = 0;
    clearScreen();
    repeatSimultaneouslyBtn.style.display = 'none';
    repeatSequentlyBtn.style.display = 'none';
    quizBox.style.display = 'block';
    indexChange();
    prevBtn.style.display = 'block';
};

nextBtn.onclick = () => {
    taskIndex++;
    indexChange();
};

prevBtn.onclick = () => {
    if (taskIndex === numberOfQuestions - 1)
        endButton.replaceWith(nextBtn);
    taskIndex--;
    indexChange();
};

const endButton = document.createElement('button');
endButton.innerText = 'Завершити';
endButton.classList.add('next_btn', 'show');

function computeResult() {
    task.questions.forEach((question, index) => {
        const userAnswer = answers[index].answer;
        let score = 0;
        if (userAnswer !== undefined) {
            if ((question.type === 0 && userAnswer.trim().toLowerCase() === question.answer.toLowerCase())
                || (question.type === 1 && userAnswer === question.index))
                score = question.max_mark;
        }
        answers[index].score = score;
    });
}

function sendResult() {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', `/api/v1/students_tasks/${user._id}/${taskId}`);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 201) location.reload();
            else alert('Помилка');
        }
    };
    xhr.send(JSON.stringify(answers));
}

endButton.onclick = () => {
    if (results) {
        location.reload();
        return;
    }
    computeResult();
    sendResult();
}

function indexChange() {
    mediaDiv.innerHTML = '';
    if (taskIndex === 0) {
        prevBtn.classList.remove("show");
        nextBtn.classList.add("show");
    } else if (taskIndex === numberOfQuestions - 1) {
        nextBtn.replaceWith(endButton);
        prevBtn.classList.add("show");
    } else {
        prevBtn.classList.add("show");
        nextBtn.classList.add("show");
    }
    const question = task.questions[taskIndex];
    document.getElementById('score').innerText = viewResults ? `Бали: ${results[taskIndex].score}/${question.max_mark}`
        : `Бали: ${question.max_mark}`
    queText.innerText = question.question;
    optionList.innerHTML = '';
    addMedia(question);
    if (question.type === 0) {
        optionList.innerHTML = `
            <textarea style="margin-bottom: 10px; resize: vertical;"
            placeholder="Ваша відповідь" id="my-answer" rows="3"></textarea>
            `;
        const myAns = document.getElementById('my-answer');
        if (viewResults) {
            myAns.disabled = true;
            myAns.value = results[taskIndex].answer;
            if (results[taskIndex].score < question.max_mark)
                myAns.style.backgroundColor = '#ffcdac'
            else myAns.style.backgroundColor = '#d4edda'
            return;
        }
        if (answers[taskIndex].answer !== undefined)
            myAns.value = answers[taskIndex].answer;
        myAns.addEventListener('input', event => {
            answers[taskIndex].answer = event.target.value;
        });
    } else if (question.type === 1) {
        question.answers.forEach((answer, index) => {
            const option = document.createElement('div');
            option.classList.add("disabled");
            option.classList.add('option');
            optionList.appendChild(option);
            option.innerText = answer;
            if (viewResults) {
                if (index === question.index) option.classList.add('correct');
                else if (index === results[taskIndex].answer) option.classList.add('incorrect');
            } else {
                option.onclick = () => clickOption(option, index);
                if (index === answers[taskIndex].answer) option.classList.add('selected');
            }

        });
    }
}

function clickOption(option, index) {
    if (answers[taskIndex].answer !== undefined)
        nthOption(answers[taskIndex].answer).classList.remove('selected');
    answers[taskIndex].answer = index;
    option.classList.add('selected');
}

function nthOption(n) {
    return optionList.querySelector(`:nth-child(${n + 1})`);
}

function addMedia(question) {
    if (question.youtube) {
        mediaDiv.innerHTML = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${question.youtube}" allowfullscreen></iframe>`;
    } else if (question.file) {
        const fileUrl = 'https://firebasestorage.googleapis.com/v0/b/yenote-71e1f.appspot.com/o/' + question.file;
        const fileType = question.file.substring(0, 5);
        if (fileType === 'audio') {
            const audio = document.createElement('audio');
            audio.controls = true;
            audio.src = fileUrl;
            audio.style.marginTop = '12px';
            mediaDiv.appendChild(audio)
        } else {
            const img = document.createElement('img');
            img.src = fileUrl;
            mediaDiv.appendChild(img)
        }
    }
}