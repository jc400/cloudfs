import React, { useState, useEffect, useContext } from 'react';
import { DBContext } from '../App/App';
import displayDate from '../../services/displayDate';

import Tag from '../Tag/Tag';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import IconButton from '../IconButton/IconButton';

import './Workspace.css';
import CloseIcon from '../../assets/x.svg';


export default function TextEditor({ UIState }) {
    const {db, changeDB} = useContext(DBContext);
    const [ document, setDocument ] = useState({});
    const [ tabs, setTabs ] = useState([]);

    
    useEffect( () => {
        // clone file from db
        const doc = structuredClone(db.files[UIState.activeFile]);
        setDocument(doc);

        // add new file to tabs
        if (UIState.activeFile){
            addTab(UIState.activeFile);
        }
    }, [UIState.activeFile]);


    // callbacks
    const handleContentChange = ev => {
        setDocument(st => { 
            return {...st, content: ev.target.value}
        });

        changeDB.edit(UIState.activeFile, {content: document.content});
    } 

    const addTab = file_key => {
        if (!tabs.includes(file_key)){
            setTabs(prev => [...prev, UIState.activeFile]);
        }
    }
    const removeTab = file_key => {
        // re-set activeFile
        if (file_key === UIState.activeFile) {
            const AFidx = tabs.indexOf(file_key);
            const newAF = tabs[AFidx - 1] || tabs[AFidx + 1] || null;
            UIState.setActiveFile(newAF);
        }
        // remove tab from list
        setTabs(prev => {
            const update = [...prev];
            update.splice(update.indexOf(file_key), 1);
            return update;
        })
    }
    const openTab = file_key => UIState.setActiveFile(file_key);

    const addTag = () => {
        const tag = prompt("Enter the new tag: ");
        const newTags = [...db.files[UIState.activeFile].tags, tag];
        changeDB.edit(UIState.activeFile, {tags: newTags});
    }
    const removeTag = tag => {
        const newTags = [...db.files[UIState.activeFile].tags];
        newTags.splice(newTags.indexOf(tag), 1);
        changeDB.edit(UIState.activeFile, {tags: newTags});
    }
    const TagSearch = tag => {
        UIState.setSearchString(tag);
        if (UIState.activeMid !== "Search"){
            UIState.setActiveMid("Search");
        }
    }


    return (
        <div className="WS">
            <div className="WS-tabs">
                {tabs.map(file_key => (
                    <span 
                        key={file_key} 
                        id={file_key === UIState.activeFile ? "WS-tab-active" : null}
                        onClick={() => openTab(file_key)}    
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
            </div>
            <div className="WS-fileinfo">
                <span className="WS-fileinfo-breadcrumbs">
                    <Breadcrumbs 
                        file_key={UIState.activeFile}
                    ></Breadcrumbs>
                </span>
                <span className="WS-fileinfo-tags">
                    {db.files[UIState.activeFile]?.tags.map(tag => (
                        <Tag 
                            key={tag} 
                            name={tag} 
                            onClick={() => TagSearch(tag)}
                            remove={()=>removeTag(tag)} 
                        />
                    ))}
                    <Tag onClick={addTag} name="+New" />
                </span>
            </div>

            <textarea
                id="WS-content"
                name="WS-content"
                cols="50"
                rows="30"
                value={document?.content || ''}
                onChange={handleContentChange}
            ></textarea>
        </div>
    )
}
