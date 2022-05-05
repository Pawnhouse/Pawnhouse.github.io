let ticking = false;
let autoScroll = false;
let count;
let scrollInterval;
let startY = window.scrollY;
let startTime = null;
let targetY;
let currentY;

window.addEventListener('scroll', (event) => { 
    if (currentPage != 'index' && currentPage != '/') {
        return;
    }
    if (!ticking) {
        window.setTimeout(changeLogo, 50);
        ticking = true;
    }
    const diff = window.scrollY - startY;
    if (autoScroll || Math.abs(diff) < 5) {
        return;
    }
    const now = Date.now();
    if (startTime === null) {
        startTime = now;
        startY = window.scrollY;
    }
    if(startTime == now) {
        return;
    }
    const speed = diff / (now - startTime);
    if (speed > 0) {
        targetY = Math.ceil( window.scrollY / window.innerHeight) * window.innerHeight;
    } else if (speed < 0) {
        targetY = Math.floor( window.scrollY / window.innerHeight) * window.innerHeight;
    } else {
        return;
    }
    count = Math.round(window.innerHeight / Math.abs(speed) / 10) * 5;
    count = Math.max(count, 20);
    count = Math.min(count, 500);
    autoScroll = true;
    scrollInterval = window.setInterval(scroll, 5);
});

function scroll() {
    const timeRemains = count + startTime - Date.now();
    if(timeRemains < -200) {
        autoScroll = false;
        startY = window.scrollY;
        startTime = null;
        clearInterval(scrollInterval);
        return;
    } 
    if (timeRemains < 0) {
        window.scrollTo({top: currentY});
        return;
    }
    
    const x = (Date.now() - startTime) / count;
    const alpha = (x ** 3 / -3 + x ** 2 / 2 + x / 10) / (0.6 - 1/3);
    currentY = Math.round(alpha * targetY + (1 - alpha) * startY);
    window.scrollTo({top: currentY});
}

function changeLogo() {
    const logo = document.querySelector('.logo');
    if (!document.querySelector('.main-logo')) {
        logo.classList.replace('no-logo','display-logo');
        return;
    }
    const rect = document.querySelector('.main-logo').getBoundingClientRect();
    if (logo.classList.contains('no-logo') && rect.bottom < 0)
        logo.classList.replace('no-logo','display-logo');
    else if (logo.classList.contains('display-logo') && rect.bottom > 0)
        logo.classList.replace('display-logo','no-logo');
    ticking = false;
}


