import { AuthenticatedSellerStatus } from "@/auth/types";
import ItemEditor, { ItemEditorData } from "@/components/ItemEditor";
import PersistentStateGuard from "@/components/PersistentStateGuard";
import { extractDetailFromException } from "@/rest/error-handling";
import { updateItem } from "@/rest/items";
import { Item } from "@/rest/models";
import { getDonationUserId, isDonation } from "@/settings";
import { Button, Card, Group } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { z } from "zod";


const EditItemState = z.object({
    item_id: z.number().nonnegative(),
    description: z.string(),
    price_in_cents: z.number().nonnegative(),
    recipient_id: z.number().nonnegative(),
    sales_event_id: z.number().nonnegative(),
    owner_id: z.number().nonnegative(),
    charity: z.boolean(),
    links: z.object({
        edit: z.string(), // url
        delete: z.string(), // url
    }).strict()
}).strict();

export type EditItemState = z.infer<typeof EditItemState>;


export default function EditItemPage(props: { auth: AuthenticatedSellerStatus }): JSX.Element
{
    return (
        <PersistentStateGuard
            cacheKey="seller/edit-item"
            child={item => <ActualEditItemPage auth={props.auth} item={item} />}
            predicate={predicate} />
    );


    function predicate(state: unknown): state is EditItemState
    {
        const parseResult = EditItemState.safeParse(state);

        if ( parseResult.success )
        {
            return true;
        }
        else
        {
            console.error(parseResult.error);

            return false;
        }
    }
}


function ActualEditItemPage(props: { auth: AuthenticatedSellerStatus, item: Item }): JSX.Element
{
    const [ item, setItem ] = useState<Item>(props.item);
    const itemEditorData: ItemEditorData = {
        description: item.description,
        price_in_cents: item.price_in_cents,
        isDonation: isDonation(item.recipient_id),
        isForCharity: item.charity,
    };

    return (
        <>
            <Card maw={500} mx='auto' m='xl'>
                <ItemEditor data={itemEditorData} onChange={onChange} />
                <Group position="right" mt='xl'>
                    <Button onClick={onUpdateItem}>
                        Update
                    </Button>
                    <Button onClick={onCancel}>
                        Cancel
                    </Button>
                </Group>
            </Card>
        </>
    );


    function onUpdateItem()
    {
        const updatedItem: Item = {
            ...props.item,
            ...item,
        };

        updateItem(props.auth.accessToken, props.item.links.edit, updatedItem).then(onSuccess).catch(onError);
    }

    function onSuccess()
    {
        notifications.show({ message: 'Item successfully updated' });
        history.back();
    }

    function onError(error: unknown)
    {
        const detail = extractDetailFromException(error);

        if ( detail !== null )
        {
            notifications.show({title: 'Error', message: detail});
        }
        else
        {
            notifications.show({title: 'Error', message: "Something went wrong"});
            console.error(error);
        }
    }

    function onCancel()
    {
        history.back();
    }

    function onChange(data: ItemEditorData)
    {
        const newItem = {
            ...item,
            description: data.description,
            price_in_cents: data.price_in_cents,
            recipient_id: data.isDonation ? getDonationUserId() : props.auth.userId,
            charity: data.isForCharity,
        };

        setItem(newItem);
    }
}
