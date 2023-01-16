import React from 'react';

import Icon from '../Icon/Icon';
import MenuDropdown from '../MenuDropdown/MenuDropdown';
import MenuOption from '../MenuOption/MenuOption';

import './Sidebar.css';
import folder from '../../assets/folder.svg';
import search from '../../assets/search.svg';
import star from '../../assets/empty_star.png';
import settings from '../../assets/settings.svg';

export default function Sidebar({activeMid, setActiveMid, VaultActions}) {

    return (
        <div id="Sidebar">
            <ul>
                <li>
                    <button
                        onClick={() => setActiveMid("FileExplorer")}
                    ><Icon src={folder} /></button>
                </li>
                <li>
                    <button
                        onClick={() => setActiveMid("Search")}
                    ><Icon src={search} /></button>
                </li>
                <li>
                    <button
                        onClick={() => setActiveMid("Starred")}
                    ><Icon src={star} /></button>
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