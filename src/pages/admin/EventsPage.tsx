import { AuthenticatedAdminStatus } from "@/auth/types";
import { EditButton } from "@/components/EditButton";
import RequestWrapper from "@/components/RequestWrapper";
import { listEvents } from "@/rest/events";
import { SalesEvent } from "@/rest/models";
import { useRequest } from "@/rest/request";
import { ActionIcon, Box, Card, Flex, Group, Paper, Stack, Text, Title, createStyles } from "@mantine/core";
import { IconCirclePlus } from "@tabler/icons-react";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AddEventState } from "./AddEventPage";
import { EditEventState } from "./EditEventPage";
import { useRestApiRoot } from "@/rest/root";
import EventViewer from "@/components/EventViewer";


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
            success={result => <ActualEventsPage events={result.events} addUrl={result.addEventUrl} auth={auth} />}
        />
    );
}


function ActualEventsPage(props: { auth: AuthenticatedAdminStatus, addUrl: string, events: SalesEvent[] }): JSX.Element
{
    const navigate = useNavigate();
    const { classes } = useStyles();
    const { events } = props;
    const orderedEvents = [...events].sort((x, y) => x.date.compare(y.date));

    return (
        <>
            <Paper mx='auto' p="md" maw={1000}>
                <Group position="apart">
                <Title>
                    Upcoming Sale Events
                </Title>
                <ActionIcon w={50} h={50} onClick={onAddEvent}>
                    <IconCirclePlus size={100} />
                </ActionIcon>
                </Group>
                <Box my={50}>
                    <Stack>
                        <Flex direction="row" justify="center" align="center" gap="md" wrap="wrap">
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
            <Card withBorder p='md' miw={300} key={event.id}>
                <EventViewer event={event} />
                <Group position="apart" mt='md'>
                    {renderAvailability(event)}
                    <EditButton onClick={() => { onEditEvent(event); }} />
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
        const url = `/admin/events/${event.id}`; // No HATEOAS here
        const state = new EditEventState(event);

        navigate(url, { state });
    }

    function onAddEvent()
    {
        const state = new AddEventState(props.addUrl);

        navigate('/admin/add-event', { state });
    }
}
