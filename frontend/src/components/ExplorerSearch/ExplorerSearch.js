import React, { useContext, useState } from 'react';
import { DBContext } from '../App/App';

import FileListing from '../FileListing/FileListing';
import IconButton from '../IconButton/IconButton';

import chevRight from '../../assets/chevron-right.svg';
import chevDown from '../../assets/chevron-down.svg';

import './ExplorerSearch.css';


export default function ExplorerSearch({ UIState, ...props }) {
    const { db } = useContext(DBContext);
    const [expand, setExpand] = useState(false);
    const [title, setTitle] = useState(true);
    const [content, setContent] = useState(true);
    const [tags, setTags] = useState(true);

    const handleQueryChange = ev => {
        UIState.setSearchString(ev.target.value);
    }

    const files = Object.entries(db.files)
        .filter(([k, v]) => {
            if (title   && v.title?.includes(UIState.searchString)) return true;
            if (content && v.content?.includes(UIState.searchString)) return true;
            if (tags    && v.tags?.includes(UIState.searchString)) return true;
            return false;
        })
        .sort((a, b) => (b[1]?.file_type === 'd') - (a[1]?.file_type === 'd'))
        .map(([k, v]) => k);


    return (
        <>
            <div className="ES-header">

                <label htmlFor="search">
                    <h2>SEARCH</h2>
                </label>

                <span className="ES-searchbar">
                    <IconButton
                        src={expand ? chevDown : chevRight}
                        onClick={ev => {ev.stopPropagation(); setExpand(!expand);}}
                        size="19px"
                        tooltip="Show additional search options"
                    />
                    <input
                        name="search files"
                        type="search"
                        value={UIState.searchString || ''}
                        onChange={handleQueryChange} 
                    />
                </span>

                {expand && 
                    <div className="ES-checkboxes">
                        <label>
                            <input 
                                type="checkbox" 
                                name="title" 
                                id="title" 
                                checked={title} 
                                onChange={ev => setTitle(ev.target.checked)}
                            />
                            <span>Title</span>
                        </label>
                        <label>
                            <input 
                                type="checkbox" 
                                name="content" 
                                id="content" 
                                checked={content} 
                                onChange={ev => setContent(ev.target.checked)}
                            />
                            <span>Content</span>
                        </label>
                        <label>
                            <input 
                                type="checkbox" 
                                name="tags" 
                                id="tags" 
                                checked={tags} 
                                onChange={ev => setTags(ev.target.checked)}
                            />
                            <span>Tags</span>
                        </label>
                    </div>
                }

                <div className="ES-results">{files.length} results</div>
            </div>

            <FileListing 
                file_keys={files}
                {...props}
            />

        </>
    )
}