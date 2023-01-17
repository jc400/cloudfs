import React from 'react';
import { login, logout } from '../../services/auth';

import Icon from '../Icon/Icon';
import IconButton from '../IconButton/IconButton';
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
                    <IconButton 
                        src={folder}
                        size="25px"
                        onClick={() => setActiveMid("FileExplorer")}
                        tooltip="View notes"
                    />
                </li>
                <li>
                    <IconButton
                        src={search}
                        size="25px"
                        onClick={() => setActiveMid("Search")}
                        tooltip="Search notes"
                    ></IconButton>
                </li>
                <li>
                    <MenuDropdown 
                        title={<Icon src={settings} />}
                        tooltip="Show settings"
                    >
                        <MenuOption name="Login" onClick={() => login(prompt("Username: "), prompt("Password: "))} />
                        <MenuOption name="Logout" onClick={()=>logout()} />
                        <MenuOption name="Create DB" onClick={VaultActions.createDB} />
                        <MenuOption name="Save DB" onClick={VaultActions.saveDB} />
                        <MenuOption name="Load DB" onClick={VaultActions.loadDB} />
                    </MenuDropdown>
                </li>
            </ul>
        </div>
    )
}