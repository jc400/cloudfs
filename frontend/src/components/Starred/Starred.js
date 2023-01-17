import React, { useContext } from 'react';
import { DBContext } from '../App/App';

import ScrollArea from '../ScrollArea/ScrollArea'
import File from '../File/File';

import './Starred.css';

export default function Starred({ activeMid, setActiveFile }) {
    const { db } = useContext(DBContext);
    const FileCallbacks = {
        handleClick: (ev, file_key) => setActiveFile(file_key),
    }


    const starredFiles = Object.entries(db.files)
        .filter(([k, v]) => v.starred)
        .map(([k, v]) => (
            <File
                key={k}
                file={v}
                file_key={k}
                callbacks={FileCallbacks}
            />
        ))

    return (
        <>
            {activeMid === "Starred" &&
                <div className="Starred">
                    <div className="Starred-header">STARRED</div>
                    <ScrollArea bgColor="var(--gray3)">
                        {starredFiles}
                    </ScrollArea>
                </div>
            }
        </>
    )
}
