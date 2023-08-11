import { AuthenticatedAdmin } from "@/auth/types";
import { EditButton } from "@/components/EditButton";
import RequestWrapper from "@/components/RequestWrapper";
import { listEvents } from "@/rest/events";
import { SalesEvent } from "@/rest/models";
import { useRequest } from "@/rest/request";
import { Box, Card, Flex, Group, Paper, Text, Title } from "@mantine/core";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { EditEventState } from "./EditEventPage";


export default function EventsPage({ auth }: { auth: AuthenticatedAdmin }): JSX.Element
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


function ActualEventsPage(props: { auth: AuthenticatedAdmin, events: SalesEvent[] }): JSX.Element
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
                <Title>
                    {event.date.format()}
                </Title>
                <Text>
                    {event.startTime.format()} - {event.endTime.format()} ({event.location})
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
        const state = new EditEventState(event);

        navigate(`/admin/events/${event.id}`, { state });
    }
}
