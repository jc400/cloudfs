import React from 'react';

import Button from '../Button/Button';
import Icon from '../Icon/Icon';

import './Sidebar.css';
import folder from '../../assets/folder.svg';
import search from '../../assets/search.svg';
import star from '../../assets/empty_star.png';
import settings from '../../assets/settings.svg';

export default function Sidebar({activeMid, setActiveMid}) {

    const bg = {backgroundColor: "var(--gray1)"};
    return (
        <div id="Sidebar">
            <ul>
                <li>
                    <Button
                        onClick={() => setActiveMid("FileExplorer")}
                        tooltip="Show the File Explorer"
                        style={bg}
                    ><Icon src={folder} /></Button>
                </li>
                <li>
                    <Button
                        onClick={() => setActiveMid("Search")}
                        tooltip="Search"
                        style={bg}
                    ><Icon src={search} /></Button>
                </li>
                <li>
                    <Button
                        onClick={() => setActiveMid("Starred")}
                        tooltip="Show starred files"
                        style={bg}
                    ><Icon src={star} /></Button>
                </li>
                <li>
                    <Button
                        onClick={() => setActiveMid("Settings")}
                        tooltip="Show settings"
                        style={bg}
                    ><Icon src={settings} /></Button>
                </li>
            </ul>
        </div>
    )
}