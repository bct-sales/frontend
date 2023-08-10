import { useAuth } from "@/auth/context";
import { listEvents } from "@/rest/events";
import { SalesEvent } from "@/rest/models";
import { useRequest } from "@/rest/request";
import { Box, Button, Card, Flex, Paper, SimpleGrid, Text, Title } from "@mantine/core";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";


export default function EventsPage(): JSX.Element
{
    const navigate = useNavigate();
    const auth = useAuth();
    const accessToken = auth.authenticated ? auth.accessToken : undefined;
    const requester = useCallback(async () => listEvents(accessToken), [accessToken]);
    const [events, setEvents] = useRequest(requester);

    if ( !auth.authenticated )
    {
        console.error('Unauthenticated user should not be able to get here');
        navigate('/login');
        return <></>;
    }
    else if ( events.ready )
    {
        if ( events.success )
        {
            const evts = events.payload;

            return (
                <>
                    <Paper mx='auto' p="md">
                        <Title>
                            Upcoming Sale Events
                        </Title>
                        <Box my={50}>
                            <Flex direction="row" justify="center" align="center" gap="md" wrap="wrap">
                                {evts.map(event => <EventViewer key={event.id} event={event} />)}
                            </Flex>
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
    const navigate = useNavigate();

    return (
        <>
            <Card withBorder p='md' miw={300}>
                <Button fullWidth fz='xl' mb='lg' onClick={onClick}>
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


    function onClick()
    {
        console.log('Clicked!');
        navigate(`/events/${event.id}/items`);
    }
}
