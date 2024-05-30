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
            if (xhr.status === 201 || xhr.status === 200) window.location.href = '../';
            else alert('Сталася помилка');
        }
    };
    xhr.send(JSON.stringify(formData));
});