import { Center, Loader, Stack, Text } from "@mantine/core";
import { useEffect, useState } from "react";


export default function DefaultLoadingScreen()
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
                        <Text fw='bold'>Loading</Text>
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
