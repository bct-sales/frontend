import { AuthenticatedAdmin } from "@/auth/types";
import EventEditor from "@/components/EventEditor";
import StateGuard from "@/components/StateGuard";
import { updateEvent } from "@/rest/events";
import { SalesEvent } from "@/rest/models";
import { Button, Group, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useState } from "react";


export class EditEventState
{
    public constructor(public readonly event: SalesEvent)
    {
        // NOP
    }
}


export default function EditEventPage(props: { auth: AuthenticatedAdmin }): React.ReactNode
{
    return (
        <StateGuard
            child={state => <ActualEditEventPage auth={props.auth} event={state.event} />}
            predicate={predicate} />
    );


    function predicate(state: unknown) : state is EditEventState
    {
        return state instanceof EditEventState;
    }
}


function ActualEditEventPage(props: { auth: AuthenticatedAdmin, event: SalesEvent }): React.ReactNode
{
    const [ event, setEvent ] = useState<SalesEvent>(props.event);

    return (
        <>
            <Stack maw={500} m='auto'>
                <EventEditor
                    event={event}
                    onChange={onChange}
                />
                <Group position="right">
                    <Button onClick={update}>Update</Button>
                    <Button onClick={cancel}>Cancel</Button>
                </Group>
            </Stack>
        </>
    );


    function onChange(event: SalesEvent)
    {
        setEvent(event);
    }

    function update()
    {
        updateEvent(props.auth.accessToken, event).then(() => {
            notifications.show({ message: 'Event successfully updated' });
            history.back();
        }).catch(error => {
            console.error(error);
            notifications.show({ message: 'An error occurred' });
        })
    }

    function cancel()
    {
        history.back();
    }
}
