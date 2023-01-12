import hit from './hit';

export async function read(file_id){
    return hit("GET", "files", file_id);
} 

export async function list(file_id){
    return hit("GET", "list", file_id);
} 

export async function get_path(file_id){
    return hit("GET", "path", file_id);
}

export async function get_starred(){
    return hit("GET", "starred");
}

export async function get_recent(){
    return hit("GET", "recent");
}

export async function get_home(){
    return hit("GET", "home");
}

export async function create_file(parent, title='Untitled document', content=''){
    return hit("POST", "files", "", {
        parent: parent,
        title: title,
        content: content,
        file_type: "f",
    })
    .then(resp => resp?.file);
} 

export async function create_dir(parent, title='Untitled directory'){
    return hit("POST", "files", "", {
        parent: parent,
        title: title,
        file_type: "d",
    })
    .then(resp => resp?.file);
} 

export async function move(file_id, parent){
    return await hit("PUT", "files", file_id, {
        parent: parent,
    });
} 

export async function rename(file_id, title){
    return hit("PUT", "files", file_id, {
        title: title,
    });
} 

export async function modify(file_id, content){
    return hit("PUT", "files", file_id, {
        content: content,
    });
} 

export async function star(file_id){
    return hit("PUT", "files", file_id, {
        starred: true,
    });
}

export async function unstar(file_id){
    return hit("PUT", "files", file_id, {
        starred: false,
    });
}

export async function delete_(file_id){
    return hit("DELETE", "files", file_id);
} 