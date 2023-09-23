import { AuthenticatedSellerStatus } from "@/auth/types";
import CharityIcon from "@/components/CharityIcon";
import { DeleteButton } from "@/components/DeleteButton";
import DonationIcon from "@/components/DonationIcon";
import { EditButton } from "@/components/EditButton";
import PersistentStateGuard from "@/components/PersistentStateGuard";
import RequestWrapper from "@/components/RequestWrapper";
import { MoneyAmount } from "@/money-amount";
import { deleteItem, listItems } from "@/rest/items";
import { Item } from "@/rest/models";
import { useRequest } from "@/rest/request";
import { isDonation } from "@/settings";
import { ActionIcon, Box, Button, Center, Group, Header, Paper, Stack, Switch, Table, Text, Title, Tooltip, createStyles } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconQrcode } from "@tabler/icons-react";
import { ChangeEvent, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { AddItemState } from "./AddItemPage";
import { EditItemState } from "./EditItemPage";
import { GenerateLabelsPageState } from "./GenerateLabelsPage";


const useStyles = createStyles(() => ({
    itemRow: {
        "&:nth-of-type(even)": {
            background: '#222',
        }
    },
    charityColumn: {
        width: '1%',
        textAlign: 'center',
    },
    donationColumn: {
        width: '1%',
        textAlign: 'center',
    },
    buttonColumn: {
        width: '1%',
        textAlign: 'center',
    },
    descriptionColumn: {
        width: '80%',
        textAlign: 'left',
    },
    priceColumn: {
        width: '10%',
        textAlign: 'right',
    },
    priceHeader: {
        textAlign: 'right',
    }
}));


const ItemsPageState = z.object({
    url: z.string(), // url
    eventId: z.number().nonnegative(),
}).strict();

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
    const { classes } = useStyles();

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
                            <Table>
                                <thead>
                                    <tr>
                                        <th>
                                            Description
                                        </th>
                                        <th>
                                            Charity
                                        </th>
                                        <th>
                                            Donation
                                        </th>
                                        <th className={classes.priceHeader}>
                                            Price
                                        </th>
                                        <th>
                                            Edit
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                {items.map(renderItem)}
                                </tbody>
                            </Table>
                        </Center>
                    </Stack>
                </Box>
            </Paper>
        </>
    );


    function renderItem(item: Item): React.ReactNode
    {
        return (
            <tr key={item.item_id} className={classes.itemRow}>
                <td className={classes.descriptionColumn}>
                    {item.description}
                </td>
                <td className={classes.charityColumn}>
                    {renderCharity()}
                </td>
                <td className={classes.donationColumn}>
                    {renderDonation()}
                </td>
                <td className={classes.priceColumn}>
                    {renderPrice()}
                </td>
                <td className={classes.buttonColumn}>
                    {renderButton()}
                </td>
            </tr>
        );


        function renderButton(): React.ReactNode
        {
            if ( showDelete )
            {
                return (
                    <DeleteButton onClick={() => { onDelete(item); }} tooltip="Deletes item irrevocably" />
                );
            }
            else
            {
                return (
                    <EditButton onClick={() => { onEdit(item); }} tooltip="Edit item" />
                );
            }
        }

        function renderPrice(): React.ReactNode
        {
            return (
                <Text>
                    {new MoneyAmount(item.price_in_cents).format()}
                </Text>
            );
        }

        function renderCharity(): React.ReactNode
        {
            if ( item.charity )
            {
                return (
                    <CharityIcon />
                );
            }
            else
            {
                return (
                    <></>
                );
            }
        }

        function renderDonation(): React.ReactNode
        {
            if ( isDonation(item.recipient_id) )
            {
                return (
                    <DonationIcon />
                )
            }
            else
            {
                return (
                    <></>
                );
            }
        }
    }

    function onEdit(item: Item)
    {
        const state: EditItemState = item;
        navigate(`/edit-item`, { state });
    }

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
