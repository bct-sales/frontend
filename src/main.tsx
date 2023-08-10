import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import * as pages from '@/pages';
import AuthGuard from './components/AuthGuard.tsx';


const root = document.getElementById('root');

if ( root )
{
    const router = createBrowserRouter([
        {
            path: '/',
            element: <App />,
            children: [
                {
                    path: "register",
                    element: <pages.RegisterPage />,
                },
                {
                    path: "login",
                    element: <pages.LoginPage />
                },
                {
                    path: "events/:eventId/items",
                    element: <AuthGuard role='seller' child={auth => <pages.ItemsPage auth={auth} />} />
                },
                {
                    path: "events",
                    element: <AuthGuard role='seller' child={auth => <pages.EventsPage auth={auth} />} />,
                },
                {
                    path: "edit-item",
                    element: <AuthGuard role='seller' child={auth => <pages.EditItemPage auth={auth} />} />,
                },
            ]
        },
    ]);

    ReactDOM.createRoot(root).render(
        <React.StrictMode>
            <RouterProvider router={router} />
        </React.StrictMode>,
    );
}
else
{
    console.error(`Fatal bug: could not find element with id="root"`);
}
