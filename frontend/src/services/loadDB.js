import { getBlob } from './api';
import { getKeyMaterial, getKey, decrypt } from './crypto';


export default async function loadDB(username, password){

    try {
        // retrieve encrypted blob
        const blob = await getBlob();

        // derive key 
        const keyMaterial = await getKeyMaterial(password);
        const key = await getKey(keyMaterial, username);

        // decrypt blob and deserialize
        const decrypted = await decrypt(blob, key);
        const db = JSON.parse(decrypted);

        return {success: true, db: db};

    } catch {
        return {success: false, message: "Error retrieving encrypted vault"};
    }

}