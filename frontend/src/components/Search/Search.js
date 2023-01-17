import React, { useState, useContext } from 'react';
import { DBContext } from '../App/App';

import File from '../File/File';
import Directory from '../Directory/Directory';
import ScrollArea from '../ScrollArea/ScrollArea';

import './Search.css';


export default function Search({ activeMid, setActiveFile }) {
    const { db } = useContext(DBContext);
    const [ query, setQuery] = useState(null);
    const handleQueryChange = ev => setQuery(ev.target.value);

    const FileCallbacks = {
        handleClick: (ev, file_key) => setActiveFile(file_key),
    }


    // get search results
    const results = Object.entries(db.files)
        .filter(([k, v]) =>  v.title?.includes(query) || v.content?.includes(query) || v.tags?.includes(query))
        .map(([k, v]) => (
            <File
                key={k}
                file={v}
                file_key={k}
                callbacks={FileCallbacks}
            />
        ));
    

    return (
        <>
            {activeMid === "Search" &&
                <div className="Search">
                    <div className="Search-header">
                        <span>SEARCH</span>
                        <input value={query || ''} onChange={handleQueryChange} />
                    </div>

                    <ScrollArea bgColor="var(--gray3)">
                        {results}
                    </ScrollArea>

                </div>
            }
        </>
    )
}
