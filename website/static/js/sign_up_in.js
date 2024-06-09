// document.getElementsByClassName('container-6')[0].style.display = 'none';
localStorage.clear();

function isPasswordStrong(password) {
    function tst(text) {return text.test(password)}
    return password.length >= 8 && tst(/[A-Z]/) && tst(/[a-z]/)
        && tst(/\d/) && tst(/[!@#$%^&*(),.?":{}|<>]/);
}

document.getElementById('sign-up-in-form').addEventListener('submit', event => {
    event.preventDefault();
    const password = document.getElementById('password');
    if (document.querySelector('.registration-auth').innerText.trim() === 'Реєстрація'
        && !isPasswordStrong(password.value)) {
        alert('Пароль має містити не менше 8 символів, зокрема великі і малі латинські літери, цифри та спеціальні символи.');
        password.focus();
        return;
    }
    let formData = {};
    for (let element of document.getElementById('sign-up-in-form').elements)
        if (element.id) {
            if (element.id === 'password') formData[element.id] = CryptoJS.SHA256(element.value).toString();
            else formData[element.id] = element.value;
        }
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
            } else if (xhr.status === 409) {
                alert('Користувач із такою поштою вже існує');
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