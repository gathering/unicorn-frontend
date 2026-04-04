import cookie from "js-cookie";
import React, { useMemo } from "react";
import { useNavigate } from "react-router";
import { useUserState } from "../../context/Auth";
import { hasPermission as objectHasPermission, Permission } from "../../utils/permissions";

interface Props {
    requiredRole?: "crew" | "particpant" | "jury" | "anon" | "other";
    requiredPermission?: Permission | Permission[];
}

export const ProtectedRoute: React.FC<React.PropsWithChildren<Props>> = ({
    requiredRole,
    requiredPermission,
    children,
}) => {
    const { user, permissions } = useUserState();
    const navigate = useNavigate();

    const hasRefreshToken = Boolean(cookie.get("UNICORN_REFRESH_TOKEN"));

    const loginUrl = useMemo(() => {
        const url = new URL(import.meta.env.VITE_APP_API + "/oauth/authorize/");
        url.searchParams.append("client_id", import.meta.env.VITE_APP_CLIENT_ID as string);
        url.searchParams.append("response_type", "code");
        url.searchParams.append("redirect_uri", window.location.origin + "/login");
        return url.toString();
    }, []);

    const hasRole = useMemo(() => {
        if (!requiredRole) {
            return true;
        }

        if (!user) {
            return false;
        }

        return user.role.value === requiredRole;
    }, [user, requiredRole]);

    const hasPermission = useMemo(() => {
        if (!requiredPermission) {
            return true;
        }

        if (!permissions) {
            return false;
        }

        return objectHasPermission(requiredPermission, permissions);
    }, [permissions, requiredPermission]);

    if (!user) {
        if (hasRefreshToken) {
            return null;
        }

        return (
            <div className="flex flex-1 flex-col items-center justify-center">
                <p className="text-xl text-gray-600 dark:text-gray-300">Log in to continue</p>
                <a
                    href={loginUrl}
                    onClick={() =>
                        sessionStorage.setItem(
                            "unicorn_login_redirect",
                            window.location.pathname + window.location.search
                        )
                    }
                    className="mt-4 text-lg text-indigo-600 underline hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200"
                >
                    Log in
                </a>
            </div>
        );
    }

    if (!hasRole || !hasPermission) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center">
                <p className="text-xl text-gray-600 dark:text-gray-300">
                    You don&apos;t have permission to see this page
                </p>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 text-lg text-indigo-600 underline hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200"
                >
                    Go back
                </button>
            </div>
        );
    }

    return <>{children}</>;
};
