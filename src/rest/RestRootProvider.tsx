import React from "react";
import { Root, RootContext, fetchRoot } from "./root";
import LoadingScreen from "@/components/LoadingScreen";


export default function RestRootProvider( props: { children: React.ReactNode })
{
    const [root, setRoot] = React.useState<Root | undefined>();

    React.useEffect(() => {
        void (async () => {
            const root = await fetchRoot();

            setRoot(root);
        })();
    }, []);

    if ( root !== undefined )
    {
        return (
            <RootContext.Provider value={root}>
                {props.children}
            </RootContext.Provider>
        );
    }
    else
    {
        return (
            <LoadingScreen />
        );
    }
}
