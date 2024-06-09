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
    // перевірка полів
    if (!("name" in task) || !("description" in task) || !("time_start" in task) || !("time_end" in task)
        || task["name"] === '' || task["description"] === ''
        || task["time_start"] === '' || task["time_end"] === '') {
        alert('Заповніть усі поля');
        return;
    }

    const storage = getStorage(app);

    const uploadTasks = task.questions.map(async (que) => {
        if ('tempFileURL' in que) {
            const file = que.tempFileURL;
            const fileType = file.type.split('/')[0];
            const folder = fileType + '/';
            const storageRef = ref(storage, folder + new Date().toISOString());
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            que.file = url.substring(71);
            delete que.tempFileURL;
        }
    });

    Promise.all(uploadTasks).then(() => {
        // надсилання запиту на сервер після завантаження файлів
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
    });
};

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

function getYoutubeId(youtubeLink) {
    return youtubeLink.match(/(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)[1];
}

function mediaListeners() {

    document.getElementById('file-upload').addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            const fileType = file.type.split('/')[0];
            if (fileType !== 'audio' && fileType !== 'image') {
                alert('Дозволено завантажувати лише аудіо або зображення.');
                return;
            }

            const reader = new FileReader();
            reader.onload = function (e) {
                const result = e.target.result;
                drawMedia(fileType, result);
            };
            reader.readAsDataURL(file);
            tempFile = file; // зберігання вибраного файлу в тимчасову змінну
        } else {
            alert('Оберіть файл.');
        }
    });

    document.getElementById("add-youtube").addEventListener("click", function () {
        document.getElementById("youtube-link").style.display = "block";
        document.getElementById("youtube-confirm").style.display = "block";
    });

    document.getElementById("youtube-confirm").addEventListener("click", function () {
        const youtubeLinkInput = document.getElementById("youtube-link");
        const youtubeLink = youtubeLinkInput.value.trim();
        const youtubeId = getYoutubeId(youtubeLink);
        console.log(youtubeId);
        const additionalFilesDiv = document.getElementById("additional-files");

        if (youtubeId) {
            const iframe = document.createElement("iframe");
            iframe.width = "560";
            iframe.height = "315";
            iframe.src = `https://www.youtube.com/embed/${youtubeId}`;
            iframe.frameBorder = "0";
            iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
            iframe.allowFullscreen = true;
            additionalFilesDiv.innerHTML = '';
            additionalFilesDiv.appendChild(iframe);
            youtubeLinkInput.style.display = "none";
            document.getElementById("youtube-confirm").style.display = "none";
            tempYoutube = youtubeId;
        } else {
            alert("Невірне посилання на YouTube");
        }
    });
}

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

    if (tempFile) {
        que.tempFileURL = tempFile;
        tempFile = null;
    }

    if (tempYoutube) {
        que.youtube = tempYoutube;
        tempYoutube = null;
    }

    const questionDiv = document.createElement('div');
    questionDiv.className = 'question';
    questionDiv.textContent = que['question'];

    if (que['type'] === 0) {
        que['answer'] = studentAnswer.value.trim();
        addText(questionDiv, que['answer'], true, que);
    } else if (que['type'] === 1) {
        que['answers'] = [];
        const answerDiv = document.createElement('div');
        answerDiv.style.display = 'flex';
        answerDiv.style.flexDirection = 'column';
        const inputs = answersDiv.querySelectorAll('.input-answer');
        answersDiv.querySelectorAll('input[type="radio"]').forEach((radio, index) => {
            if (radio.checked) que['index'] = index;
            que['answers'].push(inputs[index].value.trim());
            addText(answerDiv, inputs[index].value.trim(), radio.checked, que);
        });
        questionDiv.appendChild(answerDiv);
    }
    questionDiv.addEventListener('click', () => openQuestionInForm(que));
    task['questions'].push(que);
    document.querySelector('.question_list').appendChild(questionDiv);
    modal.style.display = "none";
    resetQuestionForm();
    console.log(task);
    const total = document.getElementById('total-max-mark');
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

export function addText(questionDiv, text, green, question) {
    const p = document.createElement('p');
    p.innerText = text;
    if (green) {
        p.style.color = '#155724';
        p.style.textDecoration = 'underline';
    }
    questionDiv.appendChild(p);
    // questionDiv.addEventListener('click', () => openQuestionInForm(question));
    console.log(question);
}

