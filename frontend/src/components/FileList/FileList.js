import React, { useContext } from 'react';
import { DBContext } from '../App/App';

import './FileList.css';
import File from '../File/File';


export default function FileList({selectedFile, pwd, callbacks}) {
    const { db } = useContext(DBContext);

    // need to convert object w key:val files into list with key:val
    const list = Object.entries(db.files)
    .filter(([k, v]) => v.parent === pwd);

    return (
        <div className="FileList">
            <div className="FileList-header">
                <span>Name</span>
                <span>Size</span>
                <span>Modifed</span>
                <span></span>
            </div>
            <div className="FileList-items">
                {list
                    ?.sort((a, b) => (b[1]?.file_type === 'd') - (a[1]?.file_type === 'd'))
                    ?.map(([k, v]) => (
                        <File 
                            key={k} 
                            file_key={k}
                            file={v} 
                            callbacks={callbacks} 
                            style={k === selectedFile ? {backgroundColor: 'var(--accent)'} : {}}
                        />
                    )) 
                }
            </div>
        </div>
    )
}