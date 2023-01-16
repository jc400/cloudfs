import React, { useState, useEffect, useRef, useContext } from 'react';
import { DBContext } from '../App/App';

import Button from '../Button/Button';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import File from '../File/File';

import './Workspace.css';


export default function TextEditor({activeFile, setActiveFile}) {
    const {db, changeDB} = useContext(DBContext);
    const [ document, setDocument ] = useState({});
    const [ tabs, setTabs ] = useState([]);

    
    useEffect( () => {
        // clone file from db
        const doc = structuredClone(db.files[activeFile]);
        setDocument(doc);

        // add new file to tabs
        if (activeFile && !tabs.includes(activeFile)){
            setTabs(prev => [...prev, activeFile]);
        }
    }, [activeFile]);


    // callbacks
    const handleContentChange = ev => setDocument(st => { 
        return {...st, content: ev.target.value}
    });

    const saveDocument = () => {
        changeDB.edit(activeFile, {
            content: document.content,
        });
    };

    const removeTab = file_key => {
        setTabs(prev => {
            return prev.splice(prev.indexOf(file_key));
        })
    }

    const TabCallbacks = {
        handleClick: (ev, file_key) => setActiveFile(file_key),
    };


    return (
        <div id="Workspace">
            <div id="Workspace-tabs">
                {tabs.map(file_key => (
                    <span key={file_key}>
                        <File 
                            file={db.files[file_key]}
                            file_key={file_key}
                            callbacks={TabCallbacks}
                            style={file_key === activeFile ? { backgroundColor: 'var(--gray2)' } : {}}
                        />
                    </span>
                ))}
                <Button 
                    onClick={saveDocument}
                    style={{float: "right"}}
                >Save</Button>
            </div>
            <Breadcrumbs 
                pwd={activeFile}
                open={() => {}}
            ></Breadcrumbs>
            <textarea
                id="content"
                name="content"
                rows="25"
                cols="50"
                value={document?.content || ''}
                onChange={handleContentChange}
            ></textarea>
        </div>
    )
}
