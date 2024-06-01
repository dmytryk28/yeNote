document.addEventListener('DOMContentLoaded', async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    document.getElementById('role').innerHTML = user.role;

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
        data.push({ value: sums[0] - sums[1], color: 'rgba(255,60,96,0.7)' });
    }

    if (sums[1] !== 0) {
        data.push({ value: sums[1], color: 'rgba(105,235,54,0.7)' });
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
            textX = 380; // Червоний сегмент
            textY = 500; // Зміщуємо текст вниз
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
