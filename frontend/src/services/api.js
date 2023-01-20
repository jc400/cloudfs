import hit from './hit';

export async function register(username, password){
    return hit("POST", "auth/register", {
        username: username,
        password: password,
    });
} 

export async function login(username, password){
    return hit("POST", "auth/login", {
        username: username,
        password: password,
    });
} 

export async function logout(){
    return hit("GET", "auth/logout");
} 

export async function check_login(){
    return hit("GET", "auth/check_login");
}


export async function getBlob() {
    const response = await hit("GET", "blob");
    const encrypted = response?.blob;
    const data = encrypted; // add decryption later
    return JSON.parse(data);
}

export async function putBlob(db) {
    const data = JSON.stringify(db);
    const encrypted = data; // add encryption later
    return hit("PUT", "blob", {
        blob: encrypted
    });
}