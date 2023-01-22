import React, { useContext } from 'react';
import { DBContext } from '../App/App';

import FileListing from '../FileListing/FileListing';
import IconButton from '../IconButton/IconButton';

import './ExplorerList.css';
import FileAdd from '../../assets/file-plus.svg';
import DirAdd from '../../assets/folder-plus.svg';


export default function ExplorerList({ create_file, create_dir, ...props }) {
    const { db } = useContext(DBContext);
    const files = Object.entries(db.files)
        .filter(([k, v]) => v.parent === null)
        .map(([k, v]) => k);


    return (
        <>
            <div className="EL-header">
                <h2>NOTES</h2>
                <span className="EL-header-buttons">
                    <IconButton
                        src={FileAdd}
                        size="18px"
                        onClick={create_file}
                        tooltip="New note"
                    />
                    &nbsp;
                    <IconButton
                        src={DirAdd}
                        size="18px"
                        onClick={create_dir}
                        tooltip="New directory"
                    />
                </span>
            </div>

            <FileListing 
                file_keys={files}
                {...props}
            />
        </>
    )
}