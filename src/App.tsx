import { motion } from "framer-motion";
import { useMemo } from "react";
import { Link, Outlet } from "react-router";
import { ToastContainer } from "react-toastify";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { useUserState } from "./context/Auth";

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
        <ErrorBoundary>
            <div id="unicorn" className="flex min-h-screen flex-col bg-gray-200 dark:bg-gray-700 dark:text-gray-100">
                <nav className="flex shrink-0 flex-wrap items-center justify-between bg-white px-4 shadow-lg dark:bg-gray-800">
                    <Link to="/" className="my-1 rounded-md pr-1 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <img src="/images/tg_logo_liten.png" className="ml-1 inline w-16" alt="Back to homepage" />
                    </Link>

                    {accessToken ? (
                        <motion.div className="flex" initial="rest" whileHover="hover" animate="rest">
                            <Link
                                to="/preferences"
                                className="ml-6 flex items-center rounded-xs p-1 px-2 text-indigo-700 underline transition-all duration-150 hover:bg-indigo-200 hover:text-indigo-900 dark:text-indigo-300 dark:hover:bg-indigo-700 dark:hover:text-indigo-100"
                            >
                                {user?.display_name}
                            </Link>
                            <a
                                href={`${import.meta.env.VITE_APP_API}/accounts/logout/?next=${
                                    window.location.origin
                                }/logout`}
                                className="ml-6 rounded-xs p-1 px-2 text-indigo-700 underline transition-all duration-150 hover:bg-indigo-200 hover:text-indigo-900 dark:text-indigo-300 dark:hover:bg-indigo-700 dark:hover:text-indigo-100"
                            >
                                Logout
                            </a>
                        </motion.div>
                    ) : (
                        <a
                            className="mx-3 border-b-2 border-transparent px-1 pt-1 text-xl leading-8 text-gray-800 transition duration-200 ease-in-out hover:border-orange-500 hover:text-black dark:text-gray-300 dark:hover:text-white"
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
        </ErrorBoundary>
    );
};

export { App };
