import { register } from './api';
import { getKeyMaterial, getEncryptionKey, getLoginKey, encrypt } from './crypto';
import { template } from '../config/config';


export default async function registerFlow(username, password) {
    // derive key 
    const keyMaterial = await getKeyMaterial(password);
    const encryptionKey = await getEncryptionKey(keyMaterial, username);
    const loginKey = await getLoginKey(keyMaterial, username);

    // create new DB from template, encrypt with key we just generated
    const newDB = template;
    const serializedDB = JSON.stringify(newDB);
    const encryptedDB = await encrypt(serializedDB, encryptionKey);

    // now hit register/ endpoint with username, login key, encrypted blob 
    const resp = await register(username, loginKey, encryptedDB)

    // if success, return
    if (resp?.success) {
        return { success: true };
    } else {
        throw resp?.message;
    }
}

