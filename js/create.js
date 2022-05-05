class Palette {
    constructor(colors, user, likes = 0) {
        this.colors = colors;
        this.user = user;
        this.likes = likes;
        this.number = colors.length;
    }

    addColor(newColor) {
        if (this.number < 8) {
            this.colors.push(newColor);
            this.number += 1;
        }
    }
    removeColor() {
        if (this.number > 4) {
            this.colors.pop();
            this.number -= 1;
        }
    }

    get obj() {
        const result = {};
        for (let i = 0; i < this.number; i++) {
            result[i.toString()] = this.colors[i];
        }
        for (let i in this) {
            if (i != 'colors') {
                result[i] = this[i];
            }
        }
        return result;
    }
}

const options = create.querySelector('.options');
const paletteBottom = create.querySelector('.palette-bottom');
options.remove();
const saveForm = document.querySelector('.save-palette-form');
saveForm.remove();

const paletteDiv = create.querySelector('.palette');
let blocked = [];
paletteObj ??= newPalette();
updatePalette();
window.addEventListener('resize', updatePalette);

document.querySelectorAll('.generate-palette').forEach((element) => {
    element.onclick = function () {
        paletteObj.colors = generateColors(paletteObj.number);
        updatePalette();
    };
});
document.querySelectorAll('.display-save-form').forEach((element) => {
    element.onclick = () => {
        saveForm.querySelector('.form-message')?.remove();
        saveForm.querySelector('input').value = paletteObj.name ?? '';
        open(saveForm);
    }
});
document.querySelectorAll('.add-color').forEach((element) => {
    element.onclick = function () {
        paletteObj.addColor(randomColor());
        updatePalette(); 
    };
});
document.querySelectorAll('.delete-color').forEach((element) => {
    element.onclick = function () {
        paletteObj.removeColor();
        updatePalette();
        blocked = blocked.filter(val => val < paletteObj.number);
    };
});

saveForm.querySelector('button').onclick = savePalette;
saveForm .querySelector('input').placeholder = paletteObj.name ?? 'New color';

function generateColors(n) {
    const colors = [];
    for (let i = 0; i < n; i ++) {
        if (blocked.includes(i)) {
            colors.push(paletteObj.colors[i]);
            continue;
        }
        colors.push(randomColor());
    }
    return colors;
}

function randomColor(){
    const color = Math.floor(Math.random() * 16 ** 6 + 1);
    let str = color.toString(16);
    str = str.padStart(6, '0');
    return '#' + str;
}

function updatePalette() {
    paletteDiv.style.background = paletteBackground(paletteObj.obj);
    paletteBottom.removeAttribute('style');
    if (window.innerWidth < 600) {
        paletteBottom.style.background = paletteBackground(paletteObj.obj, 'bottom');
    }

    while (paletteObj.number > paletteBottom.children.length) {
        paletteBottom.append(createOptions());
    }
    while (paletteObj.number < paletteBottom.children.length) {
        paletteBottom.removeChild(paletteBottom.lastChild);
    }

    for (let i = 0; i < paletteBottom.children.length; i++) {
        const arrayOptions = Array.from(paletteBottom.children[i].children);
        manageClassList(arrayOptions, isDark(i), 'dark-color');
        manageClassList(arrayOptions, paletteObj.number > 5, 'small-button');
    }
    const colorInputs = document.querySelectorAll('.hidden-color-input');
    colorInputs.forEach((element, i) => {
        element.value = paletteObj.colors[i];
    });
}

function manageClassList(nodes, condition, className){
    if (condition) {
        nodes.forEach((element) => {
            element.classList.add(className);
        });
    } else {
        nodes.forEach((element) => {
            element.classList.remove(className);
        });
    }
}

function newPalette() {
    const colors = generateColors(paletteObj ? paletteObj.number : 5);
    return new Palette(colors, user);
}

function isDark(i) {
    const rr = paletteObj.colors[i].slice(1,3);
    const gg = paletteObj.colors[i].slice(3,5);
    const bb = paletteObj.colors[i].slice(5,7);
    sum = parseInt(rr, 16) + parseInt(gg, 16) + parseInt(bb, 16);
    return sum < 256;
}

function createOptions() {
    const newOptions = options.cloneNode(true);
    const i = paletteBottom.children.length;
    const blockButton = newOptions.querySelector('.block-color');
    const colorInput = newOptions.querySelector('.hidden-color-input');

    if (blocked.includes(i)) {
        blockButton.replaceChildren('Unblock');
    } 
    colorInput.value = paletteObj.colors[i];

    blockButton.onclick = function () {
        if (blocked.includes(i)) {
            blocked.splice(blocked.indexOf(i), 1);
            this.replaceChildren('Block');
        } else {
            blocked.push(i);
            this.replaceChildren('Unblock');
        }
    };
    newOptions.querySelector('.copy-color').onclick = function () {
        navigator.clipboard.writeText(colorInput.value).then(() => {
            this.replaceChildren('Copied \u2713');
            setTimeout(() => {
                this.replaceChildren('Copy');
            }, 1000);
        });
    };
    colorInput.addEventListener('change', function () {
        paletteObj.colors[i] = colorInput.value;
        updatePalette();
    })
    return newOptions;
}

async function savePalette() {
    document.querySelector('.form-message')?.remove();
    const form = document.querySelector('.save-palette-form');
    const input = form.querySelector('input');
    const button = form.querySelector('button');

    paletteObj.name = input.value ? input.value : input.placeholder;
    if (paletteObj.name == '') {
        displayMessage('Input palette name');
        return;
    }
    const today = new Date();
    const date = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    paletteObj.date ??= date + '.' + month + '.' + today.getFullYear();

    const uploadingPalette = paletteObj.obj;
    button.disabled = true;
    const responseMsg = await uploadPalette(uploadingPalette);
    button.disabled = false;
    paletteObj.id = uploadingPalette.id;
    displayMessage(responseMsg);
    if (responseMsg == 'Done' && window.location.pathname == '/create') {
        window.history.pushState(null, '', '/create/' + paletteObj.id);
    }
    updatePalette();
}
