import { AuthenticatedSellerStatus } from "@/auth/types";
import { DeleteButton } from "@/components/DeleteButton";
import { EditButton } from "@/components/EditButton";
import PersistentStateGuard from "@/components/PersistentStateGuard";
import RequestWrapper from "@/components/RequestWrapper";
import { deleteItem, listItems } from "@/rest/items";
import { useRequest } from "@/rest/request";
import { ActionIcon, Box, Button, Card, Center, Group, Header, Paper, Stack, Switch, Text, Title, Tooltip } from "@mantine/core";
import { ChangeEvent, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AddItemState } from "./AddItemPage";
import { z } from "zod";
import { EditItemState } from "./EditItemPage";
import { Item } from "@/rest/models";
import { MoneyAmount } from "@/money-amount";
import { IconGift, IconQrcode } from "@tabler/icons-react";
import { GenerateLabelsPageState } from "./GenerateLabelsPage";
import { notifications } from "@mantine/notifications";
import { isDonation } from "@/settings";


const ItemsPageState = z.object({
    url: z.string().url(),
    eventId: z.number().nonnegative(),
});

export type ItemsPageState = z.infer<typeof ItemsPageState>;


export default function ItemsPage(props: { auth: AuthenticatedSellerStatus }): JSX.Element
{
    return (
        <PersistentStateGuard predicate={predicate} child={createPage} cacheKey="seller/items" />
    );


    function predicate(state: unknown): state is ItemsPageState
    {
        return ItemsPageState.safeParse(state).success;
    }

    function createPage(state: ItemsPageState): JSX.Element
    {
        return (
            <ItemsPageWithState auth={props.auth} url={state.url} eventId={state.eventId} />
        );
    }
}


function ItemsPageWithState(props: { url: string, eventId: number, auth: AuthenticatedSellerStatus }): JSX.Element
{
    const { auth, url, eventId } = props;
    const { accessToken } = auth;
    const requester = useCallback(async () => listItems(url, accessToken), [accessToken, url]);
    const response = useRequest(requester);

    return (
        <>
            <RequestWrapper
                requestResult={response}
                success={response => <ActualItemsPage auth={auth} initialItems={response.items} addItemUrl={response.links.add} generateLabelsUrl={response.links.generate_labels} eventId={eventId} />}
            />
        </>
    );
}

function ActualItemsPage(props: { auth: AuthenticatedSellerStatus, initialItems: Item[], addItemUrl: string, generateLabelsUrl: string, eventId: number }): JSX.Element
{
    const { eventId } = props;
    const [ items, setItems ] = useState<Item[]>(props.initialItems);
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
                        <Tooltip label="Generate PDF">
                            <ActionIcon onClick={onGenerateLabels}>
                                <IconQrcode />
                            </ActionIcon>
                        </Tooltip>
                        <Button onClick={onBackToEventsPage}>
                            Back
                        </Button>
                    </Group>
                </Group>
            </Header>
            <Paper maw={800} mx='auto' p="md">
                <Box my={50}>
                    <Stack>
                        <Center>
                            <Button onClick={onAddItem} w='10em'>Add Item</Button>
                        </Center>
                        <Center>
                            <Stack w={600}>
                                {items.map(item => <ItemViewer key={item.item_id} item={item} showDelete={showDelete} onDelete={() => { onDelete(item) }} />)}
                            </Stack>
                        </Center>
                    </Stack>
                </Box>
            </Paper>
        </>
    );


    function onDelete(itemToBeDeleted: Item)
    {
        deleteItem(props.auth.accessToken, itemToBeDeleted.links.delete).then(() => {
            const remainingItems = items.filter(item => item.item_id !== itemToBeDeleted.item_id);
            setItems(remainingItems);
        }).catch((reason) => {
            console.error(reason);

            notifications.show({
                message: 'An error occurred while deleting the item'
            });
        });
    }

    function onGenerateLabels()
    {
        const state: GenerateLabelsPageState = {
            url: props.generateLabelsUrl,
        };

        navigate('/labels', { state });
    }

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
        const state: AddItemState = {
            addItemUrl: props.addItemUrl,
            salesEventId: props.eventId,
        };

        navigate('/add-item', { state });
    }
}


function ItemViewer({ item, showDelete, onDelete } : { item: Item, showDelete: boolean, onDelete: () => void }): JSX.Element
{
    const navigate = useNavigate();
    const { price_in_cents, description } = item;

    return (
        <>
            <Group position="apart">
                <Text w='75%'>
                    {description}
                </Text>
                <Group>
                    {renderGiftIcon()}
                    <Text>
                        {new MoneyAmount(price_in_cents).format()}
                    </Text>
                    {renderEditButton()}
                    {renderDeleteButton()}
                </Group>
            </Group>
        </>
    );


    function renderGiftIcon()
    {
        if ( isDonation(item.recipient_id) )
        {
            return (
                <IconGift />
            )
        }
        else
        {
            return (
                <></>
            );
        }
    }

    function renderEditButton()
    {
        if ( !showDelete )
        {
            return (
                <EditButton onClick={onEdit} tooltip="Edit item" />
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
        const state: EditItemState = item;
        navigate(`/edit-item`, { state });
    }
}
