import { AuthenticatedSellerStatus } from "@/auth/types";
import { DeleteButton } from "@/components/DeleteButton";
import { MoneyAmount } from "@/money-amount";
import * as rest from '@/rest';
import { useRestApiRoot } from "@/rest/root";
import { RegisterSaleData } from "@/rest/sales";
import { isDonation } from "@/settings";
import { Box, Button, Card, Center, Paper, Table, Text, TextInput, createStyles } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconAlertCircle } from "@tabler/icons-react";
import React, { ChangeEvent } from "react";


const useStyles = createStyles(() => ({
    itemRow: {
        "&:nth-of-type(even)": {
            background: '#222',
        }
    },
    recipientColumn: {
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
    itemIdColumn: {
        width: '1%',
    },
    alreadySold: {
        background: '#FAA',
        color: 'black',
    }
}));

export interface Props
{
    auth: AuthenticatedSellerStatus;
}

interface ItemData
{
    item_id: number;
    description: string;
    price_in_cents: number;
    recipient_id: number;
    charity: boolean;
    has_been_sold: boolean;
}

export default function SalePage(props: Props): JSX.Element
{
    const [selectedItems, setSelectedItems] = React.useState<ItemData[]>([]);
    const [currentItem, setCurrentItem] = React.useState<string>("");
    const inputBoxRef = React.useRef<HTMLInputElement>(null);
    const { classes } = useStyles();
    const restApiRoot = useRestApiRoot();
    const baseUrl = restApiRoot.links.items;
    const saleUrl = restApiRoot.links.sales;

    const totalCost = selectedItems.map(item => item.price_in_cents).reduce((x, y) => x + y, 0);

    return (
        <>
            <Center>
                <Paper maw={800}>
                    <Center>
                        <Card m='xl' p='xl'>
                            <TextInput error={isValidCurrentItem() ? undefined : 'Invalid'} label="Item ID" ref={inputBoxRef} autoFocus={true} onChange={onChangeCurrentItem} onKeyDown={onKeyDown} />
                            <Center>
                                <Button onClick={onAddItem} mt='sm'>
                                    Add
                                </Button>
                            </Center>
                            <Box mt='xl'>
                                <Text weight='bold' fz='lg'>Total</Text>
                                <Center>
                                    <Text fz="2rem">
                                        {new MoneyAmount(totalCost).format()}
                                    </Text>
                                </Center>
                            </Box>
                            <Center mt='xl'>
                                <Button onClick={onFinalize}>
                                    Finalize Order
                                </Button>
                            </Center>
                        </Card>
                    </Center>
                    <Card m='xl'>
                        <Table>
                            <thead>
                                <tr>
                                    <th className={classes.itemIdColumn}>
                                        Item ID
                                    </th>
                                    <th className={classes.descriptionColumn}>
                                        Description
                                    </th>
                                    <th className={classes.priceColumn}>
                                        Price
                                    </th>
                                    <th className={classes.recipientColumn}>
                                        Recipient
                                    </th>
                                    <th className={classes.buttonColumn}>

                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedItems.map(renderItem)}
                            </tbody>
                        </Table>
                        <Center>
                            <Button mt='xl' onClick={onRemoveAll}>
                                Remove All
                            </Button>
                        </Center>
                    </Card>
                </Paper>
            </Center>
        </>
    );


    function onKeyDown(event: React.KeyboardEvent)
    {
        const key = event.key;

        if ( key === "Enter" || key === 'x' || key === 'X' )
        {
            onAddItem();
            event.preventDefault();
        }
    }

    function onFinalize()
    {
        const data: RegisterSaleData = {
            item_ids: selectedItems.map(item => item.item_id)
        };

        rest.registerSale(props.auth.accessToken, data, saleUrl).then(() => {
            setSelectedItems([]);
            selectAllTextInInputBox();
            notifications.show({
                message: 'Sale registered',
                color: 'green',
             });
        }).catch(reason => {
            console.error(reason);
            notifications.show({
                message: 'FAILED to register sale',
                color: 'red',
                icon: <IconAlertCircle />
            })
        });
    }

    function onRemoveAll()
    {
        setSelectedItems([]);
    }

    function isValidCurrentItem()
    {
        return /^\d+$/.test(currentItem);
    }

    function onChangeCurrentItem(event: ChangeEvent<HTMLInputElement>)
    {
        const newValue = event.target.value;

        setCurrentItem(newValue);
    }

    function onAddItem()
    {
        if ( !isValidCurrentItem() )
        {
            notifications.show({message: "Invalid item id"});
            return;
        }

        const currentItemId = parseInt(currentItem);

        if ( selectedItems.some(item => item.item_id === currentItemId ) )
        {
            notifications.show({message: "Item already in list"});
            return;
        }

        rest.getItem(props.auth.accessToken, baseUrl, currentItemId).then(itemData => {
            const newSelectedItems = [itemData, ...selectedItems];
            setSelectedItems(newSelectedItems);
        }).catch(reason => {
            console.error(reason);
            notifications.show({message: 'Failed to add item'});
        });

        selectAllTextInInputBox();
    }

    function selectAllTextInInputBox()
    {
        inputBoxRef.current?.select();
    }

    function renderItem(item: ItemData, itemIndex: number): React.ReactNode
    {
        return (
            <tr key={item.item_id} className={determineClassName()}>
                <td>
                    {item.item_id}
                </td>
                <td>
                    {item.description}
                </td>
                <td>
                    {new MoneyAmount(item.price_in_cents).format()}
                </td>
                <td>
                    {isDonation(item.recipient_id) ? 'BCT' : item.recipient_id}
                </td>
                <td>
                    <DeleteButton onClick={() => { onRemoveItem( itemIndex ); } } tooltip="Remove" />
                </td>
            </tr>
        );


        function determineClassName(): string | undefined
        {
            if ( item.has_been_sold )
            {
                return classes.alreadySold;
            }
            else
            {
                return undefined;
            }
        }
    }

    function onRemoveItem(itemIndex: number)
    {
        const remainingItems = [
            ...selectedItems.slice(0, itemIndex),
            ...selectedItems.slice(itemIndex + 1, selectedItems.length)
        ];

        setSelectedItems(remainingItems);
    }
}
