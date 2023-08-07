import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './context';


export function RequireAuth( { children }: { children: React.ReactNode; } ): JSX.Element
{
    const auth = useAuth();

    if ( !auth.token )
    {
        return (
            <Navigate to="/login" />
        );
    }
    else
    {
        return (
            <>
                { children }
            </>
        );
    }
}
