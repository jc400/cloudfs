import React, {useEffect} from 'react';
import Menu from '../Menu/Menu';
import MenuOption from '../MenuOption/MenuOption';


export default function ContextMenu({show, setShow, pos, callbacks}){

    useEffect(() => {
        if (show) {
            const close = () => setShow(false);
            window.addEventListener("click", close);
            return () => window.removeEventListener("click", close);
        }
    }, [show]);

    return (
        <>
        {show && (
            <div style={{ position: 'absolute', top: pos.y, left: pos.x }}>
                <Menu style={pos.style}>
                    <MenuOption onClick={callbacks.open} name='Open' />
                    <MenuOption onClick={callbacks.cut} name='Cut' />
                    <MenuOption onClick={callbacks.paste} name='Paste' />
                    <MenuOption onClick={callbacks.rename} name='Rename' />
                    <MenuOption onClick={callbacks.star} name='Star' />
                    <MenuOption onClick={callbacks.unstar} name='Unstar' />
                    <MenuOption onClick={callbacks.remove} name='Delete' />
                </Menu>
            </div>
        )}
        </>
    )
}