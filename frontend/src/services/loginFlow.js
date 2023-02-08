import { login } from './api';
import { getKeyMaterial, getEncryptionKey, getLoginKey } from './crypto';


export default async function loginFlow(username, password){

    // derive key 
    const keyMaterial = await getKeyMaterial(password);
    const encryptionKey = await getEncryptionKey(keyMaterial, username);
    const loginKey = await getLoginKey(keyMaterial, username);

    // hit api to login
    const resp = await login(username, loginKey);

    // if success, return valid username/key. Else return message.
    if (resp?.success){
        return {
            success: true, 
            username: username, 
            encryptionKey: encryptionKey,
            token: resp.access_token
        };
    } else {
        throw resp?.message;
    }

}