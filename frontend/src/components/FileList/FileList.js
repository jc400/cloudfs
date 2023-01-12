import React, { useState, useEffect } from 'react';

import './FileList.css';
import File from '../File/File';
import { list } from '../../services/crud';


export default function FileList({selectedFile, pwd, update, callbacks}) {
    const [files, setFiles] = useState([]);

    // read all the docs from server, save to files state
    const refresh = () => {
        list(pwd)
        .then( resp => setFiles(resp) )
        .catch( e => {} );
    }
    useEffect( () => {
        if (pwd !== null){
            refresh();
        }
    }, [pwd, update]);

    return (
        <div className="FileList">

            <div className="FileList-header">
                <span>Name</span>
                <span>Size</span>
                <span>Modifed</span>
                <span></span>
            </div>

            <div className="FileList-items">
                {files
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