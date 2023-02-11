import React from "react";
import type { RouteObject } from "react-router-dom";
import { App } from "./components/App";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Auth from "./views/Auth";
import CompetitionAdminOverview from "./features/competitionAdmin/views/CompetitionAdminOverview";
import CompetitionDetails from "./views/CompetitionDetails";
import CompetitionsOverview from "./views/CompetitionOverview";
import CompetitionRegistration from "./views/CompetitionRegistration";
import CompetitionVote from "./views/CompetitionVote";
import CompetitionVoteOverview from "./views/CompetitionVoteOverview";
import { Logout } from "./views/Logout";
import Preferences from "./views/Preferences";
import { competitionAdminRoutes } from "./features/competitionAdmin";

export const routeConfig: RouteObject[] = [
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <CompetitionsOverview />,
            },
            competitionAdminRoutes,
            {
                path: "competitions/:id",
                children: [
                    {
                        index: true,
                        element: <CompetitionDetails />,
                    },
                    {
                        path: "vote",
                        element: (
                            <ProtectedRoute>
                                <CompetitionVote />
                            </ProtectedRoute>
                        ),
                    },
                    {
                        path: "register",
                        element: (
                            <ProtectedRoute>
                                <CompetitionRegistration />
                            </ProtectedRoute>
                        ),
                    },
                ],
            },
            { path: "vote", element: <CompetitionVoteOverview /> },
            {
                path: "preferences",
                element: (
                    <ProtectedRoute>
                        <Preferences />
                    </ProtectedRoute>
                ),
            },
            {
                path: "login",
                element: <Auth />,
            },
            {
                path: "logout",
                element: <Logout />,
            },
        ],
    },
];
