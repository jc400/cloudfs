import React, { useState, useEffect } from 'react';
import MenuOption from '../MenuOption/MenuOption';
import { get_path } from '../../services/crud';
import './Breadcrumbs.css';


export default function Breadcrumbs({ pwd, open }) {
    const [pathFiles, setPathFiles] = useState([]);

    useEffect( () => {
        if (pwd !== null){
            get_path(pwd)
            .then(resp => setPathFiles(resp?.reverse()))
            .catch(e => {});
        }
    }, [pwd])

    return (
        <div id="breadcrumbs-outer">
            <span id="breadcrumbs-inner">
                {pathFiles.map( file => {
                    return (
                        <span key={file?.file_id}>
                            &nbsp;
                            <MenuOption
                                onClick={() => open(file)}
                                name={file?.title}
                                style={{display: 'inline', padding: '0px'}}
                            />
                            &nbsp;/
                        </span>
                    )}
                )}
            </span>
        </div>
    )
}
