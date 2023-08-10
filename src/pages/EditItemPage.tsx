import { AuthenticatedSeller } from "@/auth/types";
import ItemEditor from "@/components/ItemEditor";
import { Item } from "@/rest/models";
import { Button } from "@mantine/core";
import { useState } from "react";
import { useLocation } from "react-router-dom";


interface Props
{
    auth: AuthenticatedSeller;
}

export default function EditItemPage(props: Props): JSX.Element
{
    const location = useLocation();
    const state = location.state as unknown;

    if ( typeof state === 'object' && state !== null && 'item' in state && state.item instanceof Item )
    {
        const item = state.item;

        return (
            <ActualEditItemPage auth={props.auth} item={item} />
        )
    }
    else
    {
        return (
            <>
                Error
            </>
        );
    }
}


function ActualEditItemPage(props: { auth: AuthenticatedSeller, item?: Item }): JSX.Element
{
    const [ description, setDescription ] = useState<string>(props.item?.description ?? '');
    const [ price, setPrice ] = useState<number>(props.item?.price.totalCents ?? 0);

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
