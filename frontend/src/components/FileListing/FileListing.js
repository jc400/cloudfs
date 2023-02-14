import React, { useContext, useState, useEffect } from 'react';
import { DBContext } from '../App/App';

import File from '../File/File';
import Directory from '../Directory/Directory';
import ScrollArea from '../ScrollArea/ScrollArea';

import './FileListing.css'


export default function FileListing({ file_keys, FileCallbacks, selectedFile, renameFile }) {
    const { db } = useContext(DBContext);

    // conditionally display <File> or <Directory> component
    const renderFile = file_key => {
        if (db.files[file_key].file_type === 'f') {
            return (
                <File
                    key={file_key}
                    file_key={file_key}
                    file={db.files[file_key]}
                    callbacks={FileCallbacks}
                    selected={file_key === selectedFile}
                    to_rename={file_key === renameFile}
                />
            )
        } else {
            return (
                <Directory
                    key={file_key}
                    file_key={file_key}
                    file={db.files[file_key]}
                    callbacks={FileCallbacks}
                    selected={file_key === selectedFile}
                    to_rename={file_key === renameFile}
                >
                    {getChildren(file_key)}
                </Directory>
            )
        }
    }

    // render children of given file
    const getChildren = file_key => {
        return Object.entries(db.files)
            .filter(([k, v]) => v.parent === file_key)
            .sort((a, b) => (b[1]?.file_type === 'd') - (a[1]?.file_type === 'd'))
            .map(([k, v]) => renderFile(k));
    }

    // arrow event listener
    useEffect(() => {
        const left = 37;
        const up = 38;
        const right = 39;
        const down = 40;
        
        const arrowListener = ev => {
            let currentIndex = file_keys.indexOf(selectedFile);
            switch (ev.keyCode) {
                case up:
                    if (currentIndex > 0){
                        FileCallbacks.select(file_keys[currentIndex-1]);
                    }
                    break;
                case down:
                    if (currentIndex < file_keys.length - 1){
                        FileCallbacks.select(file_keys[currentIndex+1]);
                    }
                    break;
            }
        }
        window.addEventListener('keydown', arrowListener);

        return () => window.removeEventListener('keydown', arrowListener);
    }, [selectedFile]);


    return (
        <ScrollArea bgColor="var(--bg3)">
            <ul 
                role="tree" 
                id="file-listing"
                tabIndex="0"
                onFocus={() => FileCallbacks.select(file_keys[0])}
                onBlur={() => FileCallbacks.select("")}
            >
                {file_keys.map(k => renderFile(k))}
            </ul>
        </ScrollArea>
    )
}