import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import IconButton from '../IconButton/IconButton';

import './File.css';
import FileIcon from '../../assets/file.svg';


export default function File({ file, file_key, callbacks, style, to_rename }) {
    const [newName, setNewName] = useState(file?.title);
    const inputRef = useRef();

    const handleSubmit = ev => {
        // renames file (if not blank) and closes rename form
        ev.preventDefault();
        if (newName !== '') {
            callbacks.rename(file_key, newName);
        }
        callbacks.close_rename();
    }

    useEffect(() => {
        // focus() input when form is shown
        if (to_rename){
            inputRef.current.focus();
        }
    }, [to_rename]);


    return (
        <>
            {to_rename
                ? 
                <div className="File">
                    <span>
                        <form id="rename" name="rename" onSubmit={handleSubmit}>
                            <input 
                                ref={inputRef}
                                type="text" 
                                id="filename"
                                name="filename"
                                aria-label="New file name"
                                size="10"
                                value={newName}
                                onChange={ev => setNewName(ev.target.value)}
                                onBlur={() => {setNewName(''); callbacks.close_rename()}}
                            />
                        </form>
                    </span>
                </div> 
                : 
                <div
                    className="File"
                    onClick={() => callbacks.select(file_key)}
                    onDoubleClick={() => callbacks.open(file_key)}
                    onContextMenu={ev => callbacks.openContextMenu(ev, file_key)}
                    style={style}
                >
                    <IconButton src={FileIcon} size="14px" />
                    &nbsp;
                    <span>{file?.title}</span>
                </div>
            }

        </>

    )
}

File.propTypes = {
    file: PropTypes.object,
    columns: PropTypes.object,
}
File.defaultProps = {
    columns: { name: true, size: true, updated: true, starred: true },
}