const ENDPOINT = '';

export default async function hit(method, route, file_id=null, data=null) {
    let url = `${ENDPOINT}/${route}`;
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
