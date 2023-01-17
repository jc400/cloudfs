import React, { useState, useEffect, useRef, useContext } from 'react';
import { DBContext } from '../App/App';

import Button from '../Button/Button';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import IconButton from '../IconButton/IconButton';

import './Workspace.css';
import CloseIcon from '../../assets/x.svg';


export default function TextEditor({activeFile, setActiveFile}) {
    const {db, changeDB} = useContext(DBContext);
    const [ document, setDocument ] = useState({});
    const [ tabs, setTabs ] = useState([]);

    
    useEffect( () => {
        // clone file from db
        const doc = structuredClone(db.files[activeFile]);
        setDocument(doc);

        // add new file to tabs
        if (activeFile){
            addTab(activeFile);
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

    const addTab = file_key => {
        if (!tabs.includes(file_key)){
            setTabs(prev => [...prev, activeFile]);
        }
    }
    const removeTab = file_key => {
        // re-set activeFile
        if (file_key === activeFile) {
            const AFidx = tabs.indexOf(file_key);
            const newAF = tabs[AFidx - 1] || tabs[AFidx + 1] || null;
            setActiveFile(newAF);
        }
        // remove tab from list
        setTabs(prev => {
            const update = [...prev];
            update.splice(update.indexOf(file_key), 1);
            return update;
        })
    }

    const TabCallbacks = {
        handleClick: (ev, file_key) => setActiveFile(file_key),
    };


    return (
        <div className="Workspace">
            <div className="Workspace-tabs">
                {tabs.map(file_key => (
                    <span 
                        key={file_key} 
                        id={file_key === activeFile ? "Workspace-tab-active" : null}
                        onClick={() => setActiveFile(file_key)}    
                    >
                        {db.files[file_key].title}
                        &nbsp;
                        <IconButton 
                            src={CloseIcon}
                            size={"15px"}
                            onClick={ev => {ev.stopPropagation(); removeTab(file_key)}}
                        />
                    </span>
                ))}
                <Button 
                    onClick={saveDocument}
                    style={{float: "right"}}
                >Save</Button>
            </div>
            <div className="Workspace-file-info">
                <Breadcrumbs 
                    file_key={activeFile}
                ></Breadcrumbs>
            </div>

            <textarea
                id="content"
                name="content"
                cols="50"
                rows="30"
                value={document?.content || ''}
                onChange={handleContentChange}
            ></textarea>
        </div>
    )
}
