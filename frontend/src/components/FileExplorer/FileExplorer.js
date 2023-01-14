import React, { useState, useReducer, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DBContext } from '../App/App';

import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import ContextMenu from '../ContextMenu/ContextMenu';
import FileList from '../FileList/FileList';
import History from '../History/History';
import Icon from '../Icon/Icon';
import Menu from '../Menu/Menu';
import MenuDropdown from '../MenuDropdown/MenuDropdown';
import MenuOption from '../MenuOption/MenuOption';
import NotSidebar from '../NotSidebar/NotSidebar';
import NotToolbar from '../NotToolbar/NotToolbar';
import Recent from '../Recent/Recent';
import Sidebar from '../Sidebar/Sidebar';
import Starred from '../Starred/Starred';
import Toolbar from '../Toolbar/Toolbar';

import './FileExplorer.css';
import MenuIcon from '../../assets/menu.svg';


export default function FileExplorer() {
    // FileExplorer's internal state
    const navigate = useNavigate();
    const {db, changeDB} = useContext(DBContext);
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
            navigate('/text-editor/' + file_key);
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
        setCMpos({x: ev.clientX, y: ev.clientY, style: style});

        setSelectedFile(file_key);
        setCMshow(true);
    }
    const cut = file_key => setCutFile(file_key);

    // Pass CRUD changes up to db
    const create_file = () => changeDB.add({file_type:"f", parent: pwd});
    const create_dir = () => changeDB.add({file_type:"d", parent: pwd});
    const star = file_key => changeDB.edit({file_key: file_key, starred: true});
    const unstar = file_key => changeDB.edit({file_key: file_key, starred: false});
    const rename = file_key => {
        let newTitle = window.prompt('Enter new name: ');
        changeDB.edit({file_key: file_key, title: newTitle});
    }
    const remove = file_key => changeDB.remove(file_key);
    const move = (target, dest) => {
        if (db.files[dest].file_type === 'd'){
            changeDB.edit({file_key: target, parent: dest});
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


    return (
        <div className="FileExplorer">
            <Toolbar style={{justifyContent: 'start'}}>
                <History pwd={pwd} open={open} />
                <Breadcrumbs pwd={pwd} open={open} />
                <MenuDropdown 
                    title={<Icon src={MenuIcon} />}
                    tooltip="Menu options for this directory"
                >
                    <MenuOption name='New File' onClick={create_file} />
                    <MenuOption name='New Directory' onClick={create_dir} />
                </MenuDropdown>
            </Toolbar>

            <NotToolbar>
                <Sidebar show={true}>
                    <Starred callbacks={FileCallbacks} />
                    <div style={{borderTop: 'var(--border2)', margin: '15px 0px'}}></div>
                    <Recent callbacks={FileCallbacks} />
                </Sidebar>

                <NotSidebar>
                    <FileList selectedFile={selectedFile} pwd={pwd} callbacks={FileCallbacks} />
                </NotSidebar>

            </NotToolbar>

            <ContextMenu 
                show={CMshow} 
                setShow={setCMshow} 
                pos={CMpos} 
                callbacks={CMactions}
            />

        </div>
    )

}