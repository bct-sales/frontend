import ErrorPage from "@/pages/ErrorPage";
import { UpdateCacheAction } from "@/redux/actions";
import { useDispatch, useSelector } from "@/redux/store";
import { useLocation } from "react-router-dom";


interface Props<T>
{
    predicate: (state: unknown) => state is T;

    cacheKey: string;

    child: (value: T) => JSX.Element;

    error?: () => JSX.Element;
}


export default function PersistentStateGuard<T>(props: Props<T>): JSX.Element
{
    const location = useLocation();
    const state = location.state as unknown;
    const cached = useSelector(state => state.cache[props.cacheKey]);
    const dispatch = useDispatch();

    if ( props.predicate(state) )
    {
        const action: UpdateCacheAction = {
            type: 'cache/update',
            payload: { key: props.cacheKey, value: state }
        };
        dispatch(action);

        return props.child(state);
    }
    else if ( props.predicate(cached) )
    {
        return props.child(cached);
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
        <ErrorPage>
            <p>
                State lost
            </p>
        </ErrorPage>
    );
}
