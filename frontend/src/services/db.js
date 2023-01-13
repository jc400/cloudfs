export function read(file_id, db){
    // return single file object
    return db.files[file_id];
} 

export function list(file_id, db){
    // return list of file objects with given parent
    return db.files.filter(f => {
        f.parent === file_id;
    });
} 

export function get_path(file_id, db){
    // traverse file tree, return ordered list of parents
    throw "WIP";
}

export function get_starred(db){
    // return list of file objects that are starred
    return db.files.filter(f => f.starred);
}

export function get_recent(db){
    // returns X most recently updated files
    throw "WIP";
}

export function get_home(db){
    // returns index to home dir. Shouldn't be necessary.
    return db.files[0];
}

export function create_file(parent, title='Untitled document', content='', db){
    let file = {
        "parent":parent,
        "file_type":"f",
        "title":title,
        "content":content,
        "created":Date(),
        "updated":Date(),
        "size":content.length,
        "starred":false,
        "tags":[]
    };
    db.files.push(file);
} 

export function create_dir(parent, title='Untitled directory', db){
    let dir = {
        "parent":parent,
        "file_type":"d",
        "title":title,
        "content":null,
        "created":Date(),
        "updated":Date(),
        "size":null,
        "starred":false,
        "tags":[]
    };
    db.files.push(dir);
} 

export function move(file_id, parent, db){
    // update parent of file 
    db.files[file_id].parent = parent;
} 

export function rename(file_id, title, db){
    // update title of file 
    db.files[file_id].title = title;
} 

export function modify(file_id, content, db){
// update content of file 
db.files[file_id].content = content;
} 

export function star(file_id, db){
    db.files[file_id].starred = true;
}

export function unstar(file_id){
    db.files[file_id].starred = false;
}

export function delete_(file_id, db){
    db.files.pop(file_id);
} 