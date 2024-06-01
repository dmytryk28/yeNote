document.addEventListener('DOMContentLoaded', (event) => {
    const container1 = document.querySelector('.container-1');
    const dropdownContent = document.getElementById('dropdownContent');
    const profileSpan = container1.querySelector('.important');

    function toggleDropdown(event) {
        event.preventDefault();
        event.stopPropagation();
        dropdownContent.classList.toggle('show');
    }

    container1.addEventListener('click', toggleDropdown);
    profileSpan.addEventListener('click', toggleDropdown);
    window.addEventListener('click', (event) => {
        if (!container1.contains(event.target)) {
            dropdownContent.classList.remove('show');
        }
    });
});