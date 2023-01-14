import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DBContext } from '../App/App';

import Button from '../Button/Button';
import MenuDropdown from '../MenuDropdown/MenuDropdown';
import MenuOption from '../MenuOption/MenuOption';
import Toolbar from '../Toolbar/Toolbar';
import NotToolbar from '../NotToolbar/NotToolbar';
import OpenFileDialog from '../OpenFileDialog/OpenFileDialog';
import SaveFileDialog from '../SaveFileDialog/SaveFileDialog';

import './TextEditor.css';


export default function TextEditor() {
    const navigate = useNavigate();
    const {db, changeDB} = useContext(DBContext);
    const { file_key } = useParams();
    const [ document, setDocument ] = useState({});
    const [showOFD, setShowOFD] = useState(false);
    const [showSFD, setShowSFD] = useState(false);
    const messageRef = useRef();
    const [fontSize, setFontSize] = useState(16);

    // clone file from db
    useEffect( () => {
        const doc = structuredClone(db.files[file_key]);
        setDocument(doc);
    }, [file_key]);


    // callbacks
    const handleTitleChange = ev => setDocument(st => { 
        return {...st, title: ev.target.value} 
    });
    const handleContentChange = ev => setDocument(st => { 
        return {...st, content: ev.target.value}
    });

    const saveDocument = () => {
        messageRef.current.innerText = "Saving...";
        changeDB.edit(file_key, {
            title: document.title,
            content: document.content,
        });
        messageRef.current.innerText = 'Saved!';
        window.setTimeout(() => {messageRef.current.innerText = ''}, 2 * 1000);
    };

    const saveDocumentAs = (newParent, newTitle) => {
        let new_file_key = changeDB.add({
            parent: newParent,
            title: newTitle,
            content: document.content
        })
        openDocument(new_file_key)
    }

    const openDocument = file_key => {
        setDocument({});
        navigate(`/text-editor/${file_key}`);
    }

    const createDocument = () => {
        let new_file_key = changeDB.add();
        openDocument(new_file_key);
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
