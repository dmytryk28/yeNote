document.addEventListener('DOMContentLoaded', async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    document.getElementById('role').innerHTML = user.role;

    let myTasks = [];
    try {
        let url = 'api/v1/';
        if (user.role === 'Викладач') url += 'tasks/teacher/';
        else url += 'students_tasks/student/';
        url += user._id;
        const response
            = await fetch(url, {
            method: 'GET',
            headers: {'Content-Type': 'application/json;charset=UTF-8'}
        });

        if (response.ok) {
            myTasks = await response.json();
        } else {
            alert('Сталася помилка');
            return;
        }
    } catch (error) {
        alert('Сталася помилка');
        return;
    }
    showMyTasks(myTasks);

    function formatDateTime(datetime) {
        const [date, time] = datetime.split('T');
        const [year, month, day] = date.split('-');
        const formattedDate = `${day}.${month}.${year}`;
        return `${time} ${formattedDate}`;
    }

    function showMyTasks(myTasks) {
        console.log(myTasks);
        if (myTasks.length === 0) document.getElementById('my-tasks').innerHTML
            += '<p>Тестів не знайдено</p>'
        for (const task of myTasks) {
            const myTask = document.createElement('div');
            myTask.innerHTML = `
            <div class="my-task">
                <div style="width: 70%">
                    <p class="name-1">${task.name}</p>
                    <p class="description">${task.description}</p>
                    <p class="task-code" style="margin-bottom: 0; font-size: 16px">Код: ${task._id}</p>
                    <p class="datetime">Доступно з ${formatDateTime(task.time_start)} до ${formatDateTime(task.time_end)}</p>
                </div>
            </div>
            `;
            if ('sum_score' in task)
                myTask.querySelector('.my-task')
                    .insertAdjacentHTML('beforeend',
                        `<div class="done-mark">${task.sum_score}/${task.questions.reduce((sum, question) => sum + question['max_mark'], 0)}</div>`);
            myTask.querySelectorAll('.name-1, .description').forEach(el => {
                el.onclick = () => {
                    window.location.href = `${(user.role === 'Викладач') ? 'teacher' : 'student'}/${task._id}`;
                };
            })
            document.getElementById('my-tasks').appendChild(myTask);
        }
    }

    let statistics = {};

    try {
        const response = await fetch(`../api/v1/users/${user._id}/statistics/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            }
        });

        if (response.ok) {
            statistics = await response.json();
        } else {
            alert('Сталася помилка');
            return;
        }
    } catch (error) {
        alert('Сталася помилка');
        return;
    }

    if (typeof statistics === 'boolean') {
        document.getElementById('statistics').style.display = 'none';
        return;
    }

    const sums = Object.values(statistics).reduce((acc, cur) => {
        acc[0] += cur[0];
        acc[1] += cur[1];
        return acc;
    }, [0, 0]);

    const text = document.getElementById('statistics-text');

    text.innerHTML += `
<p>Загальна кількість пройдених тестів: <b>${sums[0]}</b></p>
<p>Загальна кількість правильних відповідей: <b>${sums[1]}</b></p>
<p class="name-1">Кількість правильних відповідей за категоріями:</p>
`;

    for (const key in statistics) if (statistics.hasOwnProperty(key))
        text.innerHTML +=
            `<p>${questions[key].name}: <b>${statistics[key][1]}/${statistics[key][0]}</b></p>`;

    const data = [];

    if (sums[0] !== sums[1]) {
        data.push({value: sums[0] - sums[1], color: 'rgba(255,60,96,0.7)'});
    }

    if (sums[1] !== 0) {
        data.push({value: sums[1], color: 'rgba(105,235,54,0.7)'});
    }

    const canvas = document.getElementById('myPieChart');
    const ctx = canvas.getContext('2d');
    const totalValue = data.reduce((acc, item) => acc + item.value, 0);
    let startAngle = 0;

    data.forEach(item => {
        const sliceAngle = 2 * Math.PI * item.value / totalValue;
        const slicePercentage = ((item.value / totalValue) * 100).toFixed(1);

        const distance = Math.min(canvas.width / 2, canvas.height / 2) * 0.8;
        let textX = canvas.width / 2 + (Math.cos(startAngle + sliceAngle / 2) * distance);
        let textY = canvas.height / 2 + (Math.sin(startAngle + sliceAngle / 2) * distance);

        if (item.color === 'rgba(255,60,96,0.7)') {
            textX = 380;
            textY = 500;
        } else if (item.color === 'rgba(105,235,54,0.7)') {
            textX = 0;
            textY = 30;
        }

        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.arc(canvas.width / 2, canvas.height / 2, Math.min(canvas.width / 2, canvas.height / 2), startAngle, startAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = item.color;
        ctx.fill();

        ctx.fillStyle = '#132243';
        ctx.font = '36px Montserrat Alternates';
        ctx.fillText(`${slicePercentage}%`, textX, textY);

        startAngle += sliceAngle;
    });
});
