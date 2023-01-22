import React, { useState, useContext, useEffect } from 'react';
import { DBContext } from '../App/App';
import { KEYBOARD_SHORTCUTS } from '../../config/config';

import ContextMenu from '../ContextMenu/ContextMenu';
import ExplorerList from '../ExplorerList/ExplorerList';
import ExplorerSearch from '../ExplorerSearch/ExplorerSearch';

import './Explorer.css';


export default function Explorer({ UIState }) {
    // internal state
    const { db, changeDB } = useContext(DBContext);
    const [selectedFile, setSelectedFile] = useState(null); // file key
    const [cutFile, setCutFile] = useState(null); // file key
    const [copyFile, setCopyFile] = useState(null);
    const [CMshow, setCMshow] = useState(false);
    const [CMpos, setCMpos] = useState({});

    // utils
    const isDirectory = file_key => {
        return file_key ? db.files[file_key].file_type === 'd' : false;
    }
    const getParent = file_key => {
        return file_key ? db.files[file_key].parent : null;
    }


    // updates to internal state
    const open = file_key => {
        if (!isDirectory(file_key)) {
            UIState.setActiveFile(file_key);
        }
    }
    const select = file_key => {
        if (file_key !== "" && file_key !== selectedFile) {
            setSelectedFile(file_key);
        } else {
            setSelectedFile(null);
        }
    }
    const openContextMenu = (ev, file_key) => {
        ev.preventDefault();

        let style = {};
        if (ev.clientX > window.screen.availWidth / 2) style['right'] = 0;
        if (ev.clientY > window.screen.availHeight / 2) style['bottom'] = 0;
        setCMpos({ x: ev.clientX, y: ev.clientY, style: style });

        setSelectedFile(file_key);
        setCMshow(true);
    }


    // keyboard listener
    useEffect(() => {

        let localCtrlKey = false;
        const ctrl = 17;
        const cmd = 91;
        const xKey = 88;        // cut
        const cKey = 67;        // copy
        const vKey = 86;        // paste
        const rKey = 82;        // rename
        const f2Key = 113;      // rename
        const dKey = 68;        // delete
        const deleteKey = 46;   // delete

        const ctrlKeyDown = ev => {
            if (ev.keyCode === ctrl || ev.keyCode === cmd) {
                localCtrlKey = true;
            }
        }
        const ctrlKeyUp = ev => {
            if (ev.keyCode === ctrl || ev.keyCode === cmd) {
                localCtrlKey = false;
            }
        }
        const keyboardListener = ev => {
            if (localCtrlKey && ev.keyCode === xKey && selectedFile) {
                cut(selectedFile);
            }
            if (localCtrlKey && ev.keyCode === cKey && selectedFile) {
                copy(selectedFile);
            }
            if (localCtrlKey && ev.keyCode === vKey && selectedFile) {
                paste(selectedFile);
            }
            if (((localCtrlKey && ev.keyCode === rKey)
                || (ev.keyCode === f2Key))
                && selectedFile) {
                rename(selectedFile);
            }
            if (((localCtrlKey && ev.keyCode === dKey)
                || (ev.keyCode === deleteKey))
                && selectedFile) {
                remove(selectedFile);
            }
        }

        if (KEYBOARD_SHORTCUTS){
            window.addEventListener("keydown", ctrlKeyDown);
            window.addEventListener("keyup", ctrlKeyUp);
            window.addEventListener("keydown", keyboardListener);
        }

        return () => {
            window.removeEventListener("keydown", ctrlKeyDown);
            window.removeEventListener("keyup", ctrlKeyUp);
            window.removeEventListener("keydown", keyboardListener);
        }

    }, [selectedFile]);


    // Pass CRUD changes up to db
    const cut = file_key => {
        setCopyFile(null);
        setCutFile(file_key);
    }
    const copy = file_key => {
        setCutFile(null);
        setCopyFile(file_key);
    }
    const create_file = () => {
        const dest = isDirectory(selectedFile) ? selectedFile : getParent(selectedFile);
        const newFile = changeDB.add({ file_type: "f", parent: dest });
        select(newFile);
    }
    const create_dir = () => {
        const dest = isDirectory(selectedFile) ? selectedFile : getParent(selectedFile);
        const newFile = changeDB.add({ file_type: "d", parent: dest });
        select(newFile);
    }
    const rename = file_key => {
        let newTitle = window.prompt('Enter new name: ');
        changeDB.edit(file_key, { title: newTitle });
    }
    const remove = file_key => {
        changeDB.remove(file_key);
    }
    const paste = file_key => {
        // calculate destination dir based on input, either selected file or its parent
        const destFile = (db.files[file_key].file_type === 'd') ? file_key : db.files[file_key].parent;

        if (cutFile) {
            // cut = move whole file
            changeDB.edit(cutFile, { parent: destFile });
            setCutFile(null);
        } else if (copyFile) {
            // copy = create duplicate
            changeDB.add({
                "parent": destFile,
                "file_type": db.files[copyFile].file_type,
                "title": `${db.files[copyFile].title} (copy)`,
                "content": db.files[copyFile].content,
                "tags": db.files[copyFile].tags
            });
            setCopyFile(null);
        }
    }

    // callbacks to pass down to children
    const FileCallbacks = {
        select: select,
        open: open,
        openContextMenu: openContextMenu
    }
    const CMactions = {
        open: () => open(selectedFile),
        cut: () => cut(selectedFile),
        copy: () => copy(selectedFile),
        paste: () => paste(selectedFile),
        create_dir: create_dir,
        create_file: create_file,
        rename: () => rename(selectedFile),
        remove: () => remove(selectedFile),
    }


    return (
        <div className="Explorer">
            {UIState.activeMid === "Explorer" &&
                <ExplorerList 
                    create_file={create_file}
                    create_dir={create_dir}
                    FileCallbacks={FileCallbacks}
                    selectedFile={selectedFile}
                />
            }
            {UIState.activeMid === "Search" &&
                <ExplorerSearch 
                    UIState={UIState}
                    FileCallbacks={FileCallbacks}
                    selectedFile={selectedFile}
                />
            }
            <ContextMenu
                show={CMshow}
                setShow={setCMshow}
                pos={CMpos}
                callbacks={CMactions}
            />
        </div>
    )

}