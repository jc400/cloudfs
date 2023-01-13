export function read(file_id, db){
    // return single file object
    return db.files[file_id];
} 

export function list(file_id, db){
    // return list of file objects with given parent
    return db.files.filter(f => f.parent === file_id);
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


export function create_file(db, parent, title='Untitled document', content=''){
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
    return db;
} 

export function create_dir(db, parent, title='Untitled directory'){
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
    return db;
} 

export function move(db, file_id, parent){
    // update parent of file 
    db.files[file_id].parent = parent;
    return db;
} 

export function rename(db, file_id, title){
    // update title of file 
    db.files[file_id].title = title;
    return db;
} 

export function modify(db, file_id, content){
    // update content of file 
    db.files[file_id].content = content;
    return db;
} 

export function star(db, file_id){
    db.files[file_id].starred = true;
    return db;
}

export function unstar(db, file_id){
    db.files[file_id].starred = false;
    return db;
}

export function delete_(db, file_id){
    db.files.pop(file_id);
    return db;
} 