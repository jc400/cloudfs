import React from 'react';

import IconButton from '../IconButton/IconButton';
import MenuDropdown from '../MenuDropdown/MenuDropdown';
import MenuOption from '../MenuOption/MenuOption';

import './Sidebar.css';
import FolderIcon from '../../assets/folder.svg';
import SearchIcon from '../../assets/search.svg';
import SettingsIcon from '../../assets/settings.svg';

export default function Sidebar({ UIState, VaultActions, username }) {

    return (
        <>
            <div className="SB">
                <ul>
                    <li>
                        <div className={UIState.activeMid === "Explorer" ? "SB-selector SB-selector-active" : "SB-selector"} />
                        <IconButton
                            src={FolderIcon}
                            size="25px"
                            onClick={() => UIState.setActiveMid("Explorer")}
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
                            <div className="SB-dropdown-header">
                                Logged in as {username}.
                                (<a href="#" onClick={VaultActions.logout}>log out</a>)
                            </div>
                            <MenuOption name="Load vault" onClick={VaultActions.load} />
                            <MenuOption name="Save vault" onClick={VaultActions.save} />
                            <MenuOption name="Purge and re-create vault" onClick={VaultActions.create} />
                        </MenuDropdown>
                    </li>
                </ul>
            </div>
        </>
    )
}