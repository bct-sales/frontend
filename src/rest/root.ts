import { getRootUrl } from "@/settings";
import axios from "axios";
import React from "react";
import { z } from "zod";


export const Root = z.object({
    links: z.object({
        login: z.string(),
        events: z.string(),
        items: z.string(),
    }).strict(),
}).strict();

export type Root = z.infer<typeof Root>;


export async function fetchRoot(): Promise<Root>
{
    const response = await axios.get<unknown>(getRootUrl());

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
