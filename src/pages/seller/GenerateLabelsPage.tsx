import { AuthenticatedSellerStatus } from "@/auth/types";
import PersistentStateGuard from "@/components/PersistentStateGuard";
import { z } from "zod";


const GenerateLabelsPageState = z.object({
    eventId: z.number().nonnegative(),
});

export type GenerateLabelsPageState = z.infer<typeof GenerateLabelsPageState>;


export default function GenerateLabelsPage(props: { auth: AuthenticatedSellerStatus }): JSX.Element
{
    return (
        <PersistentStateGuard predicate={predicate} child={createPage} cacheKey="seller/labels" />
    );


    function predicate(state: unknown): state is GenerateLabelsPageState
    {
        return GenerateLabelsPageState.safeParse(state).success;
    }

    function createPage(state: GenerateLabelsPageState): JSX.Element
    {
        return (
            <ActualGenerateLabelsPage auth={props.auth} eventId={state.eventId} />
        );
    }
}

function ActualGenerateLabelsPage(props: { auth: AuthenticatedSellerStatus, eventId: number }): JSX.Element
{
    // const navigate = useNavigate();

    return (
        <>
            {props.eventId}
        </>
    );
}
