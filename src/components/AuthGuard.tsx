import { useAuth } from "@/auth/context";
import { AuthenticatedUser } from "@/auth/types";


interface AuthGuardProps
{
    child: (auth: AuthenticatedUser) => JSX.Element;

    error?: () => JSX.Element;
}


export default function AuthGuard(props: AuthGuardProps): JSX.Element
{
    const auth = useAuth();

    if ( auth.authenticated )
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
