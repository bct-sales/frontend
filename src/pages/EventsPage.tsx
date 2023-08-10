import { AuthenticatedUser } from "@/auth/context";
import RequestWrapper from "@/components/RequestWrapper";
import { listEvents } from "@/rest/events";
import { SalesEvent } from "@/rest/models";
import { useRequest } from "@/rest/request";
import { Box, Button, Card, Flex, Paper, Text, Title } from "@mantine/core";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";



interface EventsPageProps
{
    auth: AuthenticatedUser;
}


export default function EventsPage({ auth }: EventsPageProps): JSX.Element
{
    const accessToken = auth.accessToken;
    const requester = useCallback(async () => listEvents(accessToken), [accessToken]);
    const request = useRequest(requester);

    return (
        <RequestWrapper<SalesEvent[], string>
            requestResult={request}
            success={events => <ActualEventsPage events={events} auth={auth} />}
        />
    );
}


function ActualEventsPage(props: { auth: AuthenticatedUser, events: SalesEvent[] }): JSX.Element
{
    const { events } = props;

    return (
        <>
            <Paper mx='auto' p="md">
                <Title>
                    Upcoming Sale Events
                </Title>
                <Box my={50}>
                    <Flex direction="row" justify="center" align="center" gap="md" wrap="wrap">
                        {events.map(event => <EventViewer key={event.id} event={event} />)}
                    </Flex>
                </Box>
            </Paper>
        </>
    );
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
