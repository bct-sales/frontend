import { useAuth } from "@/auth/context";
import { AuthenticatedAdminStatus, AuthenticatedSellerStatus } from "@/auth/types";


interface BaseProps
{
    error?: () => JSX.Element;
}

interface SellerProps extends BaseProps
{
    child: (auth: AuthenticatedSellerStatus) => JSX.Element;

    role: 'seller';
}

interface AdminProps extends BaseProps
{
    child: (auth: AuthenticatedAdminStatus) => JSX.Element;

    role: 'admin';
}

type Props = SellerProps | AdminProps;


export default function AuthGuard(props: Props): JSX.Element
{
    const auth = useAuth();

    if ( auth.isAuthenticated() )
    {
        if ( props.role === 'seller' && auth.role === 'seller' )
        {
            return props.child(auth);
        }
        else if ( props.role === 'admin' && auth.role === 'admin' )
        {
            return props.child(auth);
        }
    }

    const error = props.error ?? defaultError;
    return error();
}


function defaultError(): JSX.Element
{
    return (
        <p>
            Authentication missing
        </p>
    )
}