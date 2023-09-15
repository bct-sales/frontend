import { AuthenticatedSellerStatus } from "@/auth/types";
import PersistentStateGuard from "@/components/PersistentStateGuard";
import SheetSpecificationsEditor from "@/components/SheetSpecificationsEditor";
import { Button, Center, Group, Paper, Title } from "@mantine/core";
import React from "react";
import { z } from "zod";


const GenerateLabelsPageState = z.object({
    url: z.string().url(),
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
            <ActualGenerateLabelsPage auth={props.auth} generateLabelsUrl={state.url} />
        );
    }
}

function ActualGenerateLabelsPage(props: { auth: AuthenticatedSellerStatus, generateLabelsUrl: string }): JSX.Element
{
    // const navigate = useNavigate();
    const [sheetSpecs, setSheetSpecs] = React.useState({
        sheetWidth: 210,
        sheetHeight: 297,
        labelWidth: 80,
        labelHeight: 50,
        columnCount: 3,
        rowCount: 8,
    })

    return (
        <>
            <Paper mx='auto' p="md" maw={1000}>
            <Group position="apart">
                    <Title>
                        Generate Labels
                    </Title>
                </Group>
                <SheetSpecificationsEditor data={sheetSpecs} onChange={setSheetSpecs} />
                <Center>
                    <Button mx='auto' onClick={onGenerateLabels}>Generate Labels</Button>
                </Center>
            </Paper>
        </>
    );


    function onGenerateLabels()
    {
        console.log(props.generateLabelsUrl);
    }
}
