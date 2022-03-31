if(document.getElementsByTagName('form')[0].getElementsByClassName('close')[0])
    document.getElementsByTagName('form')[0].getElementsByClassName('close')[0].onclick = close;
document.getElementsByClassName('dark-background')[0].onclick = closeAll;
document.getElementsByClassName('hamburger')[0].onclick = openMenu;
document.getElementsByClassName('menu')[0].getElementsByClassName('close')[0].onclick = closeMenu; 
if(document.getElementsByClassName('login-form')[0])
{
    document.getElementsByClassName('login-form')[0].onclick = login;
    document.getElementsByClassName('signup-form')[0].onclick = signup;
    document.getElementsByClassName('login-form')[1].onclick = login;
    document.getElementsByClassName('signup-form')[1].onclick = signup;
}
let deleting = document.getElementsByClassName('deleting-form');
for(let i = 0; i < deleting.length; i++)
    deleting[i].onclick = open;
if(document.getElementsByClassName('save-form')[0])
{
    document.getElementsByClassName('save-form')[0].onclick = open;
    document.getElementsByClassName('save-form')[1].onclick = open;
}
if(document.getElementsByClassName('hello')[0])
    document.getElementsByClassName('hello')[0].onclick = openCloseNav;

function close(){
    document.getElementsByClassName('dark-background')[0].removeAttribute('style');
    document.getElementsByTagName('form')[0].style.display = 'none';
}
function closeMenu(){
    document.getElementsByClassName('dark-background')[0].removeAttribute('style');
    document.getElementsByClassName('menu')[0].style.display = 'none';
}
function closeAll(){
    close();
    closeMenu();
}
function open(){
    document.getElementsByClassName('dark-background')[0].style.display = 'block';
    document.getElementsByTagName('form')[0].style.display = 'flex';
}
function openMenu(){
    document.getElementsByClassName('dark-background')[0].style.display = 'block';
    document.getElementsByClassName('menu')[0].style.display = 'grid';
}
function openCloseNav(){
    let nav = document.getElementsByTagName('nav')[0];
    if (nav.style.display == 'flex')
        nav.removeAttribute('style');
    else
        nav.style.display = 'flex';
}
function login(){
    open();
    let login = document.getElementsByClassName('login');
    let signup = document.getElementsByClassName('signup');
    for (let i = 0; i < login.length; i++)
        login[i].removeAttribute('style');
    for (let i = 0; i < signup.length; i++)
        signup[i].style.display = 'none';
}
function signup(){
    open();
    let login = document.getElementsByClassName('login');
    let signup = document.getElementsByClassName('signup');
    var i;
    for (let i = 0; i < login.length; i++)
        login[i].style.display = 'none';
    for (let i = 0; i < signup.length; i++)
        signup[i].removeAttribute('style');                
}