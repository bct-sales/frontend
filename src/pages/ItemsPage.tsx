import { useAuth } from "@/auth/context";
import { listItems } from "@/rest/items";
import { Item } from "@/rest/models";
import { useRequest } from "@/rest/request";
import { Box, Card, Paper, SimpleGrid, Text, Title } from "@mantine/core";
import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";


export default function ItemsPage(): JSX.Element
{
    const params = useParams();
    const eventId = params.eventId ? parseInt(params.eventId) : undefined;
    const navigate = useNavigate();
    const auth = useAuth();
    const accessToken = auth.authenticated ? auth.accessToken : undefined;
    const requester = useCallback(async () => listItems(accessToken, eventId), [accessToken, eventId]);
    const response = useRequest(requester);

    if ( !auth.authenticated )
    {
        console.error('Unauthenticated user should not be able to get here');
        navigate('/login');
        return <></>;
    }
    else if ( response.ready )
    {
        if ( response.payload.success )
        {
            const events = response.payload.value;

            return (
                <>
                    <Paper maw={800} mx='auto' p="md">
                        <Title>
                            Sale Event {eventId} Items
                        </Title>
                        <Box my={50}>
                            <SimpleGrid cols={3}>
                                {events.map(item => <ItemViewer key={item.id} item={item} />)}
                            </SimpleGrid>
                        </Box>
                    </Paper>
                </>
            );
        }
        else
        {
            return (
                <>
                    An error occurred: {response.payload.error}
                </>
            );
        }
    }
    else
    {
        return (
            <p>
                Loading
            </p>
        );
    }
}


function ItemViewer({ item } : { item: Item }): JSX.Element
{
    return (
        <>
            <Card maw={250} withBorder p='md'>
                <Text>
                    {item.description}
                </Text>
            </Card>
        </>
    );
}
