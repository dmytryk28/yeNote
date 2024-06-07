const taskId = window.location.href.split('/')[4];
let taskIndex = -1;

let task = JSON.parse(localStorage.getItem('task'));

if (!task) {
    try {
        const response = await fetch(`/api/v1/tasks/${taskId}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json;charset=UTF-8'}
        });
        if (response.ok) {
            task = await response.json();
            localStorage.setItem('task', JSON.stringify(task));
        } else {
            alert('Сталася помилка 1');
        }
    } catch (error) {
        alert('Сталася помилка 2');
    }
}

function formatDateTime(datetime) {
    const [date, time] = datetime.split('T');
    const [year, month, day] = date.split('-');
    const formattedDate = `${day}.${month}.${year}`;
    return `${time} ${formattedDate}`;
}


startBtn.onclick = () => {
    taskIndex++;
    repeatSimultaneouslyBtn.style.display = 'none';
    repeatSequentlyBtn.style.display = 'none';
    quizBox.style.display = 'block';
    indexChange();
};

function indexChange() {
    if (taskIndex === -1) {
        document.querySelector(".test-name").textContent = task.name;
        const description = document.querySelector(".description");
        description.textContent = task.description;
        description.insertAdjacentHTML('afterend',
            `<p class="datetime">Доступно з ${formatDateTime(task.time_start)} до ${formatDateTime(task.time_end)}</p>`);
    } else {
        clearScreen();
    }
}

indexChange();