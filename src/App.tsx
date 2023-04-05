import React, { useEffect, useMemo } from "react";
import { Link, Outlet } from "react-router-dom";
import * as Sentry from "@sentry/react";
import { ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import { useUserState } from "./context/Auth";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "react-toastify/dist/ReactToastify.css";

Sentry.init({
    dsn: "https://d6acc50beb9d4de59400e6cf13e794c5@o131769.ingest.sentry.io/1252132",
    environment: import.meta.env.MODE,
    integrations: [new Sentry.Integrations.Breadcrumbs({ console: false })],
});

const App = () => {
    const { user, accessToken } = useUserState();
    const loginUrl = useMemo(() => {
        const url = new URL(import.meta.env.VITE_APP_API + "/oauth/authorize/");
        url.searchParams.append("client_id", import.meta.env.VITE_APP_CLIENT_ID as string);
        url.searchParams.append("response_type", "code");
        url.searchParams.append("redirect_uri", window.location.origin + "/login");

        return url.toString();
    }, []);

    return (
        <Sentry.ErrorBoundary fallback={<ErrorBoundary />}>
            <div id="unicorn" className="flex flex-col min-h-screen bg-gray-200 dark:bg-gray-700 dark:text-gray-100">
                <nav className="flex flex-wrap items-center justify-between flex-shrink-0 px-4 bg-white shadow-lg dark:bg-gray-800">
                    <Link to="/" className="pr-1 my-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                        <img src="/images/tg_logo_liten.png" className="inline w-16 ml-1" alt="Back to homepage" />
                    </Link>

                    {accessToken ? (
                        <motion.div className="flex" initial="rest" whileHover="hover" animate="rest">
                            <Link
                                to="/preferences"
                                className="flex items-center p-1 px-2 ml-6 text-indigo-700 underline transition-all duration-150 rounded-sm dark:text-indigo-300 hover:text-indigo-900 hover:bg-indigo-200 dark:hover:text-indigo-100 dark:hover:bg-indigo-700"
                            >
                                {user?.display_name}
                            </Link>
                            <a
                                href={`${import.meta.env.VITE_APP_API}/accounts/logout/?next=${
                                    window.location.origin
                                }/logout`}
                                className="p-1 px-2 ml-6 text-indigo-700 underline transition-all duration-150 rounded-sm dark:text-indigo-300 hover:text-indigo-900 hover:bg-indigo-200 dark:hover:text-indigo-100 dark:hover:bg-indigo-700"
                            >
                                Logout
                            </a>
                        </motion.div>
                    ) : (
                        <a
                            className="px-1 pt-1 mx-3 text-xl leading-8 text-gray-800 transition duration-200 ease-in-out border-b-2 border-transparent dark:text-gray-300 hover:text-black dark:hover:text-white hover:border-orange-500"
                            href={loginUrl}
                            rel="noreferrer noopener"
                        >
                            Log in
                        </a>
                    )}
                </nav>

                <Outlet />
            </div>
            <ToastContainer />
        </Sentry.ErrorBoundary>
    );
};

export { App };
