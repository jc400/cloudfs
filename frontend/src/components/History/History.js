import React, { useState, useEffect } from 'react';
import Button from '../Button/Button';
import Icon from '../Icon/Icon';
import backIcon from '../../assets/chevron-left.svg';
import forwardIcon from '../../assets/chevron-right.svg';


export default function History({ pwd, open }) {
    const [history, setHistory] = useState([]);
    const [pointer, setPointer] = useState(0);

    useEffect( () => {
        if (pwd !== history[pointer]){
            let newHistory = [...history];
            newHistory.splice(pointer + 1);
            newHistory.push(pwd);
            
            setHistory(newHistory);
            setPointer(newHistory.length - 1);
        }
    }, [pwd]);

    const handleBack = () => {
        if (history[pointer - 1]){
            open(history[pointer - 1]);
            setPointer(prev => prev - 1);
        }
    }
    const handleForward = () => {
        if (history[pointer + 1]){
            open(history[pointer + 1]);
            setPointer(prev => prev + 1);
        }
    }

    return (
        <span>
            <Button 
                onClick={handleBack}
                deactivated={!Boolean(history[pointer - 1])}
                tooltip="Navigate back to previous directory"
                style={{borderRadius: '10px 0px 0px 10px'}}
            >
                <Icon src={backIcon} />
            </Button>
            <Button 
                onClick={handleForward}
                deactivated={!Boolean(history[pointer + 1])}
                tooltip="Navigate forward to directory"
                style={{borderRadius: '0px 10px 10px 0px', }}
            >
                <Icon src={forwardIcon} />
            </Button>
        </span>
    )
}