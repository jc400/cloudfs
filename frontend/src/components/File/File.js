import React from 'react';
import PropTypes from 'prop-types';

import './File.css';
import Button from '../Button/Button';
import fileIcon from '../../assets/file.svg';
import dirIcon from '../../assets/folder.svg';
import emptyStar from '../../assets/empty_star.png';
import fullStar from '../../assets/full_star_gold.png';

import displaySize from '../../services/displaySize';


export default function File({ file, file_key, callbacks, columns, style }) {

    const img = file?.file_type === 'f' ? fileIcon : dirIcon;
    const star = file?.starred ? fullStar : emptyStar;
    const size = file?.size ? displaySize(file.size) : '';
    const updated = file?.updated ? file.updated.toDateString() : '';

    const handleClick = callbacks?.handleClick || function(){};
    const handleDoubleClick = callbacks?.handleDoubleClick || function(){};
    const handleCM = callbacks?.handleCM || function(){};
    const handleStar = callbacks?.handleStar || function(){};

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
                    onClick={ev=>handleStar(ev, file_key)}
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