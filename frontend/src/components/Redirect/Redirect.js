import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Redirect({ url }){
    const navigate = useNavigate();
    useEffect(() => navigate(url), []);
    return <></>;
}