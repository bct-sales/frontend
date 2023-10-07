import { AuthenticatedSellerStatus } from "@/auth/types";
import CharityIcon from "@/components/CharityIcon";
import DonationIcon from "@/components/DonationIcon";
import PersistentStateGuard from "@/components/PersistentStateGuard";
import RequestWrapper from "@/components/RequestWrapper";
import { MoneyAmount } from "@/money-amount";
import { listItems } from "@/rest/items";
import { Item } from "@/rest/models";
import { useRequest } from "@/rest/request";
import { isDonation } from "@/settings";
import { Box, Button, Center, Group, Header, Paper, Stack, Table, Text, Title, createStyles } from "@mantine/core";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { AddItemState } from "./AddItemPage";
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
                success={response => <ActualItemsPage auth={auth} items={response.items} addItemUrl={response.links.add} generateLabelsUrl={response.links.generate_labels} eventId={eventId} />}
            />
        </>
    );
}

function ActualItemsPage(props: { auth: AuthenticatedSellerStatus, items: Item[], addItemUrl: string, generateLabelsUrl: string, eventId: number }): JSX.Element
{
    const { eventId } = props;
    const navigate = useNavigate();
    const { classes } = useStyles();

    return (
        <>
            <Header height={80} p='sm'>
                <Group position="apart">
                    <Title order={2} p={10}>
                        Sale Event {eventId} Items
                    </Title>
                    <Group position="right">
                        <Button onClick={onGenerateLabels}>
                            Generate Labels
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
                                            Id
                                        </th>
                                        <th>
                                            Description
                                        </th>
                                        <th>
                                            Category
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
                                    </tr>
                                </thead>
                                <tbody>
                                {[...props.items].reverse().map(renderItem)}
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
                <td>
                    {item.item_id}
                </td>
                <td className={classes.descriptionColumn}>
                    {item.description}
                </td>
                <td>
                    {item.category}
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
            </tr>
        );


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

    function onGenerateLabels()
    {
        const state: GenerateLabelsPageState = {
            url: props.generateLabelsUrl,
        };

        navigate('/labels', { state });
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
