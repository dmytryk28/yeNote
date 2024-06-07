const user = JSON.parse(localStorage.getItem('user'));
const showModalButton = document.getElementById("showModalBtn");

if (user.role) {
    if (user.role === "Викладач") {
        showModalButton.style.display = "block";
        showModalButton.textContent = "Новий тест";
    } else {
        showModalButton.style.display = "block";
        showModalButton.textContent = "Тест за кодом";
    }
}

const modalElement = document.getElementById("customModal");
const closeButton = document.querySelector(".close-style");

function hideModal() {
    modalElement.style.display = "none";
    document.getElementById('modalInputField').value = "";
}

showModalButton.onclick = function () {
    if (showModalButton.textContent === "Новий тест") {
        window.location.href = "/create_test";
    } else {
        modalElement.style.display = "block";
    }
}

closeButton.onclick = hideModal;

window.onclick = function (event) {
    if (event.target == modalElement) {
        hideModal();
    }
}

document.getElementById('submitModalBtn').addEventListener('click', async function () {
    const modalInputValue = document.getElementById('modalInputField').value;
    console.log('Modal input value:', modalInputValue);
    try {
        await fetch(`api/v1/students_tasks/${user._id}/${modalInputValue}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json;charset=UTF-8'}
        });
    } catch (error) {
        alert('Завдання не знайдено');
        modalInputValue.value = '';
        return;
    }
    window.location.href = "profile";
});

const container4 = document.querySelector('.container-4');
container4.onclick = function () {
    window.location.href = "/";
}