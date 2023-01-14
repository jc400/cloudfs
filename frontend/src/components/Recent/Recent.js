import React, { useContext } from 'react';
import { DBContext } from '../App/App';
import File from '../File/File';
import './Recent.css';

export default function Recent({ callbacks}) {
    const { db } = useContext(DBContext);

    const recentFiles = Object.entries(db.files)
    .filter(([k, v]) => true);

    return (
        <>
            <div id="recent-title">Recent Files</div>
            {recentFiles.map(([k, v]) => (
                    <File 
                        key={k}
                        file={v} 
                        file_key={k}
                        callbacks={callbacks}
                        columns={{name: true, size: false, updated: false, starred: false}}
                        style={{fontSize: '0.85em', border: 'none'}}
                    />
            ))}
        </>
    )
}
