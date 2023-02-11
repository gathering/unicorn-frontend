import React from 'react';
import ReactDOM from 'react-dom/client';
import setupLocatorUI from '@locator/runtime';
import { UserProvider } from './context/Auth';
import '@reach/dialog/styles.css';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routeConfig } from './routeConfig';

if (import.meta.env.MODE === 'development') {
    setupLocatorUI();
}

const router = createBrowserRouter(routeConfig);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <UserProvider>
            <RouterProvider router={router} />
        </UserProvider>
    </React.StrictMode>
);
