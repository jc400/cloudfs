import { putVault } from './api';
import { encrypt } from './crypto';


export default async function saveVaultFlow(db, encryptionKey, token){

    // serialize and encrypt db
    const serialized = JSON.stringify(db);
    const encrypted = await encrypt(serialized, encryptionKey);

    // push to API
    const resp = await putVault(encrypted, token);
    return resp;
}