import hit from './hit';

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