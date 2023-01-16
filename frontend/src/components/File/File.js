import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { DBContext } from '../App/App';

import './File.css';
import Button from '../Button/Button';
import fileIcon from '../../assets/file.svg';
import dirIcon from '../../assets/folder.svg';

import displaySize from '../../services/displaySize';


export default function File({ file, file_key, callbacks, columns, style }) {
    const {db, changeDB} = useContext(DBContext);

    // calculate data to display
    const img = file?.file_type === 'f' ? fileIcon : dirIcon;

    // validate callbacks
    const handleClick = callbacks?.handleClick || function(){};
    const handleDoubleClick = callbacks?.handleDoubleClick || function(){};
    const handleCM = callbacks?.handleCM || function(){};
    

    return (
        <div 
            className="File"
            onClick={ev => handleClick(ev, file_key)}
            onDoubleClick={ev => handleDoubleClick(ev, file_key)}
            onContextMenu={ev => handleCM(ev, file_key)}
            style={style}
        >
                <span>
                    <img src={img} width="20px" height="20px" style={{marginRight: "10px"}} />
                    <span>{file?.title}</span>
                </span>
        </div>
    )
}

File.propTypes = {
    file: PropTypes.object,
    columns: PropTypes.object,
}
File.defaultProps = {
    columns: {name: true, size: true, updated: true, starred: true},
}