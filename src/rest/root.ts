import { rootUrl } from "@/settings";
import axios from "axios";
import React from "react";
import { z } from "zod";


export const Root = z.object({
    links: z.object({
        registration: z.string(),
        login: z.string(),
        events: z.string(),
    }).strict(),
}).strict();

export type Root = z.infer<typeof Root>;


export async function fetchRoot(): Promise<Root>
{
    const response = await axios.get<unknown>(rootUrl);

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
