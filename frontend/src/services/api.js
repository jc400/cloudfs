import hit from './hit';

export async function register(username, password, vault){
    return hit("POST", "auth/register", {
        username: username,
        password: password,
        vault: vault,
    });
} 

export async function login(username, password){
    return hit("POST", "auth/login", {
        username: username,
        password: password,
    });
} 

export async function logout(){
    return hit("GET", "auth/logout");
} 

export async function check_login(){
    return hit("GET", "auth/check_login");
}


export async function getVault() {
    return hit("GET", "vault")
    .then(resp => resp.vault);
}

export async function putVault(vault) {
    return hit("PUT", "vault", {
        vault: vault
    });
}