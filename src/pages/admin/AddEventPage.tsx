import { AuthenticatedAdminStatus } from "@/auth/types";
import EventEditor, { EventEditorData } from "@/components/EventEditor";
import PersistentStateGuard from "@/components/PersistentStateGuard";
import { BCTDate } from "@/date";
import { addEvent } from "@/rest/events";
import { RawSalesEvent } from "@/rest/raw-models";
import { BCTTime } from "@/time";
import { ActionIcon, Group, Stack, Tooltip } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCirclePlus, IconCircleX } from "@tabler/icons-react";
import { useState } from "react";
import { z } from "zod";


const AddEventState = z.object({
    url: z.string(),
});

export type AddEventState = z.infer<typeof AddEventState>;


export default function AddEventPage(props: { auth: AuthenticatedAdminStatus }): React.ReactNode
{
    return (
        <PersistentStateGuard
            cacheKey="admin/add-event"
            child={state => <ActualAddEventPage auth={props.auth} url={state.url} />}
            predicate={predicate} />
    );


    function predicate(state: unknown) : state is AddEventState
    {
        return AddEventState.safeParse(state).success;
    }
}


function ActualAddEventPage(props: { auth: AuthenticatedAdminStatus, url: string }): React.ReactNode
{
    const [ event, setEvent ] = useState<EventEditorData>({
        date: BCTDate.today(),
        startTime: BCTTime.fromIsoString('09:00'),
        endTime: BCTTime.fromIsoString('18:00'),
        location: '',
        description: '',
        available: true,
    });

    return (
        <>
            <Stack maw={500} m='auto'>
                <EventEditor
                    event={event}
                    onChange={onChange}
                />
                <Group position="right">
                    <Tooltip label="Create new event" openDelay={500}>
                        <ActionIcon onClick={add} size='xl'>
                            <IconCirclePlus size={100} />
                        </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Cancel" openDelay={500}>
                        <ActionIcon onClick={cancel} size='xl'>
                            <IconCircleX size={100} />
                        </ActionIcon>
                    </Tooltip>
                </Group>
            </Stack>
        </>
    );


    function onChange(evt: typeof event)
    {
        setEvent(evt);
    }

    function add()
    {
        const data: Omit<RawSalesEvent, 'sales_event_id' | 'links'> = {
            available: event.available,
            date: event.date.toIsoString(),
            start_time: event.startTime.toIsoString(),
            end_time: event.endTime.toIsoString(),
            description: event.description,
            location: event.location,
        }

        addEvent(props.auth.accessToken, props.url, data).then(() => {
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
