import { AuthenticatedAdmin } from "@/auth/types";
import EventEditor from "@/components/EventEditor";
import StateGuard from "@/components/StateGuard";
import { BCTDate } from "@/date";
import { addEvent } from "@/rest/events";
import { SalesEvent } from "@/rest/models";
import { BCTTime } from "@/time";
import { ActionIcon, Button, Group, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCirclePlus, IconCircleX } from "@tabler/icons-react";
import { useState } from "react";


export class AddEventState
{
    public constructor(public readonly url: string)
    {
        // NOP
    }
}


export default function AddEventPage(props: { auth: AuthenticatedAdmin }): React.ReactNode
{
    return (
        <StateGuard
            child={state => <ActualAddEventPage auth={props.auth} url={state.url} />}
            predicate={predicate} />
    );


    function predicate(state: unknown) : state is AddEventState
    {
        return state instanceof AddEventState;
    }
}


function ActualAddEventPage(props: { auth: AuthenticatedAdmin, url: string }): React.ReactNode
{
    const [ event, setEvent ] = useState<Omit<SalesEvent, 'id' | 'links'>>({
        date: BCTDate.today(),
        startTime: BCTTime.fromIsoString('09:00'),
        endTime: BCTTime.fromIsoString('18:00'),
        location: '',
        description: '',
    });

    return (
        <>
            <Stack maw={500} m='auto'>
                <EventEditor<typeof event>
                    event={event}
                    onChange={onChange}
                />
                <Group position="right">
                    <ActionIcon onClick={update}>
                        <IconCirclePlus />
                    </ActionIcon>
                    <ActionIcon onClick={cancel}>
                        <IconCircleX />
                    </ActionIcon>
                </Group>
            </Stack>
        </>
    );


    function onChange(evt: typeof event)
    {
        setEvent(evt);
    }

    function update()
    {
        addEvent(props.auth.accessToken, props.url, event).then(() => {
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
