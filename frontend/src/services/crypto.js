

function _encode(text) {
    // encodes text as Uint8 suitable for crypto operations
    const enc = new TextEncoder();
    return enc.encode(text);
}
function _decode(bytes) {
    // decodes bytes back into ascii
    const dec = new TextDecoder();
    return dec.decode(bytes);
}
function _arrayBufferToString(buffer) {
    //see https://stackoverflow.com/questions/46916718/oaep-padding-error-when-decrypting-data-in-c-sharp-that-was-encrypted-in-javascr?noredirect=1&lq=1 
    var result = '';
    var bytes = new Uint8Array(buffer);
    for (var i = 0; i < bytes.length; i++) {
        result += String.fromCharCode(bytes[i]);
    }
    return result;
}
function _stringToArrayBuffer(value) {
    // Converts a string to an ArrayBuffer
    var bytes = new Uint8Array(value.length);
    for (var i = 0; i < value.length; i++) {
        bytes[i] = value.charCodeAt(i);
    }
    return bytes.buffer;
}


export function getKeyMaterial(password) {
    // convert string password to cryptoobject material
    return window.crypto.subtle.importKey(
        "raw",
        _encode(password),
        "PBKDF2",
        false,
        ["deriveBits", "deriveKey"],
    );
}

export function getKey(keyMaterial, salt) {
    // derive AES encryption/decryption key from pw keymaterial +salt
    return window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: _encode(salt),
            iterations: 100000,
            hash: "SHA-256",
        },
        keyMaterial,
        { "name": "AES-GCM", "length": 256 },
        true,
        ["encrypt", "decrypt"],
    );
}

export async function encrypt(plaintext, key) {
    // encrypts string plaintext, returns JSON with string-encoded ciphertext
    const ivBytes = window.crypto.getRandomValues(new Uint8Array(12));
    const ciphertextBuffer = await window.crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: ivBytes
        },
        key,
        _encode(plaintext),
    );

    return JSON.stringify({
        ciphertext: _arrayBufferToString(ciphertextBuffer),
        iv: _arrayBufferToString(ivBytes),
    });
}

export async function decrypt(ciphertextString, key) {
    // pulls string encoded ciphertext from JSON, converts to arrayBuffer, decrypts
    const ciphertextJSON = JSON.parse(ciphertextString);
    const ivBytes = _stringToArrayBuffer(ciphertextJSON.iv);
    const ciphertextBuffer = _stringToArrayBuffer(ciphertextJSON.ciphertext);

    const decrypted = await window.crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: ivBytes
        },
        key,
        ciphertextBuffer
    );
    const plaintext = _decode(decrypted);

    return plaintext;
}