export function openQuestionInForm(question) {
    document.getElementById('question-description').value = question.question;
    document.getElementById('max-mark').value = question.max_mark;
    document.getElementById('type-ques').value = question.type;

    const studentAnswer = document.getElementById("student-answer");
    const singleAnswer = document.getElementById("single-answer");
    const additionalFilesDiv = document.getElementById("additional-files");

    if (question.type === 0) {
        studentAnswer.value = question.answer || '';
        studentAnswer.style.display = "block";
        singleAnswer.style.display = "none";
    } else if (question.type === 1) {
        studentAnswer.style.display = "none";
        singleAnswer.style.display = "block";

        // Clear previous answers
        singleAnswer.innerHTML = '';
        question.answers.forEach((ans, idx) => {
            const answerDiv = document.createElement('div');
            answerDiv.className = 'answer';
            answerDiv.innerHTML = `
                <input class="checkmark" type="radio" name="contact" value="right-answer" ${idx === question.index ? 'checked' : ''}/>
                <input style="height: 38px" class="input-answer" type="text" placeholder="Введіть питання..." value="${ans}" required/>
            `;
            singleAnswer.appendChild(answerDiv);
        });
    }

    // Display YouTube video if present
    if (question.youtube) {
        const iframe = document.createElement("iframe");
        iframe.width = "560";
        iframe.height = "315";
        iframe.src = `https://www.youtube.com/embed/${question.youtube}`;
        iframe.frameBorder = "0";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        additionalFilesDiv.innerHTML = '';
        additionalFilesDiv.appendChild(iframe);
    } else if ('file' in question) {
        const file = question.file;
        drawMedia(file.substring(0, 5), 'https://firebasestorage.googleapis.com/v0/b/yenote-71e1f.appspot.com/o/' + file);
    } else if (question.tempFileURL) {
        const file = question.tempFileURL;
        const reader = new FileReader();
        reader.onload = function (e) {
            const result = e.target.result;
            drawMedia(file.type.split('/')[0], result);
        };
        reader.readAsDataURL(file); // Assuming tempFileURL contains a 'url' property for displaying

    } else {
        additionalFilesDiv.innerHTML = '';
    }
    formFields(true);
    modal.style.display = "block";
}


function drawMedia(fileType, file) {
    if (fileType === 'audio') {
        const audioElement = document.createElement('audio');
        audioElement.controls = true;
        audioElement.src = file;
        document.getElementById('additional-files').innerHTML = audioElement.outerHTML;
    } else if (fileType === 'image') {
        const imgElement = document.createElement('img');
        imgElement.src = file;
        document.getElementById('additional-files').innerHTML = imgElement.outerHTML;
    }
}

function formFields(disabled) {
    const inputs = modal.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.disabled = disabled;
    });
    document.getElementById('save-question').style.display = disabled ? 'none' : 'block';
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
    document.getElementById('additional-files').innerHTML = `
    <label for="file-upload" class="question-media">
        Додати зображення/аудіо
    </label>
    <input id="file-upload" type="file" style="display: none;">
    <button id="add-youtube" class="question-media">Додати Youtube відео</button>
    `;
    studentAnswer.style.display = "block";
    singleAnswer.style.display = "none";
    const youtubeLink = document.getElementById("youtube-link");
    youtubeLink.value = '';
    youtubeLink.style.display = "none";
    document.getElementById("youtube-confirm").style.display = "none";
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
    getDownloadURL,
    getStorage,
    ref,
    uploadBytes
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyDJfOnEWnPbAAzNY324wf0SHmpTb987FNo",
    authDomain: "yenote-71e1f.firebaseapp.com",
    projectId: "yenote-71e1f",
    storageBucket: "yenote-71e1f.appspot.com",
    messagingSenderId: "411199629610",
    appId: "1:411199629610:web:884078f58373d78c58d653"
};

const app = initializeApp(firebaseConfig);

document.getElementById("open-question-form").onclick = function () {
    modal.style.display = "block";
    mediaListeners();
    formFields(false);
}

document.querySelector(".close").onclick = function () {
    modal.style.display = "none";
    resetQuestionForm();
}

window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
        resetQuestionForm();
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

let tempFile = null;
let tempYoutube = null;