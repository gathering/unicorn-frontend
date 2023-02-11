import React from 'react';
import { Outlet, RouteObject } from 'react-router-dom';
import { App } from './components/App';
import { ProtectedRoute } from './components/ProtectedRoute';
import Auth from './views/Auth';
import CompetitionAdminCreate from './views/CompetitionAdminCreate';
import CompetitionAdminDetails from './views/CompetitionAdminDetails';
import CompetitionAdminEdit from './views/CompetitionAdminEdit';
import CompetitionAdminEntry from './views/CompetitionAdminEntry';
import CompetitionAdminOverview from './views/CompetitionAdminOverview';
import CompetitionAdminResults from './views/CompetitionAdminResults';
import CompetitionDetails from './views/CompetitionDetails';
import CompetitionsOverview from './views/CompetitionOverview';
import CompetitionRegistration from './views/CompetitionRegistration';
import CompetitionVote from './views/CompetitionVote';
import CompetitionVoteOverview from './views/CompetitionVoteOverview';
import { Logout } from './views/Logout';
import Preferences from './views/Preferences';

export const routeConfig: RouteObject[] = [
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: <CompetitionsOverview />,
            },
            {
                path: 'admin/competitions',
                element: (
                    <ProtectedRoute requiredRole="crew">
                        <Outlet />
                    </ProtectedRoute>
                ),
                children: [
                    {
                        index: true,
                        element: <CompetitionAdminOverview />,
                    },
                    {
                        path: 'new',
                        element: <CompetitionAdminCreate />,
                    },
                    {
                        path: ':id',
                        children: [
                            {
                                index: true,
                                element: <CompetitionAdminDetails />,
                            },
                            {
                                path: 'edit',
                                element: <CompetitionAdminEdit />,
                            },
                            {
                                path: 'results',
                                element: <CompetitionAdminResults />,
                            },
                            {
                                path: ':eid',
                                element: <CompetitionAdminEntry />,
                            },
                        ],
                    },
                ],
            },
            {
                path: 'competitions/:id',
                children: [
                    {
                        index: true,
                        element: <CompetitionDetails />,
                    },
                    {
                        path: 'vote',
                        element: (
                            <ProtectedRoute>
                                <CompetitionVote />
                            </ProtectedRoute>
                        ),
                    },
                    {
                        path: 'register',
                        element: (
                            <ProtectedRoute>
                                <CompetitionRegistration />
                            </ProtectedRoute>
                        ),
                    },
                ],
            },
            { path: 'vote', element: <CompetitionVoteOverview /> },
            {
                path: 'preferences',
                element: (
                    <ProtectedRoute>
                        <Preferences />
                    </ProtectedRoute>
                ),
            },
            {
                path: 'login',
                element: <Auth />,
            },
            {
                path: 'logout',
                element: <Logout />,
            },
        ],
    },
];
