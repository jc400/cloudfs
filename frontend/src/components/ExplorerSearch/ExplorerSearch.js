import React, { useContext } from 'react';
import { DBContext } from '../App/App';

import FileListing from '../FileListing/FileListing';
import IconButton from '../IconButton/IconButton';



export default function ExplorerSearch({ UIState, ...props }) {
    const { db } = useContext(DBContext);

    const handleQueryChange = ev => {
        UIState.setSearchString(ev.target.value);
    }

    const files = Object.entries(db.files)
        .filter(([k, v]) => {
            if (v.title?.includes(UIState.searchString)) return true;
            if (v.content?.includes(UIState.searchString)) return true;
            if (v.tags?.includes(UIState.searchString)) return true;
        })
        .sort((a, b) => (b[1]?.file_type === 'd') - (a[1]?.file_type === 'd'))
        .map(([k, v]) => k);


    return (
        <div className="FE">

            <div className="FE-header-search">
                <label htmlFor="search"><h2>SEARCH</h2></label>
                <input
                    name="search files"
                    type="search"
                    value={UIState.searchString || ''}
                    onChange={handleQueryChange} />
                <div>{files.length} results</div>
            </div>

            <FileListing 
                file_keys={files}
                {...props}
            />

        </div>
    )
}