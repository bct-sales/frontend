import { useAuth } from "@/auth/context";
import { AuthenticatedUser, Role } from "@/auth/types";


interface AuthGuardProps
{
    child: (auth: AuthenticatedUser) => JSX.Element;

    role: Role;

    error?: () => JSX.Element;
}


export default function AuthGuard(props: AuthGuardProps): JSX.Element
{
    const auth = useAuth();

    if ( auth.authenticated && auth.role === props.role )
    {
        return props.child(auth);
    }
    else
    {
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
}
