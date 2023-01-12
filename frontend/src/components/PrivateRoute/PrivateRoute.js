import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PrivateRoute({ authenticated, children }) {
    const Navigate = useNavigate();

    useEffect(() => {
        if (!authenticated) {
            return Navigate("/login");
        }
    }, [authenticated, Navigate]);

    return children;
}