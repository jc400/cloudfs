import React, { useState, useEffect, useContext } from 'react';
import { DBContext } from '../App/App';

import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import ReactMarkdown from 'react-markdown';

import Tag from '../Tag/Tag';
import TagForm from '../Tag/TagForm';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import IconButton from '../IconButton/IconButton';
import ScrollArea from '../ScrollArea/ScrollArea';

import './Editor.css';
import CloseIcon from '../../assets/x.svg';
import MDIcon from '../../assets/markdown-icon.png';


export default function Editor({ UIState }) {
    const {db, changeDB} = useContext(DBContext);
    const [ document, setDocument ] = useState({});
    const [ tabs, setTabs ] = useState([]);
    const [ showMD, setShowMD ] = useState(false);
    const [ showTagFm, setShowTagFm ] = useState(false);

    // add data from new activeFile
    useEffect( () => {
        // clone file from db
        const doc = structuredClone(db.files[UIState.activeFile]);
        setDocument(doc);

        // add new file to tabs
        if (UIState.activeFile){
            addTab(UIState.activeFile);
        }
    }, [UIState.activeFile]);

    // clear tabs if DB disappears (eg from logout)
    useEffect( () => {
        tabs.forEach(tab => {
            if (!Object.keys(db.files).includes(tab)){
                setTabs([]);
            }
        });
    }, [db.files]);


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

    const addTag = tag => {
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
            <Tab.Container
                id="WS-tab-container"
                activeKey={UIState.activeFile}
                onSelect={k => openTab(k)}
            >

                <Nav className="WS-tabs">
                    {tabs.map(file_key => (
                        <Nav.Link
                            key={file_key}
                            eventKey={file_key}
                            title={db.files[file_key]?.title}
                            className="WS-tab-item text-reset"
                        >
                            {db.files[file_key]?.title}
                            &nbsp;
                            <IconButton 
                                src={CloseIcon}
                                size={"15px"}
                                onClick={ev => {ev.stopPropagation(); removeTab(file_key)}}
                            />
                        </Nav.Link>
                    ))}
                </Nav>

                <Tab.Content className="overflow-hidden">
                    {tabs.map(file_key => (
                        <Tab.Pane eventKey={file_key} key={file_key}>
                            <div className="WS-fileinfo">
                                <span className="WS-fileinfo-breadcrumbs">
                                    <Breadcrumbs 
                                        file_key={file_key}
                                    ></Breadcrumbs>
                                </span>
                                <span className="WS-fileinfo-tags">
                                    {db.files[file_key]?.tags.map(tag => (
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
                            
                            <ScrollArea bgColor="var(--bg2)">
                                <textarea
                                    className="WS-content"
                                    name="WS-content"
                                    cols="50"
                                    rows={document?.content.split('').filter(c => c === '\n').length + 10}
                                    value={document?.content || ''}
                                    onChange={handleContentChange}
                                ></textarea>
                            </ScrollArea>
                        </Tab.Pane>
                    ))}
                </Tab.Content>

            </Tab.Container>
        </div>
    )
}
