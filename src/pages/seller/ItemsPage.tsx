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
import { Box, Button, Card, Center, Flex, Group, Header, Paper, Space, Stack, Table, Text, Title, Tooltip, createStyles } from "@mantine/core";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { AddItemState } from "./AddItemPage";
import { GenerateLabelsPageState } from "./GenerateLabelsPage";
import { isEmail } from "@mantine/form";
import { LargeItemsPageState } from "./LargeItemsPage";



const useStyles = createStyles(() => ({
    headerColumn: {
        width: '0%',
    },
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
                success={response => <ActualItemsPage auth={auth} items={response.items} itemsUrl={url} addItemUrl={response.links.add} generateLabelsUrl={response.links.generate_labels} eventId={eventId} />}
            />
        </>
    );
}

function ActualItemsPage(props: { auth: AuthenticatedSellerStatus, items: Item[], itemsUrl: string, addItemUrl: string, generateLabelsUrl: string, eventId: number }): JSX.Element
{
    const { eventId } = props;
    const navigate = useNavigate();
    const { classes } = useStyles();

    return (
        <>
            {renderHeader()}
            <Paper maw={800} mx='auto' p="md">
                <Box my={50}>
                    <Stack>
                        <Center>
                            <Tooltip label="Click here to add a new item to the list">
                                <Button onClick={onAddItem} w='10em'>Add Item</Button>
                            </Tooltip>
                        </Center>
                        <Center>
                            <Flex direction="column" justify="flex-start" align="stretch" gap="md">
                                {[...props.items].reverse().map(renderItem)}
                            </Flex>
                        </Center>
                    </Stack>
                </Box>
            </Paper>
        </>
    );


    function renderHeader(): React.ReactNode
    {
        return (
            <Header height={80} p='sm'>
                <Group position="apart">
                    {renderTitle()}
                    {renderHeaderButtons()}
                </Group>
            </Header>
        );


        function renderTitle(): React.ReactNode
        {
            return (
                <Title order={2} p={10}>
                    Sale Event {eventId} Items
                </Title>
            );
        }

        function renderHeaderButtons(): React.ReactNode
        {
            const atLeastOneItem = props.items.length > 0;
            const isEnabled = atLeastOneItem;

            return (
                <Group position="right">
                    {renderGenerateLabelsButton()}
                    {/* {renderLargeItemsButton()} */}
                </Group>
            );


            function renderGenerateLabelsButton(): React.ReactNode
            {
                return (
                    <Tooltip label={generateLabelsTooltipLabel()}>
                        <Button onClick={onGenerateLabels} disabled={!isEnabled}>
                            Generate Labels
                        </Button>
                    </Tooltip>
                );
            }

            function renderLargeItemsButton(): React.ReactNode
            {
                return (
                    <Tooltip label={generateLargeItemsFormTooltipLabel()}>
                        <Button onClick={onGenerateLargeItemsForm}>
                            Large Items Form
                        </Button>
                    </Tooltip>
                );
            }

            function generateLabelsTooltipLabel(): string
            {
                if ( atLeastOneItem )
                {
                    return "Once you have entered all your items, press this button to generate labels for them";
                }
                else
                {
                    return "You need to enter at least one item before generating labels";
                }
            }

            function generateLargeItemsFormTooltipLabel(): string
            {
                return "Generate form for large items";
            }
        }
    }

    function renderItem(item: Item): React.ReactNode
    {
        return (
            <Card key={item.item_id}>
                <Table>
                    <tbody>
                        <tr>
                            <th className={classes.headerColumn}>Description</th>
                            <td>{item.description}</td>
                        </tr>
                        <tr>
                            <th className={classes.headerColumn}>Category</th>
                            <td>{item.category}</td>
                        </tr>
                    </tbody>
                </Table>
                <Space h="md" />
                <Group position="apart">
                    <Tooltip label="Unique ID for this item">
                        <Text fz="xs">
                            #{item.item_id}
                        </Text>
                    </Tooltip>
                    <Group>
                        {renderCharity()}
                        {renderDonation()}
                        {renderPrice()}
                    </Group>
                </Group>
            </Card>
        );


        function renderPrice(): React.ReactNode
        {
            return (
                <Tooltip label="Price of the item">
                    <Text>
                        {new MoneyAmount(item.price_in_cents).format()}
                    </Text>
                </Tooltip>
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
            itemsUrl: props.itemsUrl,
            url: props.generateLabelsUrl,
        };

        navigate('/labels', { state });
    }

    function onGenerateLargeItemsForm()
    {
        const state: LargeItemsPageState = {
            itemsUrl: props.itemsUrl,
        };

        navigate('/large-items', { state });
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
