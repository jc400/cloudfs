import React, { useContext } from 'react';
import { DBContext } from '../App/App';
import './Breadcrumbs.css';


export default function Breadcrumbs({ file_key }) {
    const { db } = useContext(DBContext);

    let pathFiles = [];
    let cursor = file_key;
    while (cursor) {
        pathFiles.push(cursor);
        cursor = db.files[cursor]?.parent;
    }

    return (
        <span className="breadcrumbs">
            {pathFiles
                .reverse()
                .map(pathFile => (
                    <span key={pathFile}>
                        {db.files[pathFile]?.title}
                        {pathFile === file_key ? "" : " > " }
                    </span>
                ))
            }
        </span>
    )
}
