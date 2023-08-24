import { AuthenticatedAdminStatus } from "@/auth/types";
import { EditButton } from "@/components/EditButton";
import EventViewer from "@/components/EventViewer";
import RequestWrapper from "@/components/RequestWrapper";
import { BCTDate } from "@/date";
import { listEvents } from "@/rest/events";
import { SalesEvent } from "@/rest/raw-models";
import { useRequest } from "@/rest/request";
import { useRestApiRoot } from "@/rest/root";
import { ActionIcon, Box, Card, Flex, Group, Paper, Stack, Text, Title, Tooltip, createStyles } from "@mantine/core";
import { IconCirclePlus } from "@tabler/icons-react";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AddEventState } from "./AddEventPage";


const useStyles = createStyles(() => ({
    available: {
        color: '#0F0',
    },
    unavailable: {
        color: '#F00',
    }
}));


export default function EventsPage({ auth }: { auth: AuthenticatedAdminStatus }): JSX.Element
{
    const restRoot = useRestApiRoot();
    const accessToken = auth.accessToken;
    const requester = useCallback(async () => listEvents(restRoot.links.events, accessToken), [restRoot, accessToken]);
    const request = useRequest(requester);

    return (
        <RequestWrapper
            requestResult={request}
            success={result => <ActualEventsPage events={result.events} addUrl={result.links.add} auth={auth} />}
        />
    );
}


function ActualEventsPage(props: { auth: AuthenticatedAdminStatus, addUrl: string, events: SalesEvent[] }): JSX.Element
{
    const navigate = useNavigate();
    const { classes } = useStyles();
    const { events } = props;
    const orderedEvents: SalesEvent[] = [...events].sort(compareEvents);

    return (
        <>
            <Paper mx='auto' p="md" maw={1000}>
                <Group position="apart">
                <Title>
                    Upcoming Sale Events
                </Title>
                <Tooltip label="New event">
                    <ActionIcon w={50} h={50} onClick={onAddEvent}>
                        <IconCirclePlus size={100} />
                    </ActionIcon>
                </Tooltip>
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
                <Group position="apart" mt='md'>
                    {renderAvailability(event)}
                    <EditButton onClick={() => { onEditEvent(event); }} tooltip="Edit event" />
                </Group>
            </Card>
        );
    }

    function renderAvailability(event: SalesEvent): React.ReactNode
    {
        if ( event.available )
        {
            return (
                <Text className={classes.available}>Available</Text>
            );
        }
        else
        {
            return (
                <Text className={classes.unavailable}>Unavailable</Text>
            );
        }
    }

    function onEditEvent(event: SalesEvent)
    {
        const url = `/admin/events/${event.sales_event_id}`; // No HATEOAS here

        navigate(url, { state: event });
    }

    function onAddEvent()
    {
        const state: AddEventState = {
            url: props.addUrl,
        };

        navigate('/admin/add-event', { state });
    }

    function compareEvents(x: SalesEvent, y: SalesEvent): number
    {
        const dx = BCTDate.fromIsoString(x.date);
        const dy = BCTDate.fromIsoString(y.date);

        return dx.compare(dy);
    }
}
