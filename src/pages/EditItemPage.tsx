import { AuthenticatedSeller } from "@/auth/types";
import ItemEditor from "@/components/ItemEditor";
import StateGuard from "@/components/StateGuard";
import { Item } from "@/rest/models";
import { Button } from "@mantine/core";
import { useState } from "react";


interface Props
{
    auth: AuthenticatedSeller;
}

export default function EditItemPage(props: Props): JSX.Element
{
    return (
        <StateGuard<Item>
            child={item => <ActualEditItemPage auth={props.auth} item={item} />}
            predicate={predicate} />
    )


    function predicate(state: unknown): state is Item
    {
        return state instanceof Item;
    }
}


function ActualEditItemPage(props: { auth: AuthenticatedSeller, item: Item }): JSX.Element
{
    const [ description, setDescription ] = useState<string>(props.item.description);
    const [ price, setPrice ] = useState<number>(props.item.price.totalCents);

    return (
        <>
            <ItemEditor description={description} priceInCents={price} onChange={onChange} />
            {createButton()}
        </>
    );


    function createButton(): JSX.Element
    {
        return (
            <Button onClick={onUpdateItem}>
                Update
            </Button>
        );
    }

    function onUpdateItem()
    {
        // NOP
    }

    function onChange(description: string, priceInCents: number)
    {
        setDescription(description);
        setPrice(priceInCents);
    }
}
