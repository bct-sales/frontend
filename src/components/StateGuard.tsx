import { useLocation } from "react-router-dom";

interface Props<T>
{
    predicate: (state: unknown) => state is T;

    child: (value: T) => JSX.Element;

    error?: () => JSX.Element;
}


export default function StateGuard<T>(props: Props<T>): JSX.Element
{
    const location = useLocation();
    const state = location.state as unknown;

    if ( props.predicate(state) )
    {
        return props.child(state);
    }
    else
    {
        const error = props.error ?? defaultError;

        return error();
    }
}


function defaultError()
{
    return (
        <p>An error occurred: Invalid state</p>
    );
}
