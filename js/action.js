const header = document.querySelector('header');



const navButtons = document.querySelector('.nav-buttons');
const hello = header.querySelector('.hello');
hello.onclick = openCloseNav;
const helloMenu = document.createElement('p');
helloMenu.classList.add('center');

const headerNav = document.querySelector('.header-nav');
document.querySelectorAll('.exit').forEach((element) => {
    element.onclick = exit;
});
authUpdate();
menu.remove();
form.remove();
examples.remove();
create.remove();
saved.remove();
document.body.removeAttribute('style');

function authUpdate() {
    username = window.localStorage.getItem('user');
    navButtons.remove();
    hello.remove();
    helloMenu.remove();
    headerNav.remove();
    if (user !== null) {
        header.append(hello);
        hello.replaceChildren('Hello, ' + username.slice(0, 32));
        menu.insertBefore(helloMenu, menu.children[0]);
        helloMenu.replaceChildren('Hello, ' + username.slice(0, 15));
        header.classList.add('main-functions-header');
    } else {
        header.append(headerNav);
        header.append(navButtons);
        header.removeAttribute('class');
    }
    updateMenu();
}

function exit() {
    user = null;
    paletteObj = null;
    localStorage.clear();
    authUpdate();
    loadPage('/');
}

function updateMenu() {
    const ref = {true: '.auth-display', false: '.no-auth-display'};
    displayMenuSelector(ref[!user], false);
    displayMenuSelector(ref[!!user]);  
    if (!user) {
        return;
    } 
    if (currentPage == '/create') {
        displayMenuSelector('.only-create');
        displayMenuSelector('.create-route', false);
    } else {
        displayMenuSelector('.only-create', false);
        displayMenuSelector('.create-route');
    }
}

function displayMenuSelector(selector, show=true) {
    if (show) {
        menu.querySelectorAll(selector).forEach(element => {
            element.removeAttribute('style');
        });
    } else {
        menu.querySelectorAll(selector).forEach(element => {
            element.style.display = 'none';
        });
    }
}