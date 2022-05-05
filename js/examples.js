let examplesList;
const item = examples.children[0];
item.remove();
let likesInterval;
let likeButton;
let likesValue;
let paletteId;

showExamples();

async function showExamples() {
    examples.replaceChildren();
    examplesList = await getExamples(); 
    examplesList.sort((a, b) => b.likes - a.likes);
    examplesList.forEach((element) => {
        createExample(element);
    });
}

function createExample(element) {
    const block = item.cloneNode(true);
    block.querySelector('.palette').style.background = paletteBackground(element);
    block.querySelector('span').append(element.likes);
    examples.append(block);

    const button = block.querySelector('button');
    button.addEventListener('mousedown', () => {
        likeButton = button;
        likePalette();
        likesInterval = setInterval(likePalette, 100);
    });
    button.addEventListener('mouseup', () => {
        clearInterval(likesInterval); 
        uploadLikes(likesValue, paletteId);
    });
}

function likePalette() { 
    const n = Array.from(examples.children).indexOf(likeButton.parentNode.parentNode);
    paletteId = examplesList[n].id;

    const span = examples.children[n].querySelector('span');
    likesValue = +span.textContent + 1;
    span.replaceChildren(likesValue);
}