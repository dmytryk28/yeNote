// Select all elements with the class 'group-1'
const groupElements = document.querySelectorAll('.group-1');

// Add a click event listener to each element
groupElements.forEach(element => {
    const id = element.getAttribute('id'); // Get the 'id' attribute of the element
    element.addEventListener('click', () => {
        window.location.href = `/task/${id}`; // Redirect to the task page with the corresponding id
    });
});

// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', function() {
    // Select the button with the class 'show-all-tests'
    const showAllTestsButton = document.querySelector('.show-all-tests');

    // Add a click event listener to the button
    showAllTestsButton.addEventListener('click', function() {
        const buttonPosition = showAllTestsButton.getBoundingClientRect().top; // Get the button's position relative to the viewport
        const scrollAmount = 50; // The amount of pixels to scroll from the button

        // Scroll the window to the calculated position smoothly
        window.scrollTo({
            top: window.scrollY + buttonPosition - scrollAmount,
            behavior: 'smooth'
        });
    });
});