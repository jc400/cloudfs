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
                    <hr />
                    <MenuOption onClick={callbacks.cut} name='Cut' />
                    <MenuOption onClick={callbacks.copy} name='Copy' />
                    <MenuOption onClick={callbacks.paste} name='Paste' />
                    <hr />
                    <MenuOption onClick={callbacks.create_file} name='Create file here' />
                    <MenuOption onClick={callbacks.create_dir} name='Create directory here' />
                    <hr />
                    <MenuOption onClick={callbacks.rename} name='Rename' />
                    <MenuOption onClick={callbacks.remove} name='Delete' />
                </Menu>
            </div>
        )}
        </>
    )
}