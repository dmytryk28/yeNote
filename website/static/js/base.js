// Retrieve the user object from local storage and parse it
const user = JSON.parse(localStorage.getItem('user'));

// Get the modal button, profile container, and text head elements
const showModalButton = document.getElementById("showModalBtn");
const profile = document.querySelector(".container-1");
const texthead = document.querySelector(".text-head");

// Check if the user exists
if (user) {
    // Check if the user has a role
    if (user.role) {
        // If the user is a teacher, set the button text to "New Test"
        if (user.role === "Викладач") {
            showModalButton.style.display = "block";
            showModalButton.textContent = "Новий тест";
        } else {
            // If the user is not a teacher, set the button text to "Test by Code"
            showModalButton.style.display = "block";
            showModalButton.textContent = "Тест за кодом";
        }
        // Show the profile container
        profile.style.display = "flex";
    }
} else {
    // If the user does not exist, create a new button for sign-in
    const newButton = document.createElement("button");
    newButton.className = "container-1";
    const newSpan = document.createElement("span");
    newSpan.className = "important";
    newSpan.textContent = "Увійти";
    newButton.style.width = "400px";

    // Add a click event to redirect to the sign-in page
    newButton.addEventListener("click", () => {
        window.location.href = 'http://127.0.0.1:5000/signin';
    });
    newButton.appendChild(newSpan);
    texthead.appendChild(newButton);
}

// Get the modal and close button elements
const modalElement = document.getElementById("customModal");
const closeButton = document.querySelector(".close-style");

// Function to hide the modal
function hideModal() {
    modalElement.style.display = "none";
    document.getElementById('modalInputField').value = "";
}

// Show the modal or redirect based on button text
showModalButton.onclick = function () {
    if (showModalButton.textContent === "Новий тест") {
        window.location.href = "/create_test";
    } else {
        modalElement.style.display = "block";
    }
}

// Close the modal on close button click
closeButton.onclick = hideModal;

// Hide the modal if clicked outside of it
window.onclick = function (event) {
    if (event.target == modalElement) {
        hideModal();
    }
}

// Handle the submit button click in the modal
document.getElementById('submitModalBtn').addEventListener('click', async function () {
    const modalInputValue = document.getElementById('modalInputField').value;
    console.log('Modal input value:', modalInputValue);
    if (modalInputValue.length === 0) return;
    try {
        const response = await fetch(`api/v1/students_tasks/${user._id}/${modalInputValue}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json;charset=UTF-8'}
        });

        if (response.status === 404) {
            alert('Ви вже доєдналися до цього завдання');
            document.getElementById('modalInputField').value = '';
        } else if (response.ok) {
            window.location.href = "/profile";
        } else {
            alert('Завдання не існує');
            document.getElementById('modalInputField').value = '';
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Сталася помилка під час запиту');
    }
});

// Redirect to the home page on container click
const container4 = document.querySelector('.container-4');
container4.onclick = function () {
    window.location.href = "/";
}

// Redirect to a specific task on button click
document.getElementById('random').onclick = () => {
    window.location.href = '/task/100';
};