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

    // Pass CRUD changes up to db
    const create_file = () => changeDB.add({file_type:"f", parent: pwd});
    const create_dir = () => changeDB.add({file_type:"d", parent: pwd});
    const star = file_key => changeDB.edit({file_key: file_key, starred: true});
    const unstar = file_key => changeDB.edit({file_key: file_key, starred: false});

    // callbacks to pass down to children
    const FileCallbacks = {
        handleClick: (ev, file_key) => select(file_key),
        handleDoubleClick: (ev, file_key) => open(file_key),
        handleStar: (ev, file_key) => star(file_key),
        handleUnstar: (ev, file_key) => unstar(file_key),
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

        </div>
    )

}