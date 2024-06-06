const modal = document.getElementById("myModal");
const queTypeSelect = document.getElementById("type-ques");
let task = {};

if (!task.length) {
    task['teacher_id'] = JSON.parse(localStorage.getItem('user'))._id;
    const connectInputs = {
        name: "test-name",
        description: "test-description",
        time_start: "time-start",
        time_end: "time-end",
    };
    for (let key in connectInputs)
        document.getElementById(connectInputs[key]).addEventListener("input", () => {
            task[key] = document.getElementById(connectInputs[key]).value;
            console.log(task);
        });
    task['questions'] = [];
}

document.getElementById("save-task").onclick = () => {
    if (!("name" in task) || !("description" in task) || !("time_start" in task) || !("time_end" in task)
        || task["name"] === '' || task["description"] === ''
        || task["time_start"] === '' || task["time_end"] === '') {
        alert('Заповніть усі поля');
        return;
    }
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '../api/v1/tasks/');
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 201) window.location.href = '../profile';
            else alert('Сталася помилка');
        }
    };
    xhr.send(JSON.stringify(task));
}

queTypeSelect.addEventListener("change", () => {
    const selectedOption = queTypeSelect.value;
    const studentAnswer = document.getElementById("student-answer");
    const singleAnswer = document.getElementById("single-answer");
    if (selectedOption === "0") {
        studentAnswer.style.display = "block";
        singleAnswer.style.display = "none";
    } else if (selectedOption === "1") {
        studentAnswer.style.display = "none";
        singleAnswer.style.display = "block";
    }
});

document.getElementById('save-question').onclick = () => {
    const selectElement = document.getElementById("type-ques");
    const questionDescription = document.getElementById('question-description');
    const max_mark = document.getElementById('max-mark');
    const studentAnswer = document.getElementById('student-answer');
    const answersDiv = document.querySelector('.answer-stack');
    if (!questionDescription.value.trim()) {
        alert('Будь ласка, введіть питання.');
        questionDescription.focus();
        return;
    }
    if (!max_mark.value.trim() || isNaN(max_mark.value.trim())) {
        alert('Будь ласка, введіть бал.');
        max_mark.focus();
        return;
    }
    if (selectElement.value === "0" && !studentAnswer.value.trim()) {
        alert('Будь ласка, введіть відповідь студента.');
        studentAnswer.focus();
        return;
    }
    if (selectElement.value === "1") {
        const inputs = answersDiv.querySelectorAll('.input-answer');
        let allFilled = true;
        inputs.forEach(input => {
            if (!input.value.trim()) {
                allFilled = false;
                input.focus();
                alert('Будь ласка, заповніть всі варіанти відповіді.');
            }
        });
        if (!allFilled) return;

        const checkedRadio = answersDiv.querySelector('input[type="radio"]:checked');
        if (!checkedRadio) {
            alert('Будь ласка, оберіть правильну відповідь.');
            return;
        }
    }
    let que = {
        question: questionDescription.value.trim(),
        max_mark: Number(max_mark.value),
        type: Number(selectElement.options[selectElement.selectedIndex].value),
    };
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question';
    questionDiv.textContent = que['question'];

    if (que['type'] === 0) {
        que['answer'] = studentAnswer.value.trim();
        addText(questionDiv, que['answer'], true);
    } else if (que['type'] === 1) {
        que['answers'] = [];
        const answerDiv = document.createElement('div');
        answerDiv.style.display = 'flex';
        answerDiv.style.flexDirection = 'column';
        const inputs = answersDiv.querySelectorAll('.input-answer');
        answersDiv.querySelectorAll('input[type="radio"]').forEach((radio, index) => {
            if (radio.checked) que['index'] = index;
            que['answers'].push(inputs[index].value.trim());
            addText(answerDiv, inputs[index].value.trim(), radio.checked);
        });
        questionDiv.appendChild(answerDiv);
    }
    task['questions'].push(que);
    document.querySelector('.question_list').appendChild(questionDiv);
    modal.style.display = "none";
    resetQuestionForm();
    console.log(task);
    const total = document.getElementById('total-max-mark')
    total.innerText = task['questions'].reduce((sum, question) => sum + question['max_mark'], 0);

    const questionContainerDiv = document.createElement('div');
    questionContainerDiv.className = 'question-container';


    questionDiv.insertAdjacentElement('beforebegin', questionContainerDiv);
    questionContainerDiv.appendChild(questionDiv);

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-answer';
    deleteButton.innerHTML = '<span style="font-size: 24px;">&#128465;</span>';
    deleteButton.onclick = () => {
        questionContainerDiv.remove();
        task['questions'] = task['questions'].filter(q => q !== que);
        console.log(task);
        total.innerText = task['questions'].reduce((sum, question) => sum + question['max_mark'], 0);
        toggleSaveButton();
    };

    questionDiv.insertAdjacentElement('afterend', deleteButton);
    const ratingDiv = document.createElement('div');
    ratingDiv.className = 'question-rating';
    ratingDiv.innerHTML = `Бал: <br> ${que['max_mark']}`;
    deleteButton.insertAdjacentElement('beforebegin', ratingDiv);
    toggleSaveButton();
}

