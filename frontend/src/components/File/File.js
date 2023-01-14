import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { DBContext } from '../App/App';

import './File.css';
import Button from '../Button/Button';
import fileIcon from '../../assets/file.svg';
import dirIcon from '../../assets/folder.svg';
import emptyStar from '../../assets/empty_star.png';
import fullStar from '../../assets/full_star_gold.png';

import displaySize from '../../services/displaySize';


export default function File({ file, file_key, callbacks, columns, style }) {
    const {db, changeDB} = useContext(DBContext);

    // calculate data to display
    const img = file?.file_type === 'f' ? fileIcon : dirIcon;
    const size = file?.file_type === 'f' 
        ? displaySize(new Blob([file.content]).size) 
        : `${Object.values(db.files).filter(v => v.parent === file_key).length} items`;
    
    const updated = file?.updated ? new Date(file.updated).toDateString() : "";

    // validate callbacks
    const handleClick = callbacks?.handleClick || function(){};
    const handleDoubleClick = callbacks?.handleDoubleClick || function(){};
    const handleCM = callbacks?.handleCM || function(){};

    // switch if starred
    let star;
    let handleStarButton;
    if (file?.starred) {
        star = fullStar;
        handleStarButton = callbacks.handleUnstar || function(){};
    } else {
        star = emptyStar;
        handleStarButton = callbacks.handleStar || function(){};
    }
    

    return (
        <div 
            className="File"
            onClick={ev => handleClick(ev, file_key)}
            onDoubleClick={ev => handleDoubleClick(ev, file_key)}
            onContextMenu={ev => handleCM(ev, file_key)}
            style={style}
        >
            {columns.name && 
                <span>
                    <img src={img} width="20px" height="20px" style={{marginRight: "10px"}} />
                    <span>{file?.title}</span>
                </span>
            }

            {columns.size && <span>{size}</span> }
            
            {columns.updated && <span>{updated}</span> }

            {columns.starred &&
                <Button 
                    onClick={ev=>handleStarButton(ev, file_key)}
                    tooltip="Star a file to make it accessible from the sidebar"
                >
                    <img src={star} width="20px" height="20px"></img>
                </Button>
            }
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