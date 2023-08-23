import { AuthenticatedAdminStatus } from "@/auth/types";
import EventEditor from "@/components/EventEditor";
import StateGuard from "@/components/StateGuard";
import { BCTDate } from "@/date";
import { addEvent } from "@/rest/events";
import { SalesEvent } from "@/rest/models";
import { BCTTime } from "@/time";
import { ActionIcon, Group, Stack, Tooltip } from "@mantine/core";
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


export default function AddEventPage(props: { auth: AuthenticatedAdminStatus }): React.ReactNode
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


function ActualAddEventPage(props: { auth: AuthenticatedAdminStatus, url: string }): React.ReactNode
{
    const [ event, setEvent ] = useState<Omit<SalesEvent, 'id' | 'links'>>({
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
                <EventEditor<typeof event>
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
