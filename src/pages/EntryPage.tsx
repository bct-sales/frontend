import { useAuth } from "@/auth/context";
import { Role } from "@/auth/types";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";



export default function EntryPage(): React.ReactNode
{
    const auth = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if ( auth.isAuthenticated() )
        {
            navigate(entryPageUrl(auth.role));
        }
        else
        {
            navigate('/login');
        }
    });

    return (
        <></>
    );


    function entryPageUrl(role: Role): string
    {
        switch ( role )
        {
            case 'admin':
                return '/admin/events';
            case 'seller':
                return '/events';
            case 'cashier':
                return '/cashier/sale';
            default:
                console.error('Unknown role', role);
                throw new Error('Unknown role');
        }
    }
}
