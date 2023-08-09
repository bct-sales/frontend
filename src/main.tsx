import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import * as pages from '@/pages';


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
                    element: <pages.ItemsPage />
                },
                {
                    path: "events",
                    element: <pages.EventsPage />,
                }
            ]
        },
    ])
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
