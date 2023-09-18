import { AuthenticatedSellerStatus } from "@/auth/types";
import PersistentStateGuard from "@/components/PersistentStateGuard";
import { z } from "zod";


const DownloadLabelsPageState = z.object({
    statusUrl: z.string().url(),
});

export type DownloadLabelsPageState = z.infer<typeof DownloadLabelsPageState>;


export default function DownloadLabelsPage(props: { auth: AuthenticatedSellerStatus }): JSX.Element
{
    return (
        <PersistentStateGuard predicate={predicate} child={createPage} cacheKey="seller/download" />
    );


    function predicate(state: unknown): state is DownloadLabelsPageState
    {
        return DownloadLabelsPageState.safeParse(state).success;
    }

    function createPage(state: DownloadLabelsPageState): JSX.Element
    {
        return (
            <ActualDownloadLabelsPage auth={props.auth} statusUrl={state.statusUrl}/>
        );
    }
}


function ActualDownloadLabelsPage(props: { auth: AuthenticatedSellerStatus, statusUrl: string }): JSX.Element
{
    const { statusUrl } = props;

    return (
        <>
            d
        </>
    );
}
