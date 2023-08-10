import { RequestResult } from "@/rest/request";
import { Center, Flex, Group, Loader, Stack, Text } from "@mantine/core";
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
                <Center m='xl'>
                    <Stack align="center">
                        <Loader />
                        <Text>Loading</Text>
                    </Stack>
                </Center>
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
