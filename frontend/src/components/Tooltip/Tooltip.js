import React, { useState, useEffect, useRef } from 'react';
import getPositionStyle from '../../services/getPositionStyle';
import './Tooltip.css';


export default function Tooltip({show, text}){
    const [actuallyShow, setActuallyShow] = useState(false);
    const [style, setStyle] = useState({});
    const tooltipRef = useRef();

    useEffect(() => {
        if (show) {
            const x = tooltipRef.current.getBoundingClientRect().x;
            const y = tooltipRef.current.getBoundingClientRect().y;
            setStyle(getPositionStyle(x, y));

            const reveal = () => setActuallyShow(show);
            const timeoutHandle = window.setTimeout(reveal, 1*1000);

            return () => window.clearTimeout(timeoutHandle);
        } else {
            setActuallyShow(false);
        }
    }, [show]);

    return (
        <div ref={tooltipRef}>
            {actuallyShow &&
                <div className="Tooltip" style={style}>
                    {text}
                </div>
            }
        </div>
    )
}