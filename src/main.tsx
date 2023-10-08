import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import * as pages from '@/pages';
import AuthGuard from './components/AuthGuard.tsx';
import { Provider } from 'react-redux';
import { persistor, store } from './redux/store.ts';
import { PersistGate } from 'redux-persist/integration/react';


const root = document.getElementById('root');

if ( root )
{
    const router = createBrowserRouter([
        {
            path: '/',
            element: <App />,
            children: [
                {
                    path: "/login",
                    element: <pages.LoginPage />
                },
                {
                    path: "/events/:eventId/items",
                    element: <AuthGuard role='seller' child={auth => <pages.seller.ItemsPage auth={auth} />} />
                },
                {
                    path: "/events",
                    element: <AuthGuard role='seller' child={auth => <pages.seller.EventsPage auth={auth} />} />,
                },
                {
                    path: "/add-item",
                    element: <AuthGuard role='seller' child={auth => <pages.seller.AddItemPage auth={auth} />} />,
                },
                {
                    path: "/labels",
                    element: <AuthGuard role='seller' child={auth => <pages.seller.GenerateLabelsPage auth={auth} />} />,
                },
                {
                    path: "/download",
                    element: <AuthGuard role='seller' child={auth => <pages.seller.DownloadLabelsPage auth={auth} />} />,
                },
                {
                    path: "/admin/events/:eventId",
                    element:<AuthGuard role='admin' child={auth => <pages.admin.EditEventPage auth={auth} />} />,
                },
                {
                    path: "/admin/events",
                    element:<AuthGuard role='admin' child={auth => <pages.admin.EventsPage auth={auth} />} />,
                },
                {
                    path: "/admin/add-event",
                    element:<AuthGuard role='admin' child={auth => <pages.admin.AddEventPage auth={auth} />} />,
                },
                {
                    path: "/cashier/sale",
                    element:<AuthGuard role='cashier' child={auth => <pages.cashier.SalePage auth={auth} />} />,
                },
                {
                    path: "/",
                    element: <pages.EntryPage />,
                },
            ]
        },
    ]);

    ReactDOM.createRoot(root).render(
        <React.StrictMode>
            <Provider store={store}>
                <PersistGate persistor={persistor} loading={"Loading!"}>
                    <RouterProvider router={router} />
                </PersistGate>
            </Provider>
        </React.StrictMode>,
    );
}
else
{
    console.error(`Fatal bug: could not find element with id="root"`);
}
