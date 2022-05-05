const form = document.querySelector('.authentication');
const menu = document.querySelector('.menu');
let paletteObj;

document.querySelector('.close-form').onclick = () => close(form);
document.querySelector('.request-signup').onclick = requestSignUp;
document.querySelector('.request-login').onclick = requestLogIn;
document.querySelectorAll('input').forEach((element) => {
    element.onchange = setInputDefault;
});

document.querySelector('.dark-background').onclick = closeAll;
document.querySelector('.hamburger').onclick = () => open(menu);
document.querySelector('.close-menu').onclick = () => close(menu);
document.querySelectorAll('.login-open').forEach(element => {
    element.onclick = login;
});
document.querySelectorAll('.signup-open').forEach(element => {
    element.onclick = signup;
});
let user = window.localStorage.getItem('user');

function close(element) {
    document.querySelector('.dark-background').removeAttribute('style');
    element.remove();
    enableScroll();
}

function closeAll() {
    document.querySelector('.dark-background').removeAttribute('style');
    document.querySelector('form')?.remove();
    document.querySelector('.main-functions-nav').removeAttribute('style');
    enableScroll();
    menu.remove();
}

function open(form) {
    cleanForm();
    document.querySelector('.dark-background').style.display = 'block';
    document.body.append(form);
    document.querySelector('.form-nav-active')?.classList.remove('form-nav-active');
    disableScroll();
}

function openCloseNav() {
    let nav = document.querySelector('.main-functions-nav');
    if (nav.style.display == 'flex')
        nav.removeAttribute('style');
    else
        nav.style.display = 'flex';
}

function login() {
    open(form);
    document.querySelectorAll('.login').forEach(element => {
        element.removeAttribute('style');
    });
    document.querySelectorAll('.signup').forEach(element => {
        element.style.display = 'none';
    });
    document.querySelector('.form-login').classList.add('form-nav-active');
}

function signup() {
    open(form);
    document.querySelectorAll('.login').forEach(element => {
        element.style.display = 'none';
    });
    document.querySelectorAll('.signup').forEach(element => {
        element.removeAttribute('style');
    });
    document.querySelector('.form-signup').classList.add('form-nav-active');
}

function requestSignUp() { 
    emailRegEx = /^(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
    form.querySelector('.form-message')?.remove();
    const passwords = form.querySelectorAll('[type="password"]');
    const email = form.querySelector('[type="email"]');
    const username =  form.querySelector('[type="text"]');

    if (username.value == '') {
        displayMessage('Input username'); 
        return;
    }
    if (passwords[0].value != passwords[1].value) {
        displayMessage('Passwords don\'t match');
        return;
    }
    if (passwords[0].value.search(/[^\d\w]/) != -1 || passwords[0].value.length < 6) {
        displayMessage('Password should be at least 6 letters or digits'); 
        return;
    }
    if (email.value.search(emailRegEx) == -1) {
        displayMessage('Input correct email'); 
        return;
    }
    processSignUp(email, passwords[0], username);
}

function requestLogIn() {  
    form.querySelector('.form-message')?.remove();
    const password = form.querySelector('[type="password"]');
    const username =  form.querySelector('[type="text"]');

    if (username.value == '') {
        displayMessage('Input username'); 
        return;
    }
    processLogIn(username.value, password.value);
}

async function processSignUp(email, password, username) {
    const button = document.querySelector('.request-login');
    button.disabled = true;
    const result = await signUp(email.value, password.value, username.value);
    displayMessage(result);
    setTimeout(() => {
        button.disabled = false;
    }, 5000);
}

async function processLogIn(username, password) {
    const button = document.querySelector('.request-login');
    button.disabled = true;
    const result = await logIn(username, password);
    setTimeout(() => {
        button.disabled = false;
    }, 5000);
    if (typeof result == 'string') {
        displayMessage(result);
        return;
    }
    closeAll();
    user = username;
    window.localStorage.setItem('user', username);
    authUpdate();
}

function displayMessage(message) {
    const currentForm = document.querySelector('form');
    const isError = !['Success', 'Done'].includes(message)
    if (isError) {
        makeRedBorder(message);
    }
    const messageSpan = document.createElement('span');
    messageSpan.append(message);
    messageSpan.style.marginBottom='15px';
    if (isError){
        messageSpan.style.color='red';
    }
    messageSpan.classList.add('form-message');
    currentForm.append(messageSpan);
}

function setInputDefault() {
    this.style.borderColor = 'black';
}

function makeRedBorder(err) {  
    const username =  form.querySelector('[type="text"]');
    const passwords = form.querySelectorAll('[type="password"]');
    const email = form.querySelector('[type="email"]');
    if (['Wrong username', 'Username alredy exists', 'Input username'].includes(err)) {
        username.style.borderColor = 'red';
    }
    if (['Password should be at least 6 letters or digits', 'Password is wrong'].includes(err)) {
        passwords[0].style.borderColor = 'red';
    }
    if (err == 'Passwords don\'t match') {
        passwords[1].style.borderColor = 'red';
    }
    if (['Email alredy exists', 'Input correct email'].includes(err)) {
        email.style.borderColor = 'red';
    }
}

function cleanForm() {
    document.querySelectorAll('input').forEach((element) => {
        element.value = '';
        element.style.borderColor = 'black';
    });
    document.querySelector('.form-message')?.remove();
}

function disableScroll() {
    scrollTop = window.pageYOffset;
    window.onscroll = function() {
        window.scrollTo(0, scrollTop);
    };
}

function enableScroll() {
    window.onscroll = null;
}

function paletteBackground(palette, direction = 'right') {
    let str = 'linear-gradient(to ' + direction;
    const n = palette.number;
    let percent = ' 0%';
    for (let i = 0; i < n; i++) {
        str += ', ';
        str += palette[i];
        str += percent;
        percent = ' ' + ((i + 1) / n * 100).toFixed(2) + '%';
        str += percent;
    }
    str += ')';
    return str;
}
