import React, { useState, useEffect, useRef, useContext } from 'react';
import { DBContext } from '../App/App';

import Button from '../Button/Button';
import MenuDropdown from '../MenuDropdown/MenuDropdown';
import MenuOption from '../MenuOption/MenuOption';
import Toolbar from '../Toolbar/Toolbar';
import NotToolbar from '../NotToolbar/NotToolbar';

import './Workspace.css';


export default function TextEditor({activeFile}) {
    const {db, changeDB} = useContext(DBContext);
    const file_key = activeFile
    const [ document, setDocument ] = useState({});
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


    return (
        <div id="Workspace">
            <Button 
                onClick={saveDocument}
            >Save</Button>
            <span ref={messageRef} />
            <textarea
                id="content"
                name="content"
                rows="25"
                cols="50"
                style={{fontSize: fontSize }}
                value={document?.content || ''}
                onChange={handleContentChange}
            ></textarea>
        </div>
    )
}
