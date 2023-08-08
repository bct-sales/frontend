import { useEffect, useState } from "react";


export interface InProgress
{
    ready: false;
}

export interface Ready<T>
{
    ready: true;

    payload: T;
}

export type RequestResponse<T> = InProgress | Ready<T>;

export type Requester<T> = () => Promise<T>;


export function inProgress(): InProgress
{
    return { ready: false };
}


export function ready<T>(payload: T): Ready<T>
{
    return { ready: true, payload };
}


export function useRequest<T>(requester: Requester<T>): RequestResponse<T>
{
    const [response, setResponse] = useState<RequestResponse<T>>(inProgress());

    useEffect(() => {
        void (async () => {
            const response = await requester();

            setResponse(ready<T>(response));
        })();
    }, [requester]);

    return response;
}
