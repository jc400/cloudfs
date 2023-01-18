import React, { useState, useContext } from 'react';
import { DBContext } from '../App/App';

import ContextMenu from '../ContextMenu/ContextMenu';
import IconButton from '../IconButton/IconButton';
import File from '../File/File';
import Directory from '../Directory/Directory';
import ScrollArea from '../ScrollArea/ScrollArea';

import './FileExplorer.css';
import FileAdd from '../../assets/file-plus.svg';
import DirAdd from '../../assets/folder-plus.svg';
import SearchIcon from '../../assets/search.svg';


export default function FileExplorer({ activeMid, setActiveFile }) {
    // FileExplorer's internal state
    const { db, changeDB } = useContext(DBContext);
    const [selectedFile, setSelectedFile] = useState(null); // file key
    const [cutFile, setCutFile] = useState(null); // file key
    const [CMshow, setCMshow] = useState(false);
    const [CMpos, setCMpos] = useState({});
    const [queryShow, setQueryShow] = useState(false);
    const [queryString, setQueryString] = useState('');


    // Internal updates to FileExplorer state
    const isDirectory = file_key => {
        return db.files[file_key].file_type === 'd';
    }
    const open = file_key => {
        if (!isDirectory(file_key)){
            setActiveFile(file_key);
        }
    }
    const select = file_key => {
        if (file_key !== "" && file_key !== selectedFile) {
            setSelectedFile(file_key);
        } else {
            setSelectedFile(null);
        }
    }
    const cut = file_key => {
        setCutFile(file_key);
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
        setQueryString(ev.target.value);
    }
    

    // Pass CRUD changes up to db
    const create_file = () => {
        const dest = selectedFile && isDirectory(selectedFile) ? selectedFile : "home";
        changeDB.add({ file_type: "f", parent: dest });
    }
    const create_dir = () => {
        const dest = selectedFile && isDirectory(selectedFile) ? selectedFile : "home";
        changeDB.add({ file_type: "d", parent: dest });
    }
    const rename = file_key => {
        let newTitle = window.prompt('Enter new name: ');
        changeDB.edit(file_key, { title: newTitle });
    }
    const remove = file_key => {
        changeDB.remove(file_key);
    }
    const move = (target, dest) => {
        if (db.files[dest].file_type === 'd') {
            changeDB.edit(target, { parent: dest });
        }
    }

    // callbacks to pass down to children
    const FileCallbacks = {
        handleClick: (ev, file_key) => select(file_key),
        handleDoubleClick: (ev, file_key) => open(file_key),
        handleCM: (ev, file_key) => openContextMenu(ev, file_key),
    }
    const CMactions = {
        open: () => open(selectedFile),
        cut: () => cut(selectedFile),
        paste: () => move(cutFile, selectedFile),
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
            if (v.title?.includes(queryString)) return true;
            if (v.content?.includes(queryString)) return true;
            if (v.tags?.includes(queryString)) return true;
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
    const fileList = queryShow ? getSearch() : getChildren("home");

    return (
        <>
            {activeMid === "FileExplorer" &&
                <div className="FileExplorer">

                    <div className="FileExplorer-header">
                        <div className="FileExplorer-header-top">
                            <span>NOTES</span>
                            <span>
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
                                &nbsp;
                                <IconButton
                                    src={SearchIcon}
                                    size="18px"
                                    onClick={() => setQueryShow(!queryShow)}
                                    tooltip="Search notes"
                                />
                            </span>
                        </div>
                        {queryShow && 
                            <div className="FileExplorer-header-search">
                                <input value={queryString || ''} onChange={handleQueryChange} />
                                <div>{fileList.length} results</div>
                            </div>
                        }
                    </div>

                    <ScrollArea bgColor="var(--gray3)">
                        {fileList}
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