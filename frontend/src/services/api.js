import { BACKEND_URL } from '../config/config';

export async function register(username, password, vault){
    const url = `${BACKEND_URL}/auth/register`;
    const options = {
        method: 'POST',
        mode: 'cors',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            username: username,
            password: password,
            vault: vault,
        })
    }

    return fetch(url, options)
    .then(resp => {
        if (resp?.ok) {
            return resp;
        } else {
            throw resp; 
        }
    })
    .then(resp => resp.json())
}

export async function login(username, password){
    const url = `${BACKEND_URL}/auth/login`;
    const options = {
        method: 'POST',
        mode: 'cors',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            username: username,
            password: password,
        })
    }

    return fetch(url, options)
    .then(resp => {
        if (resp?.ok) {
            return resp;
        } else {
            throw resp; 
        }
    })
    .then(resp => resp.json())
}

export async function logout(token){
    const url = `${BACKEND_URL}/auth/logout`;
    const options = {
        method: 'DELETE',
        mode: 'cors',
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }

    return fetch(url, options)
    .then(resp => {
        if (resp?.ok) {
            return resp;
        } else {
            throw resp; 
        }
    })
    .then(resp => resp.json())
}

export async function check_login(token){
    const url = `${BACKEND_URL}/auth/check_login`;
    const options = {
        method: 'GET',
        mode: 'cors',
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }

    return fetch(url, options)
    .then(resp => {
        if (resp?.ok) {
            return resp;
        } else {
            throw resp; 
        }
    })
    .then(resp => resp.json())
}

export async function getVault(token) {
    const url = `${BACKEND_URL}/vault`;
    const options = {
        method: 'GET',
        mode: 'cors',
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }

    return fetch(url, options)
    .then(resp => {
        if (resp?.ok) {
            return resp;
        } else {
            throw resp; 
        }
    })
    .then(resp => resp.json())
    .then(resp => resp.vault);
}

export async function putVault(vault, token) {
    const url = `${BACKEND_URL}/vault`;
    const options = {
        method: 'PUT',
        mode: 'cors',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            vault: vault
        })
    }

    return fetch(url, options)
    .then(resp => {
        if (resp?.ok) {
            return resp;
        } else {
            throw resp; 
        }
    })
    .then(resp => resp.json())
}