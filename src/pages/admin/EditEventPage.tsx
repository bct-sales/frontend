import { AuthenticatedAdminStatus } from "@/auth/types";
import EventEditor, { EventEditorData } from "@/components/EventEditor";
import PersistentStateGuard from "@/components/PersistentStateGuard";
import { updateEvent } from "@/rest/events";
import { SalesEvent } from "@/rest/raw-models";
import { Button, Group, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useState } from "react";


export default function EditEventPage(props: { auth: AuthenticatedAdminStatus }): React.ReactNode
{
    return (
        <PersistentStateGuard
            cacheKey="admin/edit-even"
            child={state => <ActualEditEventPage auth={props.auth} event={state} />}
            predicate={predicate} />
    );


    function predicate(state: unknown) : state is SalesEvent
    {
        return SalesEvent.safeParse(state).success;
    }
}


function ActualEditEventPage(props: { auth: AuthenticatedAdminStatus, event: SalesEvent }): React.ReactNode
{
    const [ event, setEvent ] = useState<SalesEvent>(props.event);

    const eventEditorData: EventEditorData = {
        date: event.date,
        start_time: event.start_time,
        end_time: event.end_time,
        location: event.location,
        description: event.description,
        available: event.available,
    };

    return (
        <>
            <Stack maw={500} m='auto'>
                <EventEditor
                    event={eventEditorData}
                    onChange={onChange}
                />
                <Group position="right">
                    <Button onClick={update}>Update</Button>
                    <Button onClick={cancel}>Cancel</Button>
                </Group>
            </Stack>
        </>
    );


    function onChange(event: EventEditorData)
    {
        setEvent({
            ...props.event,
            date: event.date,
            start_time: event.start_time,
            end_time: event.end_time,
            location: event.location,
            description: event.description,
            available: event.available,
        });
    }

    function update()
    {
        updateEvent(props.auth.accessToken, event.links.edit, event).then(() => {
            notifications.show({ message: 'Event successfully updated' });
            history.back();
        }).catch(error => {
            console.error(error);
            notifications.show({ message: 'An error occurred' });
        });
    }

    function cancel()
    {
        history.back();
    }
}
