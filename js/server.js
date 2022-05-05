async function patchData(path, obj) {
    const response = await fetch(
        'https://color-scheme-constructor-default-rtdb.europe-west1.firebasedatabase.app/' 
        + path
        + '.json',
        {method: 'PATCH', body: JSON.stringify(obj)}
    );
    if (response.status >= 400 && response.status < 600) {
        console.log(response);
        throw new Error();
    }
}
async function getData(path) {
    const response = await fetch(
        'https://color-scheme-constructor-default-rtdb.europe-west1.firebasedatabase.app/' 
        + path
        + '.json'
    );
    if (response.status >= 400 && response.status < 600) {
        console.log(response);
        throw new Error();
    }
    return await response.json();
}


async function getEmail(username) {
    const path = 'users/' + username;
    const user = await getData(path);
    return user?.email;
}

async function signUp(email, password, username) {
    let response;
    try {
        if (await getEmail(username) !== undefined) {
            return 'Username alredy exists';
        }
        const newUser = {
            email: email,
            password: password,
            returnSecureToken: true,
        }
        response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAXEQLbaeSoON8MlSyZwou2iJzCIQo7qmU', {
            method: "POST",
            body: JSON.stringify(newUser), 
            headers: {
            "Content-type": "application/json",
            },
        });
        let data = await response.json();
        if (data.error?.message == 'EMAIL_EXISTS') {
            return 'Email alredy exists';
        }
        if (response.status >= 400 && response.status < 600) {
            throw new Error();
        }
        const path ='users/' + username;
        await patchData(path, {email: email});
        return 'Success';
    } catch(e) {
        console.log(e);
        return 'Connection error';
    }
    
}

async function logIn(username, password) {
    try {
        const email = await getEmail(username);
        if (email === undefined) {
            return 'Wrong username';
        }
        const user = {
            email: email,
            password: password,
            returnSecureToken: true,
        }
        const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAXEQLbaeSoON8MlSyZwou2iJzCIQo7qmU', {
            method: "POST",
            body: JSON.stringify(user), 
            headers: {
            "Content-type": "application/json",
            },
        });
        const data = await response.json();
        if (data.error?.message == 'INVALID_PASSWORD') {
            return 'Password is wrong';
        }
        if (response.status >= 400 && response.status < 600) {
            throw new Error();
        }
    } catch(e) {
        console.log(e);
        return 'Connection error';
    }
}

async function getExamples() {
    const examplesList = [];
    try { 
        const data = await getData('examples'); 
        for (let i in data) {
            if(data[i]) {
                examplesList.push(data[i]);                
            }
        } 
    } catch(e) { }
    return examplesList;
}

async function uploadLikes(likesNumber, paletteId) {
    try {
        let path = 'examples/' + paletteId;
        await patchData(path, {likes: likesNumber});
        const user = await getData(path + '/user');
        path = 'users/' + user + '/' + paletteId;
        await patchData(path, {likes: likesNumber});       
    } catch(e) { }
}

async function uploadPalette(palette) {
    try {    
        if (!palette.id) {
            palette.id ??= await getData('newId');
            await patchData('', {newId: palette.id + 1});
        }
        let path = 'examples/' + palette.id;
        await patchData(path, palette);
        path = 'users/' + palette.user + '/' + palette.id;
        await patchData(path, palette);
        return 'Done';
    } catch(e) {
        return 'Connection error';
    }
}

async function getSaved() {
    const savedList = [];
    try { 
        const path = 'users/' + user;
        const data = await getData(path);
        for (let i in data) {
            if (i && i != 'email') {
                savedList.push(data[i]);
            }
        } 
    } catch(e) { }
    return savedList;
}

async function deletePalette(id) {
    await fetch(
        'https://color-scheme-constructor-default-rtdb.europe-west1.firebasedatabase.app/' 
        + 'examples/' 
        + id
        + '.json',
        {method: 'DELETE'}
    );
    await fetch(
        'https://color-scheme-constructor-default-rtdb.europe-west1.firebasedatabase.app/' 
        + 'users/' 
        + user 
        + '/'
        + id
        + '.json',
        {method: 'DELETE'}
    );
}