import { AuthenticatedSeller } from "@/auth/types";
import IntParamsGuard from "@/components/IntParamsGuard";
import RequestWrapper from "@/components/RequestWrapper";
import { listItems } from "@/rest/items";
import { Item } from "@/rest/models";
import { useRequest } from "@/rest/request";
import { ActionIcon, Box, Button, Card, Group, Header, Paper, Stack, Switch, Text, Title } from "@mantine/core";
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { ChangeEvent, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AddItemState } from "./AddItemPage";
import { EditButton } from "@/components/EditButton";

interface ItemsPageProps
{
    auth: AuthenticatedSeller;
}


export default function ItemsPage(props: ItemsPageProps): JSX.Element
{
    return (
        <IntParamsGuard child={createPage} paramName="eventId" />
    )


    function createPage(eventId: number): JSX.Element
    {
        return (
            <ItemsPageWithEventId auth={props.auth} eventId={eventId} />
        )
    }
}


function ItemsPageWithEventId(props: { eventId: number, auth: AuthenticatedSeller }): JSX.Element
{
    const { auth, eventId } = props;
    const { accessToken } = auth;
    const requester = useCallback(async () => listItems(accessToken, eventId), [accessToken, eventId]);
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

function ActualItemsPage(props: { auth: AuthenticatedSeller, items: Item[], addItemUrl: string, eventId: number }): JSX.Element
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
                <ActionIcon variant="outline" onClick={onDelete} w='2rem' h='2rem'>
                    <IconTrash />
                </ActionIcon>
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
        // NOP
    }
}
