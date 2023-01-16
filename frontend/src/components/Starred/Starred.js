import React, { useContext } from 'react';
import File from '../File/File';
import { DBContext } from '../App/App';
import './Starred.css';

export default function Starred({ activeMid, setActiveFile }) {
    const { db } = useContext(DBContext);

    const starredFiles = Object.entries(db.files)
        .filter(([k, v]) => v.starred);

    const FileCallbacks = {
        handleClick: (ev, file_key) => setActiveFile(file_key),
    }

    return (
        <>
            {activeMid === "Starred" &&
                <div className="Starred">
                    <div className="Starred-header">Starred</div>
                    <div className="Starred-items">
                        {starredFiles.map(([k, v]) => (
                            <File
                                key={k}
                                file={v}
                                file_key={k}
                                callbacks={FileCallbacks}
                                columns={{ name: true, size: false, updated: false, starred: false }}
                                style={{ fontSize: '0.85em', border: 'none' }}
                            />
                        ))}
                    </div>
                </div>
            }
        </>
    )
}
