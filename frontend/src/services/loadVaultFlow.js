import { getVault } from './api';
import { decrypt } from './crypto';


export default async function loadVaultFlow(encryptionKey, token){

        // retrieve encrypted blob (should have login session)
        const vault = await getVault(token);

        // decrypt blob and deserialize
        const decrypted = await decrypt(vault, encryptionKey);
        const db = JSON.parse(decrypted);

        return {success: true, db: db};

}