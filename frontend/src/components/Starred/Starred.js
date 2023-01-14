import React, { useContext } from 'react';
import File from '../File/File';
import { DBContext } from '../App/App';
import './Starred.css';

export default function Starred({callbacks}) {
    const { db } = useContext(DBContext);

    const starredFiles = Object.entries(db.files)
    .filter(([k, v]) => v.starred);

    return (
        <>
            <div id="starred-title">Starred</div>
            {starredFiles.map(([k, v]) => (
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
