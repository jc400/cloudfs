import { login } from './api';
import { getKeyMaterial, getEncryptionKey, getLoginKey } from './crypto';


export default async function loginFlow(username, password){

    try {

        // derive key 
        const keyMaterial = await getKeyMaterial(password);
        const encryptionKey = await getEncryptionKey(keyMaterial, username);
        const loginKey = await getLoginKey(keyMaterial, username);

        // hit api to login
        const resp = await login(username, loginKey);

        // if success, return valid username/key. Else return message.
        if (resp?.success){
            return {success: true, username: username, encryptionKey: encryptionKey};
        } else {
            return {success: false, message: resp?.message}
        }


    } catch {
        return {success: false, message: "Error logging in"};
    }

}