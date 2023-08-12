import { AuthenticatedSeller } from "@/auth/types";
import RequestWrapper from "@/components/RequestWrapper";
import { listEvents } from "@/rest/events";
import { SalesEvent } from "@/rest/models";
import { useRequest } from "@/rest/request";
import { Box, Button, Card, Flex, Paper, Text, Title } from "@mantine/core";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";



interface EventsPageProps
{
    auth: AuthenticatedSeller;
}


export default function EventsPage({ auth }: EventsPageProps): JSX.Element
{
    const accessToken = auth.accessToken;
    const requester = useCallback(async () => listEvents(accessToken), [accessToken]);
    const request = useRequest(requester);

    return (
        <RequestWrapper
            requestResult={request}
            success={result => <ActualEventsPage events={result.events} auth={auth} />}
        />
    );
}


function ActualEventsPage(props: { auth: AuthenticatedSeller, events: SalesEvent[] }): JSX.Element
{
    const { events } = props;
    const orderedEvents = [...events].sort((x, y) => x.date.compare(y.date));

    return (
        <>
            <Paper mx='auto' p="md">
                <Title>
                    Upcoming Sale Events
                </Title>
                <Box my={50}>
                    <Flex direction="row" justify="center" align="center" gap="md" wrap="wrap">
                        {orderedEvents.map(event => <EventViewer key={event.id} event={event} />)}
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
                <Button fullWidth fz='xl' mb='lg' onClick={goToItemsPage}>
                    {event.date.toHumanReadableString()}
                </Button>
                <Text>
                    {event.startTime.toHumanReadableString()} - {event.endTime.toHumanReadableString()} ({event.location})
                </Text>
                <Text>
                    {event.description}
                </Text>
            </Card>
        </>
    );


    function goToItemsPage()
    {
        navigate(`/events/${event.id}/items`);
    }
}
