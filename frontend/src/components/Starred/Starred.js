import React, { useState, useEffect } from 'react';
import File from '../File/File';
import { get_starred } from '../../services/crud';
import './Starred.css';

export default function Starred({update, callbacks}) {
    const [starredFiles, setStarredFiles] = useState([]);

    useEffect( () => {
        get_starred()
        .then(resp => setStarredFiles(resp))
        .catch(e => {} );
    }, [update])

    return (
        <>
            <div id="starred-title">Starred</div>
            {starredFiles.map( file => {
                return (
                    <File 
                        key={file.file_id}
                        file={file} 
                        callbacks={callbacks}
                        columns={{name: true, size: false, updated: false, starred: false}}
                        style={{fontSize: '0.85em', border: 'none'}}
                    />
                )
            })}
        </>
    )
}
