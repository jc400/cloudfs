import { BACKEND_URL } from '../config/config';

export default async function hit(method, route, data=null) {
    let url = `${BACKEND_URL}/${route}`;
    let options = {
        method: method,
        mode: 'cors',
    }
    if (data) {
        options.headers = {'Content-Type':'application/json'};
        options.body = JSON.stringify(data);
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
