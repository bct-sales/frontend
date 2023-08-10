import { Result } from "@/result";
import { Params, useParams } from "react-router-dom";


interface Props<T, E>
{
    extractor: (params: Readonly<Params>) => Result<T, E>;

    child: (param: T) => JSX.Element;

    error?: (error: E) => JSX.Element;
}


export default function ParamsGuard<T, E>(props: Props<T, E>)
{
    const params = useParams();
    const result = props.extractor(params);

    if ( result.success )
    {
        return props.child(result.value);
    }
    else
    {
        const error = props.error ?? defaultError;

        return error(result.error);
    }


    function defaultError()
    {
        return (
            <p>
                An error occurred
            </p>
        )
    }
}
