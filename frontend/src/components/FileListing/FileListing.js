import React, { useContext } from 'react';
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

    return (
        <ScrollArea bgColor="var(--bg3)">
            <ul role="tree" id="file-listing">
                {file_keys.map(k => renderFile(k))}
            </ul>
        </ScrollArea>
    )
}