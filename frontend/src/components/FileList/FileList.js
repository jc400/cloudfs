import React, { useContext } from 'react';
import { DBContext } from '../App/App';
import { list } from '../../services/db';

import './FileList.css';
import File from '../File/File';


export default function FileList({selectedFile, pwd, update, callbacks}) {
    const { db } = useContext(DBContext);

    return (
        <div className="FileList">

            <div className="FileList-header">
                <span>Name</span>
                <span>Size</span>
                <span>Modifed</span>
                <span></span>
            </div>

            <div className="FileList-items">
                {list(pwd, db)
                    ?.sort((a, b) => (b?.file_type === 'd') - (a?.file_type === 'd'))
                    ?.map(file => (
                        <File 
                            key={file?.file_id} 
                            file={file} 
                            callbacks={callbacks} 
                            style={file === selectedFile ? {backgroundColor: 'var(--accent)'} : {}}
                        />
                    )) 
                }
            </div>
        </div>
    )
}