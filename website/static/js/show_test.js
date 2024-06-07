import {addText} from './create_test.js';

document.querySelectorAll('input, textarea, select').forEach(el => {
    el.disabled = true;
});
document.querySelectorAll('button').forEach(el => {
    el.style.display = 'none';
});

const taskId = window.location.href.split('/')[4];
let task = {};
try {
    const response = await fetch(`/api/v1/tasks/${taskId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    });

    if (response.ok) {
        task = await response.json();
        console.log(task);
    } else {
        alert('Сталася помилка 1');
    }
} catch (error) {
    alert('Сталася помилка 2');
}

document.getElementById('test-name').value = task.name;
document.getElementById('test-description').value = task.description;
document.getElementById('time-start').value = task.time_start;
document.getElementById('time-end').value = task.time_end;
document.getElementById('total-max-mark').innerText
    = task.questions.reduce((sum, question) => sum + question['max_mark'], 0);

for (const que of task.questions) {
    const questionContainerDiv = document.createElement('div');
    questionContainerDiv.className = 'question-container';
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question';
    questionDiv.textContent = que['question'];
    if (que['type'] === 0) addText(questionDiv, que.answer, true, que);
    else if (que['type'] === 1) {
        const answerDiv = document.createElement('div');
        answerDiv.style.display = 'flex';
        answerDiv.style.flexDirection = 'column';
        for (let i = 0; i < que.answers.length; i++)
            addText(questionDiv, que.answers[i], i === que.index, que);
        questionDiv.appendChild(answerDiv);
    }
    document.querySelector('.question_list').appendChild(questionDiv);
    questionDiv.insertAdjacentElement('beforebegin', questionContainerDiv);
    questionContainerDiv.appendChild(questionDiv);
    const ratingDiv = document.createElement('div');
    ratingDiv.className = 'question-rating';
    ratingDiv.innerHTML = `Бал: <br> ${que['max_mark']}`;
    questionContainerDiv.appendChild(ratingDiv);
}