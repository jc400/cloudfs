import React from 'react';
import { login, logout } from '../../services/auth';

import Icon from '../Icon/Icon';
import IconButton from '../IconButton/IconButton';
import MenuDropdown from '../MenuDropdown/MenuDropdown';
import MenuOption from '../MenuOption/MenuOption';

import './Sidebar.css';
import FolderIcon from '../../assets/folder.svg';
import SearchIcon from '../../assets/search.svg';
import SettingsIcon from '../../assets/settings.svg';

export default function Sidebar({UIState, VaultActions}) {

    return (
        <div className="SB">
            <ul>
                <li>
                    <div className={UIState.activeMid === "FileExplorer" ? "SB-selector SB-selector-active" : "SB-selector"} />
                    <IconButton 
                        src={FolderIcon}
                        size="25px"
                        onClick={() => UIState.setActiveMid("FileExplorer")}
                        tooltip="View notes"
                    />
                </li>
                <li>
                    <div className={UIState.activeMid === "Search" ? "SB-selector SB-selector-active" : "SB-selector"} />
                    <IconButton 
                        src={SearchIcon}
                        size="25px"
                        onClick={() => UIState.setActiveMid("Search")}
                        tooltip="Search notes"
                    />
                </li>
            </ul>
            <ul>
                <li>
                    <MenuDropdown 
                        icon={SettingsIcon}
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