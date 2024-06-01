const user = JSON.parse(localStorage.getItem('user'))
document.getElementById('role').innerHTML = user.role;


const data = [
    { value: 100, color: 'rgba(255,60,96,0.7)' },
    { value: 400, color: 'rgba(105,235,54,0.7)' },
];

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
        textX = 400;// Червоний сегмент
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
    ctx.font = '36px Arial';
    ctx.fillText(`${slicePercentage}%`, textX, textY);

    startAngle += sliceAngle;
});








