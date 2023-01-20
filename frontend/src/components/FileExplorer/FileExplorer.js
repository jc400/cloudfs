import React, { useState, useContext, useEffect } from 'react';
import { DBContext } from '../App/App';
import { KEYBOARD_SHORTCUTS } from '../../config/config';

import ContextMenu from '../ContextMenu/ContextMenu';
import IconButton from '../IconButton/IconButton';
import File from '../File/File';
import Directory from '../Directory/Directory';
import ScrollArea from '../ScrollArea/ScrollArea';

import './FileExplorer.css';
import FileAdd from '../../assets/file-plus.svg';
import DirAdd from '../../assets/folder-plus.svg';
import SearchIcon from '../../assets/search.svg';


export default function FileExplorer({ UIState }) {
    // FileExplorer's internal state
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


    // Internal updates to FileExplorer state
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
    const handleQueryChange = ev => {
        UIState.setSearchString(ev.target.value);
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
        changeDB.add({ file_type: "f", parent: dest });
    }
    const create_dir = () => {
        const dest = isDirectory(selectedFile) ? selectedFile : getParent(selectedFile);
        changeDB.add({ file_type: "d", parent: dest });
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
        rename: () => rename(selectedFile),
        remove: () => remove(selectedFile),
    }

    // calculate results
    const getChildren = file_key => {
        return Object.entries(db.files)
            .filter(([k, v]) => v.parent === file_key)
            .sort((a, b) => (b[1]?.file_type === 'd') - (a[1]?.file_type === 'd'))
            .map(([k, v]) => {
                if (v.file_type === 'f') {
                    return (
                        <File
                            key={k}
                            file_key={k}
                            file={v}
                            callbacks={FileCallbacks}
                            style={k === selectedFile ? { backgroundColor: 'var(--accent)' } : {}}
                        />
                    )
                } else {
                    return (
                        <Directory
                            key={k}
                            file_key={k}
                            file={v}
                            callbacks={FileCallbacks}
                            style={k === selectedFile ? { backgroundColor: 'var(--accent)' } : {}}
                        >
                            {getChildren(k)}
                        </Directory>
                    )
                }
            });
    }
    const getSearch = () => {
        return Object.entries(db.files)
            .filter(([k, v]) => {
                if (v.title?.includes(UIState.searchString)) return true;
                if (v.content?.includes(UIState.searchString)) return true;
                if (v.tags?.includes(UIState.searchString)) return true;
            })
            .sort((a, b) => (b[1]?.file_type === 'd') - (a[1]?.file_type === 'd'))
            .map(([k, v]) => {
                if (v.file_type === 'f') {
                    return (
                        <File
                            key={k}
                            file_key={k}
                            file={v}
                            callbacks={FileCallbacks}
                            style={k === selectedFile ? { backgroundColor: 'var(--accent)' } : {}}
                        />
                    )
                } else {
                    return (
                        <Directory
                            key={k}
                            file_key={k}
                            file={v}
                            callbacks={FileCallbacks}
                            style={k === selectedFile ? { backgroundColor: 'var(--accent)' } : {}}
                        >
                            {getChildren(k)}
                        </Directory>
                    )
                }
            });
    }

    return (
        <>
            {UIState.activeMid === "FileExplorer" &&
                <div className="FE">


                    <div className="FE-header-notes">
                        <h2>NOTES</h2>
                        <span className="FE-header-buttons">
                            <IconButton
                                src={FileAdd}
                                size="18px"
                                onClick={create_file}
                                tooltip="New note"
                            />
                            &nbsp;
                            <IconButton
                                src={DirAdd}
                                size="18px"
                                onClick={create_dir}
                                tooltip="New directory"
                            />
                        </span>
                    </div>


                    <ScrollArea bgColor="var(--gray3)">
                        {getChildren(null)}
                    </ScrollArea>

                    <ContextMenu
                        show={CMshow}
                        setShow={setCMshow}
                        pos={CMpos}
                        callbacks={CMactions}
                    />
                </div>
            }
            {UIState.activeMid === "Search" &&
                <div className="FE">

                    <div className="FE-header-search">
                        <label htmlFor="search"><h2>SEARCH</h2></label>
                        <input
                            name="search files"
                            type="search"
                            value={UIState.searchString || ''}
                            onChange={handleQueryChange} />
                        <div>{getSearch().length} results</div>
                    </div>

                    <ScrollArea bgColor="var(--gray3)">
                        {getSearch()}
                    </ScrollArea>

                    <ContextMenu
                        show={CMshow}
                        setShow={setCMshow}
                        pos={CMpos}
                        callbacks={CMactions}
                    />
                </div>
            }
        </>
    )

}