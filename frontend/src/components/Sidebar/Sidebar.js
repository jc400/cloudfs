import React from 'react';

import Button from '../Button/Button';
import Icon from '../Icon/Icon';
import MenuDropdown from '../MenuDropdown/MenuDropdown';
import MenuOption from '../MenuOption/MenuOption';

import './Sidebar.css';
import folder from '../../assets/folder.svg';
import search from '../../assets/search.svg';
import star from '../../assets/empty_star.png';
import settings from '../../assets/settings.svg';

export default function Sidebar({activeMid, setActiveMid, VaultActions}) {

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
                    <MenuDropdown 
                        title={<Icon src={settings} />}
                        tooltip="Show settings"
                    >
                        <MenuOption name="Create DB" onClick={VaultActions.createDB} />
                        <MenuOption name="Save DB" onClick={VaultActions.saveDB} />
                        <MenuOption name="Load DB" onClick={VaultActions.loadDB} />
                    </MenuDropdown>
                </li>
            </ul>
        </div>
    )
}