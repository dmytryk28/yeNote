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
        const group5Position = document.querySelector('.group-5').getBoundingClientRect().top;
        window.scrollTo({
            top: group5Position,
            behavior: 'smooth'
        });
    });
});