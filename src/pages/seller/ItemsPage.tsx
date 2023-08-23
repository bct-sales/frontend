import { AuthenticatedSellerStatus } from "@/auth/types";
import { DeleteButton } from "@/components/DeleteButton";
import { EditButton } from "@/components/EditButton";
import RequestWrapper from "@/components/RequestWrapper";
import StateGuard from "@/components/StateGuard";
import { listItems } from "@/rest/items";
import { Item } from "@/rest/models";
import { useRequest } from "@/rest/request";
import { Box, Button, Card, Group, Header, Paper, Stack, Switch, Text, Title } from "@mantine/core";
import { ChangeEvent, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AddItemState } from "./AddItemPage";


interface ItemsPageProps
{
    auth: AuthenticatedSellerStatus;
}


export class ItemsPageState
{
    public constructor(public readonly url: string, public readonly eventId: number)
    {
        // NOP
    }
}


export default function ItemsPage(props: ItemsPageProps): JSX.Element
{
    return (
        <StateGuard predicate={predicate} child={createPage} />
    );


    function predicate(state: unknown): state is ItemsPageState
    {
        return state instanceof ItemsPageState;
    }

    function createPage(state: ItemsPageState): JSX.Element
    {
        return (
            <ItemsPageWithEventId auth={props.auth} url={state.url} eventId={state.eventId} />
        );
    }
}



function ItemsPageWithEventId(props: { url: string, eventId: number, auth: AuthenticatedSellerStatus }): JSX.Element
{
    const { auth, url, eventId } = props;
    const { accessToken } = auth;
    const requester = useCallback(async () => listItems(url, accessToken), [accessToken, url]);
    const response = useRequest(requester);

    return (
        <>
            <RequestWrapper
                requestResult={response}
                success={response => <ActualItemsPage auth={auth} items={response.items} addItemUrl={response.addItemUrl} eventId={eventId} />}
            />
        </>
    );
}

function ActualItemsPage(props: { auth: AuthenticatedSellerStatus, items: Item[], addItemUrl: string, eventId: number }): JSX.Element
{
    const { items, eventId } = props;
    const navigate = useNavigate();
    const [ showDelete, setShowDelete ] = useState<boolean>(false);

    return (
        <>
            <Header height={80} p='sm'>
                <Group position="apart">
                    <Title order={2} p={10}>
                        Sale Event {eventId} Items
                    </Title>
                    <Group position="right">
                        <Switch label="Delete mode" onChange={onToggleDeleteVisibility} />
                        <Button onClick={onBackToEventsPage}>
                            Back
                        </Button>
                    </Group>
                </Group>
            </Header>
            <Paper maw={800} mx='auto' p="md">
                <Box my={50}>
                    <Stack>
                        <Button onClick={onAddItem}>Add Item</Button>
                        {items.map(item => <ItemViewer key={item.id} item={item} showDelete={showDelete} />)}
                    </Stack>
                </Box>
            </Paper>
        </>
    );


    function onToggleDeleteVisibility(event: ChangeEvent<HTMLInputElement>)
    {
        const checked = event.target.checked;

        setShowDelete(checked);
    }

    function onBackToEventsPage()
    {
        navigate('/events');
    }

    function onAddItem()
    {
        const state = new AddItemState(props.addItemUrl, props.eventId);

        navigate('/add-item', { state });
    }
}


function ItemViewer({ item, showDelete } : { item: Item, showDelete: boolean }): JSX.Element
{
    const navigate = useNavigate();
    const { price, description } = item;

    return (
        <>
            <Card withBorder p='md'>
                <Group position="apart">
                    <Text w='75%'>
                        {description}
                    </Text>
                    <Group>
                        <Text>
                            {price.format()}
                        </Text>
                        {renderEditButton()}
                        {renderDeleteButton()}
                    </Group>
                </Group>
            </Card>
        </>
    );


    function renderEditButton()
    {
        if ( !showDelete )
        {
            return (
                <EditButton onClick={onEdit} />
            );
        }
        else
        {
            return <></>;
        }
    }

    function renderDeleteButton()
    {
        if ( showDelete )
        {
            return (
                <DeleteButton onClick={onDelete} />
            );
        }
        else
        {
            return <></>;
        }
    }

    function onEdit()
    {
        navigate(`/edit-item`, { state: item });
    }

    function onDelete()
    {
        // TODO
    }
}
