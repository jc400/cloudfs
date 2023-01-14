import React, { useState, useContext } from 'react';
import { DBContext } from '../App/App';

import Button from '../Button/Button';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import History from '../History/History';
import FileList from '../FileList/FileList';
import Modal from '../Modal/Modal';
import Sidebar from '../Sidebar/Sidebar';
import NotSidebar from '../NotSidebar/NotSidebar';
import Starred from '../Starred/Starred';

import './OpenFileDialog.css';


export default function OpenFileDialog({show, setShow, openDocument}) {
    const {db} = useContext(DBContext);
    const [selectedFile, setSelectedFile] = useState(null);
    const [pwd, setPwd] = useState("home");

    // callbacks 
    const close = () => setShow(false);
    const submit = file_key => {
        if (file_key){
            openDocument(file_key);
            setShow(false);
        }
    }
    const open = file_key => {
        if (db.files[file_key].file_type === 'd') {
            setPwd(file_key);
        } else {
            submit(file_key);
        }
    }
    const select = file_key => {
        if (file_key !== "" && file_key !== selectedFile) {
            setSelectedFile(file_key);
        } else {
            setSelectedFile(null);
        }
    }

    const callbacks = {
        handleClick: (ev, file_key) => select(file_key),
        handleDoubleClick: (ev, file_key) => open(file_key),
    }

    return (
        <Modal show={show} close={close}>
            <div id="OFD-controls">
                <Button onClick={close}>&nbsp;Cancel&nbsp;</Button>
                <span>Open a file</span>
                <Button 
                    onClick={() => submit(selectedFile)} 
                    deactivated={!(db.files[selectedFile]?.file_type === 'f')}
                >&nbsp;Open&nbsp;</Button>
            </div>

            <div style={{display: 'flex', height: '80%'}}>
                <Sidebar show={true}>
                    <Starred callbacks={callbacks} />
                </Sidebar>
                
                <NotSidebar>
                    <div id="OFD-nav">
                        <History pwd={pwd} open={open} />
                        &nbsp;
                        <Breadcrumbs pwd={pwd} open={open} />
                        &nbsp;
                        <span>{db.files[selectedFile]?.file_type === 'f' ? db.files[selectedFile].title : ''}</span>
                    </div>
                    <FileList 
                        selectedFile={selectedFile}
                        pwd={pwd}
                        callbacks={callbacks}
                    />
                </NotSidebar>
            </div>

        </Modal>
    )
}