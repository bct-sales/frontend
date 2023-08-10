import { Result } from "@/result";
import { useEffect, useState } from "react";


export interface RequestInProgress
{
    ready: false;
}

export interface SuccessfulRequest<T>
{
    ready: true;
    success: true;
    payload: T;
}

export interface FailedRequest<E>
{
    ready: true;
    success: false;
    error: E;
}

export type RequestResult<T, E> = RequestInProgress | SuccessfulRequest<T> | FailedRequest<E>;

export type Requester<T, E> = () => Promise<Result<T, E>>;


export function inProgress(): RequestInProgress
{
    return { ready: false };
}

export function success<T>(payload: T): SuccessfulRequest<T>
{
    return { ready: true, success: true, payload };
}

export function failure<E>(error: E): FailedRequest<E>
{
    return { ready: true, success: false, error };
}

export function useRequest<T, E>(requester: Requester<T, E>): [RequestResult<T, E>, (result: RequestResult<T, E>) => void]
{
    const [result, setResult] = useState<RequestResult<T, E>>(inProgress());

    useEffect(() => {
        void (async () => {
            const response = await requester();

            if ( response.success )
            {
                setResult(success(response.value));
            }
            else
            {
                setResult(failure<E>(response.error));
            }
        })();
    }, [requester]);

    return [result, setResult];
}