function addText(questionDiv, text, green) {
    const p = document.createElement('p');
    p.innerText = text;
    if (green) {
        p.style.color = '#155724';
        p.style.textDecoration = 'underline';
    }
    questionDiv.appendChild(p);
}

function resetQuestionForm() {
    document.getElementById('question-description').value = '';
    document.getElementById('student-answer').value = '';
    document.getElementById('max-mark').value = '';
    const answersDiv = document.querySelector('.answer-stack');
    const inputs = answersDiv.querySelectorAll('.input-answer');
    inputs.forEach(input => input.value = '');
    answersDiv.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);
    queTypeSelect.value = '0';
    const studentAnswer = document.getElementById("student-answer");
    const singleAnswer = document.getElementById("single-answer");
    studentAnswer.style.display = "block";
    singleAnswer.style.display = "none";
}

document.querySelector('.add-answer').onclick = function (event) {
    const answersDiv = document.querySelector('.answer-stack');
    const newAnswer = document.createElement('div');
    newAnswer.className = 'answer';
    newAnswer.innerHTML = `
        <input class="checkmark" type="radio" name="contact" value="right-answer"/>
        <input style="height: 38px" class="input-answer" type="text" placeholder="Введіть питання..." required/>
        <button class="delete-answer"><span style="font-size: 24px;">&#128465;</span></button>
    `;
    answersDiv.insertBefore(newAnswer, event.target);
    addDeleteFunctionality(newAnswer.querySelector('.delete-answer'));
};

function addDeleteFunctionality(deleteButton) {
    deleteButton.onclick = function () {
        this.parentElement.remove();
    }
}

document.querySelectorAll('.delete-answer').forEach(button => {
    addDeleteFunctionality(button);
});

import {initializeApp} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

document.getElementById("open-question-form").onclick = function () {
    modal.style.display = "block";

    const firebaseConfig = {
        apiKey: "Your-API-Key",
        authDomain: "Your-Auth-Domain",
        projectId: "Your-Project-ID",
        storageBucket: "Your-Storage-Bucket",
        messagingSenderId: "Your-Messaging-Sender-ID",
        appId: "Your-App-ID"
    };
    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app);

    async function uploadFile() {
        const file = document.getElementById('file').files[0];
        if (file) {
            const fileType = file.type.split('/')[0];
            if (fileType !== 'audio' && fileType !== 'image') {
                alert('Дозволено завантажувати лише аудіо або зображення.');
                return;
            }
            const folder = fileType === 'audio' ? 'audio/' : 'images/';
            const storageRef = storage.ref().child(folder + file.name);
            await storageRef.put(file);
            const downloadURL = await storageRef.getDownloadURL();

            if (fileType === 'audio') {
                const audioElement = document.createElement('audio');
                audioElement.controls = true;
                audioElement.src = downloadURL;
                document.body.insertBefore(document.getElementById('answer-format'), audioElement);
            } else if (fileType === 'image') {
                const imgElement = document.createElement('img');
                imgElement.src = downloadURL;
                document.body.insertBefore(document.getElementById('answer-format'), imgElement);
            }

            document.getElementById('add-image-audio').style.display = 'none';
        } else {
            alert('Оберіть файл.');
        }
    }

    document.getElementById('add-image-audio').onclick = () => uploadFile();
}


document.querySelector(".close").onclick = function () {
    modal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function toggleSaveButton() {
    const saveButton = document.getElementById("save-task");
    if (task.questions.length > 0) {
        saveButton.style.display = "block";
    } else {
        saveButton.style.display = "none";
    }
}