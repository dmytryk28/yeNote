const groupElements = document.querySelectorAll('.group-1');
groupElements.forEach(element => {
    const id = element.getAttribute('id');
    element.addEventListener('click', () => {
        window.location.href = `/task/${id}`;
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const showAllTestsButton = document.querySelector('.show-all-tests');

    showAllTestsButton.addEventListener('click', function() {
        const buttonPosition = showAllTestsButton.getBoundingClientRect().top;
        const scrollAmount = 50; // Кількість пікселів, на яку потрібно прокрутити від кнопки

        window.scrollTo({
            top: window.scrollY + buttonPosition - scrollAmount,
            behavior: 'smooth'
        });
    });
});