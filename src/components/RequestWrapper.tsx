import { RequestResult } from "@/rest/request";
import { Flex, Loader } from "@mantine/core";
import { useEffect, useState } from "react";


interface RequestWrapperProps<T, E>
{
    requestResult: RequestResult<T, E>;

    loading?: () => JSX.Element;

    failure?: (error: E) => JSX.Element;

    success: (payload: T) => JSX.Element;
}


export default function RequestWrapper<T, E>(props: RequestWrapperProps<T, E>): JSX.Element
{
    const { requestResult } = props;

    if ( requestResult.ready )
    {
        if ( requestResult.success )
        {
            return props.success(requestResult.payload);
        }
        else
        {
            const failure = props.failure ?? defaultFailure;

            return failure(requestResult.error);
        }
    }
    else
    {
        const loading = props.loading ?? defaultLoading;

        return loading();
    }


    function defaultLoading()
    {
        return (
            <DefaultLoadingScreen />
        );
    }

    function defaultFailure(error: E): JSX.Element
    {
        return (
            <>
                Error: {error}
            </>
        )
    }
}


function DefaultLoadingScreen()
{
    const [show, setShow] = useState(false);

    useEffect(() => {
        setTimeout(() => { setShow(true) }, 100);
    }, []);

    if ( show )
    {
        return (
            <>
                <Flex w='100%' justify='center' align='center' h='100px'>
                    <Loader />
                </Flex>
            </>
        );
    }
    else
    {
        return (
            <></>
        );
    }
}