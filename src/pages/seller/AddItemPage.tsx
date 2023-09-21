import { AuthenticatedSellerStatus } from "@/auth/types";
import ItemEditor, { ItemEditorData } from "@/components/ItemEditor";
import PersistentStateGuard from "@/components/PersistentStateGuard";
import { extractDetailFromException } from "@/rest/error-handling";
import { AddItemData, addItem } from "@/rest/items";
import { getDonationUserId } from "@/settings";
import { Button, Card, Group } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { z } from "zod";


interface Props
{
    auth: AuthenticatedSellerStatus;
}

const AddItemState = z.object({
    addItemUrl: z.string(),
    salesEventId: z.number().nonnegative(),
});

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
    const [ itemData, setItemData ] = useState<ItemEditorData>({ description: '', price_in_cents: 0, isDonation: false });

    return (
        <>
            <Card maw={500} mx='auto' m='xl'>
                <ItemEditor data={itemData} onChange={onChange} />
                <Group position="right" mt='xl'>
                    <Button onClick={onAddItem}>
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
        const recipientId = getDonationUserId();

        const data: AddItemData = {
            description: itemData.description,
            price_in_cents: itemData.price_in_cents,
            sales_event_id: props.salesEventId,
            recipient_id: recipientId,
        };

        addItem(props.auth.accessToken, data, props.url).then(onSuccess).catch(onError);
    }

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
            notifications.show({message: "Something went wrong"});
            console.log(error);
        }
    }

    function onCancel()
    {
        history.back();
    }

    function onChange(data: ItemEditorData)
    {
        setItemData(data);
    }
}
