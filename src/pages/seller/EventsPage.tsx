import { AuthenticatedSellerStatus } from "@/auth/types";
import EventViewer from "@/components/EventViewer";
import RequestWrapper from "@/components/RequestWrapper";
import { listEvents } from "@/rest/events";
import { SalesEvent } from "@/rest/models";
import { useRequest } from "@/rest/request";
import { useRestApiRoot } from "@/rest/root";
import { Box, Button, Card, Flex, Group, Paper, Title } from "@mantine/core";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ItemsPageState } from "./ItemsPage";


interface EventsPageProps
{
    auth: AuthenticatedSellerStatus;
}


export default function EventsPage({ auth }: EventsPageProps): JSX.Element
{
    const restRoot = useRestApiRoot();
    const accessToken = auth.accessToken;
    const requester = useCallback(async () => listEvents(restRoot.links.events, accessToken), [restRoot, accessToken]);
    const request = useRequest(requester);

    return (
        <RequestWrapper
            requestResult={request}
            success={result => <ActualEventsPage events={result.events} auth={auth} />}
        />
    );
}


function ActualEventsPage(props: { auth: AuthenticatedSellerStatus, events: SalesEvent[] }): JSX.Element
{
    const navigate = useNavigate();
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
                        {orderedEvents.map(renderEvent)}
                    </Flex>
                </Box>
            </Paper>
        </>
    );


    function renderEvent(event: SalesEvent): React.ReactNode
    {
        return (
            <Card withBorder p='md' miw={300} key={event.id}>
                <EventViewer event={event} />
                <Group position='right'>
                    <Button onClick={() => { goToItemsPage(event); } }>Edit Items</Button>
                </Group>
            </Card>
        );
    }

    function goToItemsPage(event: SalesEvent)
    {
        const state: ItemsPageState = {
            url: event.links.items,
            eventId: event.id
        };

        navigate(`/events/${event.id}/items`, { state });
    }
}
