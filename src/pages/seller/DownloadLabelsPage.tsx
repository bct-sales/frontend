import { AuthenticatedSellerStatus } from "@/auth/types";
import PersistentStateGuard from "@/components/PersistentStateGuard";
import { checkLabelGenerationStatus } from "@/rest/labels";
import { Button, Center, Paper, Stack } from "@mantine/core";
import { IconFileDownload } from "@tabler/icons-react";
import React from "react";
import { z } from "zod";
import { Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";


const DownloadLabelsPageState = z.object({
    statusUrl: z.string().url(),
});

export type DownloadLabelsPageState = z.infer<typeof DownloadLabelsPageState>;


export default function DownloadLabelsPage(props: { auth: AuthenticatedSellerStatus }): JSX.Element
{
    return (
        <PersistentStateGuard predicate={predicate} child={createPage} cacheKey="seller/download" />
    );


    function predicate(state: unknown): state is DownloadLabelsPageState
    {
        return DownloadLabelsPageState.safeParse(state).success;
    }

    function createPage(state: DownloadLabelsPageState): JSX.Element
    {
        return (
            <ActualDownloadLabelsPage auth={props.auth} statusUrl={state.statusUrl}/>
        );
    }
}


function ActualDownloadLabelsPage(props: { auth: AuthenticatedSellerStatus, statusUrl: string }): JSX.Element
{
    const [ downloadUrl, setDownloadUrl ] = React.useState<string | undefined>(undefined);
    const navigate = useNavigate();

    React.useEffect(() => {
        const aux = async () => {
            const result = await checkLabelGenerationStatus(props.auth.accessToken, props.statusUrl);

            if ( result === undefined )
            {
                setTimeout(() => void aux(), 1000);
            }
            else
            {
                setDownloadUrl(result);
            }
        };

        void (aux ());
    }, [props.statusUrl, props.auth.accessToken]);


    if ( downloadUrl === undefined )
    {
        return (
            <>
                <Center>
                    Waiting for generation to be ready
                </Center>
            </>
        );
    }
    else
    {
        return (
            <>
                <Paper p='xl'>
                    <Stack>
                        <Center>
                            <Button component="a" href={downloadUrl} w={120} h={120}><IconFileDownload width={100} height={100} /></Button>
                        </Center>
                        <Center>
                            <Text>Your label sheet is ready for download.</Text>
                        </Center>
                        <Center>
                            <Button component="a" href="/events">Back to events overview</Button>
                        </Center>
                    </Stack>
                </Paper>
            </>
        );
    }
}
