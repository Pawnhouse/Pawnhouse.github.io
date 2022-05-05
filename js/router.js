let currentPage = 'index';

const index = document.querySelector('.index');
const examples = document.querySelector('.examples');
const create = document.querySelector('.create');
const saved = document.querySelector('.saved'); 

document.querySelectorAll('.examples-route').forEach( element => {
    element.onclick = () => {
        loadPage('/examples');
        showExamples();
    }
});
document.querySelectorAll('.index-route').forEach( element => {
    element.onclick = () => loadPage('/');
    
});
document.querySelectorAll('.create-route').forEach( element => {
    element.onclick = () => {
        loadPage('/create');
        paletteObj = null;
        paletteObj = newPalette();
        updatePalette();
    }
});
document.querySelectorAll('.saved-route').forEach( element => {
    element.onclick = () => {
        loadPage('/saved');
        showSaved();
    }
});

const ref = {'/': index, '/examples': examples, '/create': create, '/saved': saved};

function loadPage(page, id = null) {
    document.querySelector('.main-content').remove();
    currentPage = page;
    if (id === null){
        window.history.pushState(null, '', page);
        document.body.append(ref[page]);
    } else {
        window.history.pushState(null, '', '/create/' + id);
        document.body.append(create);
        updatePalette();
    }
    changeLogo();
    closeAll();
    updateMenu();
}