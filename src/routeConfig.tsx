import type { RouteObject } from "react-router";
import { App } from "./App";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { competitionAdminRoutes } from "./features/competitionAdmin";
import Auth from "./views/Auth";
import CompetitionDetails from "./views/CompetitionDetails";
import CompetitionsOverview from "./views/CompetitionOverview";
import CompetitionRegistration from "./views/CompetitionRegistration";
import CompetitionVote from "./views/CompetitionVote";
import CompetitionVoteOverview from "./views/CompetitionVoteOverview";
import { Logout } from "./views/Logout";
import Preferences from "./views/Preferences";

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
