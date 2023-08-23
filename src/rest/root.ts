import axios from "axios";
import React from "react";
import { z } from "zod";
import { restUrl } from "./url";


export const Root = z.object({
    links: z.object({
        registration: z.string(),
        login: z.string(),
        events: z.string(),
    }),
});

export type Root = z.infer<typeof Root>;


export async function fetchRoot(): Promise<Root>
{
    const url = restUrl('/');
    const response = await axios.get<unknown>(url);

    return Root.parse(response.data);
}


export const RootContext = React.createContext<Root | undefined>(undefined);


export function useRestApiRoot()
{
    const root = React.useContext(RootContext);

    if ( root === undefined )
    {
        throw new Error('Bug: no REST API root set');
    }

    return root;
}
