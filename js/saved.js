let savedList;
let blockPosition;
const savedItem = saved.children[0];
savedItem.remove();
const deleteForm = document.querySelector('.delete-palette-form');
deleteForm.remove();

const deleteButtons = deleteForm.querySelectorAll('button');
deleteButtons[0].onclick = () => {
    savedList = savedList.filter(value => value.id != paletteId); 
    saved.children[blockPosition].remove();
    close(deleteForm);
    deletePalette(paletteId);  
};
deleteButtons[1].onclick = () => close(deleteForm);

showSaved();

async function showSaved() {
    saved.replaceChildren();
    savedList = await getSaved();
    savedList.forEach(element => createSavedPalette(element));
}

function createSavedPalette(element) {
    const block = savedItem.cloneNode(true);
    block.querySelector('.palette').style.background = paletteBackground(element);
    const likesSpan = block.querySelector('.likes span');
    likesSpan.append(element.likes);
    const colorInfo = block.querySelector('.color-info');
    colorInfo.children[0].replaceChildren(element.name);
    colorInfo.append('Saved: ' + element.date);
    saved.append(block);
    
    block.querySelector('.deleting-form').onclick = () => {
        blockPosition = Array.from(saved.children).indexOf(block);
        paletteId = element.id;
        open(deleteForm);
    }
    block.querySelector('.name').onclick = () => {
        blockPosition = Array.from(saved.children).indexOf(block); 
        const colors = [];
        for (let i = 0; i < savedList[blockPosition].number; i++) {
            colors.push(savedList[blockPosition][i.toString()]);
        }
        paletteObj = new Palette(colors, user, savedList[blockPosition].likes);
        paletteObj.name = savedList[blockPosition].name;
        paletteObj.id = savedList[blockPosition].id;
        paletteObj.date = savedList[blockPosition].date;
        loadPage('/create', element.id);
    }
}
