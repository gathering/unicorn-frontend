import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './components/App';
import { AuthContextProvider } from './context/auth';
import './index.css';

ReactDOM.render(
    <React.StrictMode>
        <AuthContextProvider>
            <App />
        </AuthContextProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
