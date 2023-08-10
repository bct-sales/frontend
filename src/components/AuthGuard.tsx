import { AuthenticatedUser, useAuth } from "@/auth/context";


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
