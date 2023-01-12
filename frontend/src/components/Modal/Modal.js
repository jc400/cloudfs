import React from 'react';
import './Modal.css';

export default function Modal({ show, close, children }) {
    return (
        <>
            {show && (
                <div className="modal-bg" onClick={() => close()}>
                    <div className="modal-content" onClick={ev=>ev.stopPropagation()}>
                        {children}
                    </div>
                </div>
            )}
        </>
    )
}
    
