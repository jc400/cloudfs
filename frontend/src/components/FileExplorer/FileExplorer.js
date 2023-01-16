import React, { useState, useReducer, useEffect, useContext } from 'react';
import { DBContext } from '../App/App';

import ContextMenu from '../ContextMenu/ContextMenu';
import Icon from '../Icon/Icon';
import Menu from '../Menu/Menu';
import MenuDropdown from '../MenuDropdown/MenuDropdown';
import MenuOption from '../MenuOption/MenuOption';
import File from '../File/File';
import Directory from '../Directory/Directory';

import './FileExplorer.css';
import MenuIcon from '../../assets/menu.svg';


export default function FileExplorer({ activeMid, setActiveFile }) {
    // FileExplorer's internal state
    const { db, changeDB } = useContext(DBContext);
    const [selectedFile, setSelectedFile] = useState(null); // file key
    const [pwd, setPwd] = useState("home"); // file key
    const [cutFile, setCutFile] = useState(null); // file key
    const [CMshow, setCMshow] = useState(false);
    const [CMpos, setCMpos] = useState({});


    // Internal updates to FileExplorer state
    const open = file_key => {
        if (db.files[file_key].file_type === 'd') {
            setPwd(file_key);
        } else {
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
    const openContextMenu = (ev, file_key) => {
        ev.preventDefault();

        let style = {};
        if (ev.clientX > window.screen.availWidth / 2) style['right'] = 0;
        if (ev.clientY > window.screen.availHeight / 2) style['bottom'] = 0;
        setCMpos({ x: ev.clientX, y: ev.clientY, style: style });

        setSelectedFile(file_key);
        setCMshow(true);
    }
    const cut = file_key => setCutFile(file_key);

    // Pass CRUD changes up to db
    const create_file = () => changeDB.add({ file_type: "f", parent: pwd });
    const create_dir = () => changeDB.add({ file_type: "d", parent: pwd });
    const star = file_key => changeDB.edit(file_key, { starred: true });
    const unstar = file_key => changeDB.edit(file_key, { starred: false });
    const rename = file_key => {
        let newTitle = window.prompt('Enter new name: ');
        changeDB.edit(file_key, { title: newTitle });
    }
    const remove = file_key => changeDB.remove(file_key);
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
        handleStar: (ev, file_key) => star(file_key),
        handleUnstar: (ev, file_key) => unstar(file_key),
    }
    const CMactions = {
        open: () => open(selectedFile),
        cut: () => cut(selectedFile),
        paste: () => move(cutFile, selectedFile),
        rename: () => rename(selectedFile),
        star: () => star(selectedFile),
        unstar: () => unstar(selectedFile),
        remove: () => remove(selectedFile),
    }

    // calculate the directory tree 
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


    return (
        <>
            {activeMid === "FileExplorer" &&
                <div className="FileExplorer">
                    <div className="FileExplorer-header">
                        <span>HOME</span>
                        <MenuDropdown
                            title={<Icon src={MenuIcon} />}
                            tooltip="Menu options for this directory"
                        >
                            <MenuOption name='New File' onClick={create_file} />
                            <MenuOption name='New Directory' onClick={create_dir} />
                        </MenuDropdown>
                    </div>
                    {getChildren("home")}
                </div>
            }
            <ContextMenu
                show={CMshow}
                setShow={setCMshow}
                pos={CMpos}
                callbacks={CMactions}
            />
        </>
    )

}