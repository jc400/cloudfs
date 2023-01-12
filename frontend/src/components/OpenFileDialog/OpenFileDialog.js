import React, { useState } from 'react';

import './OpenFileDialog.css';
import Button from '../Button/Button';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import History from '../History/History';
import FileList from '../FileList/FileList';
import Modal from '../Modal/Modal';
import Sidebar from '../Sidebar/Sidebar';
import NotSidebar from '../NotSidebar/NotSidebar';
import Starred from '../Starred/Starred';

export default function OpenFileDialog({show, setShow, openDocument}) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [pwd, setPwd] = useState(1);

    // callbacks 
    const close = () => setShow(false);

    const submit = file => {
        if (file && file.file_type === 'f'){
            openDocument(file.file_id);
            setShow(false);
        }
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
            if (file.file_type === 'd') {
                setPwd(file.file_id);
            } else {
                submit(file);
            }
        },
    }

    return (
        <Modal show={show} close={close}>
            <div id="OFD-controls">
                <Button onClick={close}>&nbsp;Cancel&nbsp;</Button>
                <span>Open a file</span>
                <Button 
                    onClick={() => submit(selectedFile)} 
                    deactivated={!(selectedFile?.file_type === 'f')}
                >&nbsp;Open&nbsp;</Button>
            </div>

            <div style={{display: 'flex', height: '80%'}}>
                <Sidebar show={true}>
                    <Starred callbacks={callbacks} />
                </Sidebar>
                
                <NotSidebar>
                    <div id="OFD-nav">
                        <History pwd={pwd} open={file_id => setPwd(file_id)} />
                        &nbsp;
                        <Breadcrumbs pwd={pwd} open={file => setPwd(file.file_id)} />
                        &nbsp;
                        <span>{selectedFile?.file_type === 'f' ? selectedFile.title : ''}</span>
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