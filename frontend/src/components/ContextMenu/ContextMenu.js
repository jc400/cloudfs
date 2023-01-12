import React, {useEffect} from 'react';
import Menu from '../Menu/Menu';
import MenuOption from '../MenuOption/MenuOption';


export default function ContextMenu({show, setShow, pos, selectedFile, change}){

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
                    <MenuOption onClick={() => change('open', selectedFile)} name='Open' />
                    <MenuOption onClick={() => change('cut', selectedFile)} name='Cut' />
                    <MenuOption onClick={() => change('paste', selectedFile)} name='Paste' />
                    <MenuOption onClick={() => change('rename', selectedFile)} name='Rename' />
                    {selectedFile?.starred
                        ? <MenuOption onClick={() => change('unstar', selectedFile)} name='Unstar' />
                        : <MenuOption onClick={() => change('star', selectedFile)} name='Star' />
                    }
                    <MenuOption onClick={() => change('delete', selectedFile)} name='Delete' />
                </Menu>
            </div>
        )}
        </>
    )
}