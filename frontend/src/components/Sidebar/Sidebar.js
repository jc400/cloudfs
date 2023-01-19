import React, {useState} from 'react';
import { logout } from '../../services/auth';

import IconButton from '../IconButton/IconButton';
import MenuDropdown from '../MenuDropdown/MenuDropdown';
import MenuOption from '../MenuOption/MenuOption';
import Login from '../Login/Login';

import './Sidebar.css';
import FolderIcon from '../../assets/folder.svg';
import SearchIcon from '../../assets/search.svg';
import SettingsIcon from '../../assets/settings.svg';

export default function Sidebar({UIState, VaultActions, user, setUser}) {

    const [showLogin, setShowLogin] = useState(false);

    const loggedInMenu = (
        <>
            <div>
                Logged in as {user?.username}.
                (<a href="#" onClick={logoutUser}>log out</a>)
            </div>
            <MenuOption name="Load vault" onClick={VaultActions.loadDB} />
            <MenuOption name="Save vault" onClick={VaultActions.saveDB} />
            <MenuOption name="Purge and re-create vault" onClick={VaultActions.createDB} />
        </>
    );
    const loggedOutMenu = (
        <>
            <div>
                Logged out.
                (<a href="#" onClick={() => setShowLogin(true)}>log in</a>)
            </div>
            <MenuOption name="Load vault" onClick={VaultActions.loadDB} disabled={true} />
            <MenuOption name="Save vault" onClick={VaultActions.saveDB} disabled={true} />
            <MenuOption name="Create local vault" onClick={VaultActions.createDB} />
        </>
    )

    const logoutUser = () => {
        loutout();
        setUser({"logged in": false, "username":""})
    }


    return (
        <>
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
                            {user["logged in"] ? loggedInMenu : loggedOutMenu }
                        </MenuDropdown>
                    </li>
                </ul>
            </div>

            <Login show={showLogin} close={() => setShowLogin(false)} setUser={setUser} />
        </>
    )
}