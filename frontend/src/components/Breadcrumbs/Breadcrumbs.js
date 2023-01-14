import React, { useContext } from 'react';
import { DBContext } from '../App/App';
import MenuOption from '../MenuOption/MenuOption';
import './Breadcrumbs.css';


export default function Breadcrumbs({ pwd, open }) {
    const { db } = useContext(DBContext);

    let pathFiles = [pwd,];
    let cursor = pwd
    while (cursor !== "home") {
        cursor = db.files[cursor].parent;
        pathFiles.push(cursor);
    }

    return (
        <div id="breadcrumbs-outer">
            <span id="breadcrumbs-inner">
                {pathFiles
                    .reverse()
                    .map(file_key => (
                        <span key={file_key}>
                            &nbsp;
                            <MenuOption
                                onClick={() => open(file_key)}
                                name={db.files[file_key].title}
                                style={{ display: 'inline', padding: '0px' }}
                            />
                            &nbsp;/
                        </span>
                    ))
                }
            </span>
        </div>
    )
}
