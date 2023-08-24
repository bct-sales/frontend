import { AuthenticatedSellerStatus } from "@/auth/types";
import EventViewer from "@/components/EventViewer";
import RequestWrapper from "@/components/RequestWrapper";
import { ListEventsResult, listEvents } from "@/rest/events";
import { useRequest } from "@/rest/request";
import { useRestApiRoot } from "@/rest/root";
import { Box, Button, Card, Flex, Group, Paper, Stack, Title } from "@mantine/core";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ItemsPageState } from "./ItemsPage";
import { BCTDate } from "@/date";
import { SalesEvent } from "@/rest/models";
import { EditButton } from "@/components/EditButton";


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
            success={result => <ActualEventsPage data={result} auth={auth} />}
        />
    );
}


function ActualEventsPage(props: { auth: AuthenticatedSellerStatus, data: ListEventsResult }): JSX.Element
{
    const navigate = useNavigate();
    const orderedEvents: SalesEvent[] = [...props.data.events].sort(compareEvents);

    return (
        <>
            <Paper mx='auto' p="md" maw={1000}>
                <Group position="apart">
                    <Title>
                        Upcoming Sale Events
                    </Title>
                </Group>
                <Box my={50}>
                    <Stack>
                        <Flex direction="row" justify="flex-start" align="center" gap="md" wrap="wrap">
                            {orderedEvents.map(renderEvent)}
                        </Flex>
                    </Stack>
                </Box>
            </Paper>
        </>
    );


    function renderEvent(event: SalesEvent): React.ReactNode
    {
        return (
            <Card withBorder p='md' miw={300} key={event.sales_event_id}>
                <EventViewer event={event} />
                <Group position='right'>
                    <EditButton onClick={() => { goToItemsPage(event); }} tooltip="Manage items" />
                </Group>
            </Card>
        );
    }

    function goToItemsPage(event: SalesEvent)
    {
        const state: ItemsPageState = {
            url: event.links.items,
            eventId: event.sales_event_id,
        };

        navigate(`/events/${event.sales_event_id}/items`, { state });
    }

    function compareEvents(x: SalesEvent, y: SalesEvent): number
    {
        const dx = BCTDate.fromIsoString(x.date);
        const dy = BCTDate.fromIsoString(y.date);

        return dx.compare(dy);
    }
}
