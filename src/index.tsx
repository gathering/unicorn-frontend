import React from 'react';
import ReactDOM from 'react-dom/client';
import setupLocatorUI from '@locator/runtime';
import { App } from './components/App';
import { UserProvider } from './context/Auth';
import '@reach/dialog/styles.css';
import './index.css';

if (import.meta.env.MODE === 'development') {
    setupLocatorUI();
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <UserProvider>
            <App />
        </UserProvider>
    </React.StrictMode>
);
