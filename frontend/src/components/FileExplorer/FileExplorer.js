import React, { useState, useReducer, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { get_home, create_file, create_dir, rename, move, star, unstar, delete_, } from '../../services/db';
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
    const navigate = useNavigate();

    const {db, setDB} = useContext(DBContext);

    const [selectedFile, setSelectedFile] = useState({});
    const [pwd, setPwd] = useState(0);
    const [cut, setCut] = useState(null);

    const [showFileCM, setShowFileCM] = useState(false); // for context menu
    const [showDirCM, setShowDirCM] = useState(false);
    const [pos, setPos] = useState({});

    const [update, setUpdate] = useReducer(st => !st, false); // updates file list

    // callbacks
    const change = (action, file) => {
        // could make target file implicit, just reference selectedFile
        let file_id = file?.file_id;

        switch (action) {
            case 'open':
                if (file?.file_type === 'd') {
                    setPwd(file_id);
                } else {
                    navigate('/text-editor/' + file_id);
                }
                break;

            case 'createDocument':
                setDB(create_file(db, pwd))
                break;

            case 'createDirectory':
                setDB(create_dir(db, pwd));
                break;

            case 'rename':
                let newTitle = window.prompt('Enter new name: ');
                setDB(rename(db, file_id, newTitle));
                break;

            case 'cut':
                setCut(file_id);
                break;

            case 'paste':
                if (cut) {
                    let file_to_move = cut;
                    let new_dir = file_id || pwd;
                    setDB(move(db, file_to_move, new_dir));
                }
                break;

            case 'delete':
                setDB(delete_(db, file_id));
                break;

            case 'star':
                setDB(star(db, file_id));
                break;

            case 'unstar':
                setDB(unstar(db, file_id));
                break;

            default:
                break;
        }

        setUpdate();

    }

    const callbacks = {
        handleClick: (ev, file) => {
            let file_id = file?.file_id;
            if (file_id !== "" && file !== selectedFile) {
                setSelectedFile(file);
            } else {
                setSelectedFile(null);
            }
        },
        handleDoubleClick: (ev, file) => {
            change('open', file);
        },
        handleCM: (ev, file) => {
            ev.preventDefault();
           
            let style = {};
            if (ev.clientX > window.screen.availWidth / 2) style['right'] = 0;
            if (ev.clientY > window.screen.availHeight / 2) style['bottom'] = 0;
            setPos({x: ev.clientX, y: ev.clientY, style: style});

            if (file) {
                setSelectedFile(file)
                setShowFileCM(true);
            } else {
                setShowDirCM(true);
            }

        },
        handleStar: (ev, file) => {
            ev.preventDefault();
            if (file?.starred) {
                change('unstar', file);
            } else {
                change('star', file);
            }
        },
        openDir: file_id => setPwd(file_id),
    }


    return (
        <div className="FileExplorer">
            <Toolbar style={{justifyContent: 'start'}}>
                <History pwd={pwd} open={file_id => callbacks.openDir(file_id)} />
                <Breadcrumbs pwd={pwd} open={file => change('open', file)} />
                <MenuDropdown 
                    title={<Icon src={MenuIcon} />}
                    tooltip="Menu options for this directory"
                >
                    <MenuOption name='New File' onClick={() => change('createDocument')} />
                    <MenuOption name='New Directory' onClick={() => change('createDirectory')} />
                </MenuDropdown>
            </Toolbar>

            <NotToolbar>
                <Sidebar show={true}>
                    <Starred update={update} callbacks={callbacks} />
                    <div style={{borderTop: 'var(--border2)', margin: '15px 0px'}}></div>
                    <Recent update={update} callbacks={callbacks} />
                </Sidebar>

                <NotSidebar>
                    <FileList selectedFile={selectedFile} pwd={pwd} update={update} callbacks={callbacks} />
                </NotSidebar>

            </NotToolbar>

            <ContextMenu 
                show={showFileCM} 
                setShow={setShowFileCM} 
                pos={pos} 
                selectedFile={selectedFile} 
                change={change} 
            />

            {showDirCM && (
                <div style={{ position: 'absolute', top: pos.y, left: pos.x }}>
                    <Menu style={pos.style}>
                        <MenuOption onClick={() => change('createDocument')} name='New Document' />
                        <MenuOption onClick={() => change('createDirectory')} name='New Directory' />
                        <MenuOption onClick={() => change('paste', selectedFile)} name='Paste Here' />
                    </Menu>
                </div>
            )}
        </div>
    )

}