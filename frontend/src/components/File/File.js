import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import Icon from '../Icon/Icon';

import './File.css';
import FileIcon from '../../assets/file.svg';


export default function File({ file, file_key, callbacks, selected, to_rename }) {
    const [newName, setNewName] = useState(file?.title);
    const inputRef = useRef();
    const treeItemRef = useRef();

    // event handlers
    const handleFocus = ev => {
        callbacks.select(file_key);
        ev.stopPropagation();
    }
    const handleKeydown = ev => {
        if (ev.key === 'Enter') {
            if (to_rename){
                if (newName !== '') {
                    callbacks.rename(file_key, newName);
                }
                callbacks.close_rename();
                treeItemRef.current.focus(); // refocus file component
            } else {
                callbacks.open(file_key);
            }
            ev.stopPropagation();
        }
    }
    const handleDoubleClick = ev => {
        callbacks.open(file_key);
        ev.stopPropagation();
    }
    const handleContextMenu = ev => {
        callbacks.openContextMenu(ev, file_key);
        ev.stopPropagation();
    }


    // focus rename form immediately
    useEffect(() => {
        if (to_rename) {
            inputRef.current.focus();
        }
    }, [to_rename]);

    // different inner HTML if File is being renamed
    const renameForm = (
        <form id="rename" name="rename">
            <input
                ref={inputRef}
                type="text"
                id="filename"
                name="filename"
                aria-label="New file name"
                size="10"
                value={newName}
                onChange={ev => setNewName(ev.target.value)}
                onBlur={() => { setNewName(''); callbacks.close_rename() }}
            />
        </form>
    );
    const filename = (
        <>
            <Icon src={FileIcon} size="14px" />
            &nbsp;
            <span>{file?.title}</span>
        </>
    )


    return (
        <li
            ref={treeItemRef}
            className="File"
            role="treeitem"
            tabIndex="0"
            aria-selected={selected ? "true" : "false"}
            onFocus={handleFocus}
            onKeyDown={handleKeydown}
            onDoubleClick={handleDoubleClick}
            onContextMenu={handleContextMenu}
            style={selected ? { backgroundColor: 'var(--accent)' } : {}}
        >
            {to_rename ? renameForm : filename}
        </li>
    )
}

File.propTypes = {
    file: PropTypes.object.isRequired,
    file_key: PropTypes.string.isRequired,
    callbacks: PropTypes.object,
    selected: PropTypes.bool,
    to_rename: PropTypes.bool,
}
File.defaultProps = {
    selected: false,
    to_rename: false,
}