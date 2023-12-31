import { AuthenticatedSellerStatus } from "@/auth/types";
import ItemEditor, { ItemEditorData } from "@/components/ItemEditor";
import PersistentStateGuard from "@/components/PersistentStateGuard";
import { extractDetailFromException } from "@/rest/error-handling";
import { AddItemData, addItem } from "@/rest/items";
import { getDonationUserId, getItemCategories } from "@/settings";
import { Button, Card, Group } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { z } from "zod";


interface Props
{
    auth: AuthenticatedSellerStatus;
}

const AddItemState = z.object({
    addItemUrl: z.string(), // url
    salesEventId: z.number().nonnegative(),
}).strict();

export type AddItemState = z.infer<typeof AddItemState>;


export default function AddItemPage(props: Props): JSX.Element
{
    return (
        <PersistentStateGuard
            cacheKey="seller/add-item"
            child={state => <ActualAddItemPage auth={props.auth} url={state.addItemUrl} salesEventId={state.salesEventId} />}
            predicate={predicate} />
    );


    function predicate(state: unknown) : state is AddItemState
    {
        return AddItemState.safeParse(state).success;
    }
}


function ActualAddItemPage(props: { auth: AuthenticatedSellerStatus, url: string, salesEventId: number }): JSX.Element
{
    const [ itemData, setItemData ] = useState<ItemEditorData>({
        description: '',
        category: getItemCategories()[0],
        price_in_cents: 0,
        isDonation: false,
        isForCharity: false
    });
    const [ validFields, setValidFields ] = useState<boolean>(true);

    return (
        <>
            <Card maw={500} mx='auto' m='xl'>
                <ItemEditor data={itemData} onChange={onChange} />
                <Group position="right" mt='xl'>
                    <Button onClick={onAddItem} disabled={!validFields}>
                        Add
                    </Button>
                    <Button onClick={onCancel}>
                        Cancel
                    </Button>
                </Group>
            </Card>
        </>
    );


    function onAddItem()
    {
        const recipientId = itemData.isDonation ? getDonationUserId() : props.auth.userId;

        const data: AddItemData = {
            description: itemData.description,
            category: itemData.category,
            price_in_cents: itemData.price_in_cents,
            sales_event_id: props.salesEventId,
            recipient_id: recipientId,
            charity: itemData.isForCharity,
        };

        addItem(props.auth.accessToken, data, props.url).then(onSuccess).catch(onError);


        function onSuccess()
        {
            notifications.show({ message: 'Item successfully added' });
            history.back();
        }

        function onError(error: unknown)
        {
            const detail = extractDetailFromException(error);

            if ( detail !== null )
            {
                notifications.show({message: detail});
            }
            else
            {
                console.error(error);
                notifications.show({message: "Something went wrong"});
            }
        }
    }

    function onCancel()
    {
        history.back();
    }

    function onChange(data: ItemEditorData, valid: boolean)
    {
        setItemData(data);
        setValidFields(valid);
    }
}
