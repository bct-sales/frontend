import { AuthenticatedAdminStatus } from "@/auth/types";
import EventEditor, { EventEditorData } from "@/components/EventEditor";
import PersistentStateGuard from "@/components/PersistentStateGuard";
import { BCTDate } from "@/date";
import { updateEvent } from "@/rest/events";
import { RawSalesEvent } from "@/rest/raw-models";
import { BCTTime } from "@/time";
import { Button, Group, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { z } from "zod";


const EditEventState = z.object({
    salesEventId: z.number().nonnegative(),
    date: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    location: z.string(),
    description: z.string(),
    available: z.boolean(),
    links: z.object({
        edit: z.string(),
        items: z.string(),
    })
});

export type EditEventState = z.infer<typeof EditEventState>;


export default function EditEventPage(props: { auth: AuthenticatedAdminStatus }): React.ReactNode
{
    return (
        <PersistentStateGuard
            cacheKey="admin/edit-even"
            child={state => <ActualEditEventPage auth={props.auth} event={state} />}
            predicate={predicate} />
    );


    function predicate(state: unknown) : state is EditEventState
    {
        return EditEventState.safeParse(state).success;
    }
}


function ActualEditEventPage(props: { auth: AuthenticatedAdminStatus, event: EditEventState }): React.ReactNode
{
    const [ event, setEvent ] = useState<EditEventState>(props.event);

    const eventEditorData: EventEditorData = {
        date: BCTDate.fromIsoString(event.date),
        startTime: BCTTime.fromIsoString(event.startTime),
        endTime: BCTTime.fromIsoString(event.endTime),
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
            date: event.date.toIsoString(),
            startTime: event.startTime.toIsoString(),
            endTime: event.endTime.toIsoString(),
            location: event.location,
            description: event.description,
            available: event.available,
        });
    }

    function update()
    {
        const data: RawSalesEvent = {
            available: event.available,
            date: event.date,
            start_time: event.startTime,
            end_time: event.endTime,
            description: event.description,
            links: event.links,
            location: event.location,
            sales_event_id: event.salesEventId,
        };

        updateEvent(props.auth.accessToken, data).then(() => {
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
