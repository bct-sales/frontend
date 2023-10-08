import { AuthenticatedSellerStatus } from "@/auth/types";
import PersistentStateGuard from "@/components/PersistentStateGuard";
import { checkLabelGenerationStatus } from "@/rest/labels";
import { Button, Card, Center, Loader, Paper, Stack } from "@mantine/core";
import { IconFileDownload } from "@tabler/icons-react";
import React from "react";
import { z } from "zod";
import { Text } from "@mantine/core";


const DownloadLabelsPageState = z.object({
    statusUrl: z.string(), // url
}).strict();

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

    React.useEffect(() => {
        const aux = async () => {
            const result = await checkLabelGenerationStatus(props.auth.accessToken, props.statusUrl);

            if ( result === undefined )
            {
                setTimeout(() => void aux(), 5000);
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
                <Stack m='xl'>
                    <Center>
                        <Loader />
                    </Center>
                    <Center>
                        <Text>
                            Waiting for generation to be ready (expected: 5s)
                        </Text>
                    </Center>
                </Stack>
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
                            <Card maw={800}>
                                <ul>
                                    <li>
                                        Prior to printing, please ensure that nothing overlaps with the barcode.
                                        If it does, choosing a smaller font size should help.
                                    </li>
                                    <li>
                                        The number in the lower left corner <em>must</em> be readable, otherwise the item will not be able to be sold.
                                    </li>
                                    <li>
                                        We strongly suggest you print the labels on single label sheets, i.e., sheets on which the labels have not been precut.
                                        This way, you do not need to worry about aligning the labels on the sheet.
                                    </li>
                                </ul>
                            </Card>
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
