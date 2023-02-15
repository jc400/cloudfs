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

    const handleRename = ev => {
        // renames dir (if not blank) and closes rename form
        ev.preventDefault();
        if (newName !== '') {
            callbacks.rename(file_key, newName);
        }
        callbacks.close_rename();
    }
    const handleKeydown = ev => {
        if (ev.key === 'Enter'){
            setExpand(!expand);
        }
    }
    const handleFocus = ev => {
        if (ev.target === treeItemRef.current){
            callbacks.select(file_key);
        }

    }

    useEffect(() => {
        // focus() input when form is shown
        if (to_rename){
            inputRef.current.focus();
        }
    }, [to_rename]);

    return (
        <li 
            ref={treeItemRef}
            role="treeitem" 
            aria-expanded={expand ? "true" : "false"}
            aria-selected={selected ? "true" : "false"}
            tabIndex="0"
            onFocus={handleFocus}
            onKeyDown={handleKeydown}
        >
            {to_rename
                ?
                <div className="Directory">
                    <span>
                        <form id="rename" name="rename" onSubmit={handleRename}>
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
                    </span>
                </div>
                :
                <div
                    className="Directory"
                    onDoubleClick={() => setExpand(!expand)}
                    onContextMenu={ev => callbacks.openContextMenu(ev, file_key)}
                    style={selected ? { backgroundColor: 'var(--accent)' } : {}}
                >
                    <Icon
                        src={expand ? chevDown : chevRight}
                        size="19px"
                    />
                    <span>{file?.title}</span>
                </div>
            }
            {expand && 
                <ul className="Directory-children" role="group" tabIndex="-1">
                    {children}
                </ul>}
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