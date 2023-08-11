import { AuthenticatedAdmin } from "@/auth/types";
import EventEditor from "@/components/EventEditor";
import StateGuard from "@/components/StateGuard";
import { SalesEvent } from "@/rest/models";


class EditEventState
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
    return (
        <EventEditor
            date={props.event.date}
            startTime={props.event.startTime}
            endTime={props.event.endTime}
            location={props.event.location}
            description={props.event.description}
        />
    );
}
