import { Params } from "react-router-dom";
import ParamsGuard from "./ParamsGuard";
import { Result, failure, success } from "@/result";


interface Props
{
    paramName: string;

    child: (value: number) => JSX.Element;

    error: () => JSX.Element;
}


export default function IntParamsGuard(props: Props): JSX.Element
{
    return (
        <ParamsGuard extractor={extractor} child={props.child} error={() => props.error()} />
    );


    function extractor(params: Readonly<Params>): Result<number, undefined>
    {
        const str = params[props.paramName];

        if ( str !== undefined )
        {
            const value = parseInt(str);

            if ( !Number.isNaN(value) )
            {
                return success(value);
            }
        }

        return failure(undefined);
    }
}