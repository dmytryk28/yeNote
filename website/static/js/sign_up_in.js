// document.getElementsByClassName('container-6')[0].style.display = 'none';
localStorage.clear();

document.getElementById('sign-up-in-form').addEventListener('submit', event => {
    event.preventDefault();

    let formData = {};
    for (let element of document.getElementById('sign-up-in-form').elements)
        if (element.id) formData[element.id] = element.value;

    const xhr = new XMLHttpRequest();
    const url = '../api/v1/users/'
        + (Object.keys(formData).length === 2 ? 'authenticate/' : '');
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 201 || xhr.status === 200) {
                localStorage.setItem('user', xhr.responseText);
                window.location.href = '../';
            } else alert('Неправильні вхідні дані');
        }
    };
    xhr.send(JSON.stringify(formData));
});

document.querySelector('.btn_signin_signup').addEventListener('click', function () {
    const buttonText = this.textContent.trim();
    if (buttonText === 'Увійти') {
        window.location.href = 'http://127.0.0.1:5000/signin';
    } else if (buttonText === 'Зареєструватися') {
        window.location.href = 'http://127.0.0.1:5000/signup';
    }
});