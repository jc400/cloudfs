import { putBlob } from './api';
import { getKeyMaterial, getKey, encrypt } from './crypto';


export default async function saveDB(db, username, password){

    // derive key 
    const keyMaterial = await getKeyMaterial(password);
    const key = await getKey(keyMaterial, username);

    // serialize and encrypt db
    const serialized = JSON.stringify(db);
    const encrypted = await encrypt(serialized, key);

    // push to API
    const resp = await putBlob(encrypted);
    return resp;

}