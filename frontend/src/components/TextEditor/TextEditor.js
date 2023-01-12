import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { read, create_file, rename, modify } from '../../services/crud';

import Button from '../Button/Button';
import MenuDropdown from '../MenuDropdown/MenuDropdown';
import MenuOption from '../MenuOption/MenuOption';
import Toolbar from '../Toolbar/Toolbar';
import NotToolbar from '../NotToolbar/NotToolbar';
import OpenFileDialog from '../OpenFileDialog/OpenFileDialog';
import SaveFileDialog from '../SaveFileDialog/SaveFileDialog';

import './TextEditor.css';


export default function TextEditor() {
    const { file_id } = useParams();
    const [ document, setDocument ] = useState({});
    const navigate = useNavigate();
    const [showOFD, setShowOFD] = useState(false);
    const [showSFD, setShowSFD] = useState(false);
    const messageRef = useRef();

    const [fontSize, setFontSize] = useState(16);

    // fetch document content from API
    useEffect( () => {
        if (file_id) {
            read(file_id)
            .then(resp => setDocument(resp));
        }
    }, [file_id]);


    // callbacks
    const handleTitleChange = ev => setDocument(st => { 
        return {...st, title: ev.target.value} 
    });
    const handleContentChange = ev => setDocument(st => { 
        return {...st, content: ev.target.value}
    });

    const saveDocument = () => {
        messageRef.current.innerText = "Saving...";
        rename(file_id, document.title);
        modify(file_id, document.content)
        .then( () => {
            messageRef.current.innerText = 'Saved!';
            window.setTimeout(() => {messageRef.current.innerText = ''}, 2 * 1000);
        });
    };

    const saveDocumentAs = (newParent, newTitle) => {
        create_file(newParent, newTitle, document?.content)
        .then( resp => openDocument(resp.file_id) )
    }

    const openDocument = file_id => {
        setDocument({});
        navigate(`/text-editor/${file_id}`);
    }

    const createDocument = () => {
        create_file(1)                  // PLACEHOLDER, HARDCODING ROOT. FIX LATER.
        .then(resp => openDocument(resp.file_id) )
    }


    return (
        <>
            <Toolbar>
                <div style={{flex: '0 0 25%'}}>
                    <MenuDropdown title="&nbsp;File&nbsp;">
                        <MenuOption onClick={createDocument                  } name='New' />
                        <MenuOption onClick={()=>setShowOFD(true)            } name='Open' />
                        <MenuOption onClick={()=>setShowSFD(true)            } name='Save as' />
                        <MenuOption onClick={()=>setFontSize(p=>p-2)         } name='Decrease font size' />
                        <MenuOption onClick={()=>setFontSize(p=>p+2)         } name='Increase font size' />
                        <MenuOption onClick={() => navigate('/file-explorer')} name='Back to files' />
                    </MenuDropdown>
                </div>

                <input 
                    style={{flex: '0 1 25%', maxWidth: '50%',}}
                    id="title"
                    name="title"
                    type="text"
                    value={document?.title || ''}
                    onChange={handleTitleChange}
                ></input>

                <div style={{flex: '0 0 25%', textAlign: 'right'}}>
                    <span ref={messageRef}></span>
                    &nbsp;
                    <Button onClick={saveDocument} tooltip="Save current document">&nbsp;Save&nbsp;</Button>
                </div>

            </Toolbar>

            <NotToolbar>
                <textarea
                    id="content"
                    name="content"
                    rows="25"
                    cols="50"
                    style={{fontSize: fontSize }}
                    value={document?.content || ''}
                    onChange={handleContentChange}
                ></textarea>
            </NotToolbar>

            <OpenFileDialog show={showOFD} setShow={setShowOFD} openDocument={openDocument} />
            <SaveFileDialog show={showSFD} setShow={setShowSFD} saveDocumentAs={saveDocumentAs} />
        </>
    )
}
