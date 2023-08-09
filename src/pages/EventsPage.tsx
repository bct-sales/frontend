import { useAuth } from "@/auth/context";
import { listEvents } from "@/rest/events";
import { SalesEvent } from "@/rest/models";
import { useRequest } from "@/rest/request";
import { Box, Button, Card, Paper, SimpleGrid, Text, Title } from "@mantine/core";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";


export default function EventsPage(): JSX.Element
{
    const navigate = useNavigate();
    const auth = useAuth();
    const accessToken = auth.authenticated ? auth.accessToken : undefined;
    const requester = useCallback(async () => listEvents(accessToken), [accessToken]);
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
                            Upcoming Sale Events
                        </Title>
                        <Box my={50}>
                            <SimpleGrid cols={3}>
                                {events.map(event => <EventViewer key={event.id} event={event} />)}
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
                    An error occurred
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


function EventViewer({ event } : { event: SalesEvent }): JSX.Element
{
    return (
        <>
            <Card maw={250} withBorder p='md'>
                <Button fullWidth fz='xl' mb='lg'>
                    {event.date.format()}
                </Button>
                <Text>
                    {event.startTime.format()} - {event.endTime.format()} ({event.location})
                </Text>
                <Text>
                    {event.description}
                </Text>
            </Card>
        </>
    );
}
