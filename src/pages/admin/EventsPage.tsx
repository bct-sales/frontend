import { AuthenticatedAdmin } from "@/auth/types";
import { EditButton } from "@/components/EditButton";
import RequestWrapper from "@/components/RequestWrapper";
import { listEvents } from "@/rest/events";
import { SalesEvent } from "@/rest/models";
import { useRequest } from "@/rest/request";
import { ActionIcon, Box, Card, Flex, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { IconCirclePlus } from "@tabler/icons-react";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AddEventState } from "./AddEventPage";
import { EditEventState } from "./EditEventPage";


export default function EventsPage({ auth }: { auth: AuthenticatedAdmin }): JSX.Element
{
    const accessToken = auth.accessToken;
    const requester = useCallback(async () => listEvents(accessToken), [accessToken]);
    const request = useRequest(requester);

    return (
        <RequestWrapper
            requestResult={request}
            success={result => <ActualEventsPage events={result.events} addUrl={result.addEventUrl} auth={auth} />}
        />
    );
}


function ActualEventsPage(props: { auth: AuthenticatedAdmin, addUrl: string, events: SalesEvent[] }): JSX.Element
{
    const navigate = useNavigate();
    const { events } = props;

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
                            {events.map(event => <EventViewer key={event.id} event={event} />)}
                        </Flex>
                    </Stack>
                </Box>
            </Paper>
        </>
    );


    function onAddEvent()
    {
        const state = new AddEventState(props.addUrl);

        navigate('/admin/add-event', { state });
    }
}


function EventViewer({ event } : { event: SalesEvent }): JSX.Element
{
    const navigate = useNavigate();

    return (
        <>
            <Card withBorder p='md' miw={300}>
                <Title>
                    {event.date.toHumanReadableString()}
                </Title>
                <Text>
                    {event.startTime.toHumanReadableString()} - {event.endTime.toHumanReadableString()} ({event.location})
                </Text>
                <Text>
                    {event.description}
                </Text>
                <Group position="right">
                    <EditButton onClick={onEditEvent} />
                </Group>
            </Card>
        </>
    );


    function onEditEvent()
    {
        const url = `/admin/events/${event.id}`;
        const state = new EditEventState(event);

        navigate(url, { state });
    }
}
