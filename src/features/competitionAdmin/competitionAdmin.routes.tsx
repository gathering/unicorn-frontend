import { Outlet, type RouteObject } from "react-router-dom";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import CompetitionAdminCreate from "./views/CompetitionAdminCreate";
import CompetitionAdminDetails from "./views/CompetitionAdminDetails";
import CompetitionAdminEdit from "./views/CompetitionAdminEdit";
import CompetitionAdminEntry from "./views/CompetitionAdminEntry";
import CompetitionAdminOverview from "./views/CompetitionAdminOverview";
import CompetitionAdminResults from "./views/CompetitionAdminResults";

export const competitionAdminRoutes: RouteObject = {
    path: "admin/competitions",
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
            path: "new",
            element: <CompetitionAdminCreate />,
        },
        {
            path: ":id",
            children: [
                {
                    index: true,
                    element: <CompetitionAdminDetails />,
                },
                {
                    path: "edit",
                    element: <CompetitionAdminEdit />,
                },
                {
                    path: "results",
                    element: <CompetitionAdminResults />,
                },
                {
                    path: ":eid",
                    element: <CompetitionAdminEntry />,
                },
            ],
        },
    ],
};
