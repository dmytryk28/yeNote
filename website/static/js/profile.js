const user = JSON.parse(localStorage.getItem('user'))
document.getElementById('role').innerHTML = user.role;