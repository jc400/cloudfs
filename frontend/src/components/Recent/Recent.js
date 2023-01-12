import React, { useState, useEffect } from 'react';
import File from '../File/File';
import { get_recent } from '../../services/crud';
import './Recent.css';

export default function Recent({update, callbacks}) {
    const [recentFiles, setRecentFiles] = useState([]);

    useEffect( () => {
        get_recent()
        .then(resp => setRecentFiles(resp))
        .catch( e => {} );
    }, [update])

    return (
        <>
            <div id="recent-title">Recent Files</div>
            {recentFiles.map( file => {
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
