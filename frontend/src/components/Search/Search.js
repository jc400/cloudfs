import React, { useState, useContext } from 'react';
import { DBContext } from '../App/App';

import File from '../File/File';
import Directory from '../Directory/Directory';

import './Search.css';

export default function Search({ activeMid, setActiveFile }) {
    const { db } = useContext(DBContext);
    const [ query, setQuery] = useState(null);

    const search = () => {
        return Object.entries(db.files).filter(([k, v]) => {
            return v.title?.includes(query) || v.content?.includes(query) || v.tags?.includes(query);
        })
    }
    const handleSearchChange = ev => setQuery(ev.target.value);

    const FileCallbacks = {
        handleClick: (ev, file_key) => setActiveFile(file_key),
    }

    return (
        <>
            {activeMid === "Search" &&
                <div className="Search">
                    <div className="Search-header">
                        Search
                        <input value={query || ''} onChange={handleSearchChange} />
                    </div>
                    <div className="Search-items">
                        {search().map(([k, v]) => (
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
