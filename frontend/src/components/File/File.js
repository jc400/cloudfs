import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import Icon from '../Icon/Icon';

import './File.css';
import FileIcon from '../../assets/file.svg';


export default function File({ file, file_key, callbacks, selected, to_rename }) {
    const [newName, setNewName] = useState(file?.title);
    const inputRef = useRef();

    // event handlers
    const handleSubmit = ev => {
        // renames file (if not blank) and closes rename form
        ev.preventDefault();
        if (newName !== '') {
            callbacks.rename(file_key, newName);
        }
        callbacks.close_rename();
    }
    const handleKeydown = ev => {
        if (ev.key === 'Enter' && !to_rename) {
            callbacks.open(file_key);
        }
    }

    // focus rename form immediately
    useEffect(() => {
        if (to_rename) {
            inputRef.current.focus();
        }
    }, [to_rename]);

    // different inner HTML if File is being renamed
    const renameForm = (
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
            className="File"
            role="treeitem"
            tabIndex="0"
            aria-selected={selected ? "true" : "false"}
            onFocus={() => callbacks.select(file_key)}
            onKeyDown={handleKeydown}
            onDoubleClick={() => callbacks.open(file_key)}
            onContextMenu={ev => callbacks.openContextMenu(ev, file_key)}
            style={selected ? { backgroundColor: 'var(--accent)' } : {}}
        >
            {to_rename ? renameForm : filename}
        </li>
    )
}

File.propTypes = {
    file: PropTypes.object,
    columns: PropTypes.object,
}
File.defaultProps = {
    columns: { name: true, size: true, updated: true, starred: true },
}