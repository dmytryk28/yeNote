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
    const studentAnswer = document.getElementById('student-answer');
    const answersDiv = document.querySelector('.answer-stack');
    if (!questionDescription.value.trim()) {
        alert('Будь ласка, введіть питання.');
        questionDescription.focus();
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
        question: questionDescription.value,
        type: selectElement.options[selectElement.selectedIndex].value,
    };
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question';
    questionDiv.textContent = que['question'];

    if (que['type'] === '0') {
        que['answer'] = studentAnswer.value;
        addText(questionDiv, que['answer'], true);
    } else if (que['type'] === '1') {
        que['answers'] = [];
        const inputs = answersDiv.querySelectorAll('.input-answer');
        answersDiv.querySelectorAll('input[type="radio"]').forEach((radio, index) => {
            if (radio.checked) que['index'] = index;
            que['answers'].push(inputs[index].value);
            addText(questionDiv, inputs[index].value, radio.checked);
        });
    }

    task['questions'].push(que);
    document.querySelector('.question_list').appendChild(questionDiv);
    modal.style.display = "none";
    resetQuestionForm();
    console.log(task);
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

document.getElementById("open-question-form").onclick = function () {
    modal.style.display = "block";
}

document.querySelector(".close").onclick = function () {
    modal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
