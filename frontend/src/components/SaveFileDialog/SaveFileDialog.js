import React, { useState, useContext } from 'react';
import { DBContext } from '../App/App';

import './SaveFileDialog.css';
import Button from '../Button/Button';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import History from '../History/History';
import FileList from '../FileList/FileList';
import Modal from '../Modal/Modal';
import Sidebar from '../Sidebar/Sidebar';
import NotSidebar from '../NotSidebar/NotSidebar';
import Starred from '../Starred/Starred';

export default function SaveFileDialog({ show, setShow, saveDocumentAs }) {
    const {db} = useContext(DBContext);
    const [newTitle, setNewTitle] = useState('');
    const [pwd, setPwd] = useState("home");

    // callbacks 
    const close = () => setShow(false);
    const submit = () => {
        if (newTitle !== '') {
            saveDocumentAs(pwd, newTitle);
            setShow(false);
        }
    }
    const open = file_key => {
        if (db.files[file_key].file_type === 'd') {
            setPwd(file_key);
        }
    }
    const handleTitleChange = ev => {
        setNewTitle(ev.target.value);
    }

    const callbacks = {
        handleDoubleClick: (ev, file_key) => open(file_key),
    }

    return (
        <Modal show={show} close={close}>
            <div id="SFD-controls">
                <Button onClick={close}>&nbsp;Cancel&nbsp;</Button>
                <label>
                    <span>Name:</span>
                    &nbsp;
                    <input 
                        id="newTitle"
                        name="newTitle"
                        type="text"
                        value={newTitle || ''}
                        onChange={handleTitleChange}
                    ></input>
                </label>
                <Button onClick={() => submit()} deactivated={newTitle === ''}>&nbsp;Save&nbsp;</Button>
            </div>

            
            <div style={{display: 'flex', height: '80%'}}>
                <Sidebar show={true}>
                    <Starred callbacks={callbacks} />
                </Sidebar>

                <NotSidebar>
                    <div id="SFD-nav">
                        <History pwd={pwd} open={open} />
                        &nbsp;
                        <Breadcrumbs pwd={pwd} open={open} />
                    </div>

                     <FileList 
                        pwd={pwd}
                        callbacks={callbacks}
                    />
                </NotSidebar>            
            </div>

        </Modal>
    )
}