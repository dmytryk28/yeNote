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

    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        Array.from(document.getElementsByClassName('full-name')).forEach(elem => {
            elem.innerHTML = `${user.name} ${user.surname}`;
        });
        Array.from(document.getElementsByClassName('poshta')).forEach(elem => {
            elem.innerHTML = user.email;
        });
    }
    document.getElementById('profile').onclick = () => {
        window.location.href = 'http://127.0.0.1:5000/profile';
    }

    document.getElementById('logout').onclick = () => {
        window.location.href = 'http://127.0.0.1:5000/signin';
    }
});