import React, { useState, useEffect, useRef } from 'react';
import './Tag.css';


export default function TagForm({ show, addTag, cancel }) {
    const [tagName, setTagName] = useState('');
    const inputRef = useRef();

    const handleSubmit = ev => {
        // submits form and creates tag
        ev.preventDefault();
        if (tagName !== '') {
            addTag(tagName);
            setTagName('');
        }
        cancel();
    }

    useEffect(() => {
        // focus() input when form is shown
        if (show){
            inputRef.current.focus();
        }
    }, [show]);

    return (
        <>
            {show &&
                <div className="tag">
                    <span>
                        <form id="settag" name="settag" onSubmit={handleSubmit}>
                            <input 
                                ref={inputRef}
                                type="text" 
                                id="tagname"
                                name="tagname"
                                aria-label="New tag name"
                                size="5"
                                value={tagName}
                                onChange={ev => setTagName(ev.target.value)}
                                onBlur={() => {setTagName(''); cancel()}}
                            />
                        </form>
                    </span>
                </div>
            }
        </>

    )
}
