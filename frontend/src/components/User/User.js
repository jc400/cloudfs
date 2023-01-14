import React from 'react';
import { logout } from '../../services/auth';

import MenuDropdown from '../MenuDropdown/MenuDropdown';
import MenuOption from '../MenuOption/MenuOption';

import './User.css';


export default function User({ authenticated, setAuthenticated, callbacks }) {
    const handleLogout = () => {
        logout()
        .then( () => setAuthenticated(false));
    }

    return (
        <>{authenticated &&
            <div id="user">
                <MenuDropdown title="User" tooltip="View user settings">
                    <MenuOption name="Log out" onClick={handleLogout} />
                    <MenuOption name="Create DB" onClick={callbacks.createDB} />
                    <MenuOption name="Save DB" onClick={callbacks.saveDB} />
                    <MenuOption name="Load DB" onClick={callbacks.loadDB} />
                </MenuDropdown>
            </div>
        }</>
    )
}