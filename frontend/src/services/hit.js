import { BACKEND_URL } from '../config/config';

export default async function hit(method, route, file_id=null, data=null) {
    let url = `${BACKEND_URL}/${route}`;
    let options = {
        method: method,
        mode: 'cors',
    }
    if (data) {
        options.headers = {'Content-Type':'application/json'};
        options.body = JSON.stringify(data);
    }
    if (file_id){
        url += '/' + file_id;
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
