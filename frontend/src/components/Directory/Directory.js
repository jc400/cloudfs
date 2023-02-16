import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import Icon from '../Icon/Icon';

import './Directory.css';
import chevRight from '../../assets/chevron-right.svg';
import chevDown from '../../assets/chevron-down.svg';


export default function Directory({ children, file, file_key, callbacks, selected, to_rename }) {
    const [expand, setExpand] = useState(false);
    const [newName, setNewName] = useState(file?.title);
    const inputRef = useRef();
    const treeItemRef = useRef();

    // event handlers
    const handleFocus = ev => {
        if (ev.target === treeItemRef.current) {
            callbacks.select(file_key);
        }
    }
    const handleKeydown = ev => {
        if (ev.key === 'Enter') {
            if (to_rename){
                if (newName !== '') {
                    callbacks.rename(file_key, newName);
                }
                callbacks.close_rename();
                treeItemRef.current.focus();
            } else {
                setExpand(!expand);
            }
            ev.stopPropagation();
        }
    }
    const handleDoubleClick = ev => {
        setExpand(!expand);
        ev.stopPropagation();
    }
    const handleContextMenu = ev => {
        callbacks.openContextMenu(ev, file_key);
        ev.stopPropagation();
    }

    // put focus to input, if renaming
    useEffect(() => {
        // focus() input when form is shown
        if (to_rename) {
            inputRef.current.focus();
        }
    }, [to_rename]);

    // HTML inner content
    const renameForm = (
        <form id="rename" name="rename">
            <input
                ref={inputRef}
                type="text"
                id="dirname"
                name="dirname"
                aria-label="New directory name"
                size="10"
                value={newName}
                onChange={ev => setNewName(ev.target.value)}
                onBlur={() => { setNewName(''); callbacks.close_rename() }}
            />
        </form>
    );
    const dirname = (
        <>
            <Icon
                src={expand ? chevDown : chevRight}
                size="19px"
            />
            <span>{file?.title}</span>
        </>
    )

    return (
        <li
            ref={treeItemRef}
            title={file?.title}
            role="treeitem"
            tabIndex="0"
            aria-selected={selected ? "true" : "false"}
            aria-expanded={expand ? "true" : "false"}
            onFocus={handleFocus}
            onKeyDown={handleKeydown}
            onDoubleClick={handleDoubleClick}
            onContextMenu={handleContextMenu}
        >
            <div
                className="Directory"
                style={selected ? { backgroundColor: 'var(--accent)' } : {}}
            >
                {to_rename ? renameForm : dirname}
            </div>
            {expand &&
                <ul className="Directory-children" role="group" tabIndex="-1">
                    {children}
                </ul>
            }
        </li>
    )
}

Directory.propTypes = {
    children: PropTypes.array,
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