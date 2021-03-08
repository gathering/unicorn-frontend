import React, { useMemo } from 'react';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import CompetitionDetails from '../../views/CompetitionDetails';
import CompetitionsOverview from '../../views/CompetitionOverview';
import CompetitionRegistration from '../../views/CompetitionRegistration';
import CompetitionAdminOverview from '../../views/CompetitionAdminOverview';
import CompetitionAdminCreate from '../../views/CompetitionAdminCreate';
import { Logout } from '../../views/Logout';
import CompetitionAdminEdit from '../../views/CompetitionAdminEdit';
import { ProtectedRoute } from '../ProtectedRoute';
import { useUserState } from '../../context/Auth';
import { ErrorBoundary } from '../ErrorBoundary';
import Auth from '../../views/Auth';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

Sentry.init({
    dsn: 'https://d6acc50beb9d4de59400e6cf13e794c5@o131769.ingest.sentry.io/1252132',
    environment: import.meta.env.MODE,
});

const App = () => {
    const { user, accessToken } = useUserState();
    const loginUrl = useMemo(() => {
        const url = new URL(import.meta.env.VITE_APP_API + '/oauth/authorize/');
        url.searchParams.append('client_id', import.meta.env.VITE_APP_CLIENT_ID as string);
        url.searchParams.append('response_type', 'code');
        url.searchParams.append('redirect_uri', window.location.origin + '/login');

        return url.toString();
    }, []);

    return (
        <Sentry.ErrorBoundary fallback={<ErrorBoundary />}>
            <BrowserRouter>
                <div id="unicorn" className="flex flex-col min-h-screen bg-gray-200">
                    <nav className="flex flex-wrap items-center justify-between flex-shrink-0 px-4 bg-white shadow-lg">
                        <Link to="/" href="https://gathering.org">
                            <img src="/images/tg_logo_liten.png" className="inline w-16 ml-1" alt="Back to homepage" />
                        </Link>

                        {accessToken ? (
                            <div>
                                {user?.display_name}
                                <a
                                    href={`${import.meta.env.VITE_APP_API}/accounts/logout/?next=${
                                        window.location.origin
                                    }/logout`}
                                    className="p-1 px-2 ml-6 text-indigo-700 underline transition-all duration-150 rounded-sm hover:text-indigo-900 hover:bg-indigo-200"
                                >
                                    Logg ut
                                </a>
                            </div>
                        ) : (
                            <a
                                className="px-1 pt-1 mx-3 text-xl leading-8 text-gray-800 transition duration-200 ease-in-out border-b-2 border-transparent hover:text-black hover:border-orange-500"
                                href={loginUrl}
                                rel="noreferrer noopener"
                            >
                                Log in
                            </a>
                        )}
                    </nav>
                    <Switch>
                        <Route path="/" exact component={CompetitionsOverview} />
                        <ProtectedRoute
                            path="/admin/competitions/new"
                            requiredRole="crew"
                            component={CompetitionAdminCreate}
                        />
                        <ProtectedRoute
                            path="/admin/competitions/:id"
                            requiredRole="crew"
                            component={CompetitionAdminEdit}
                        />
                        <ProtectedRoute
                            path="/admin/competitions"
                            component={CompetitionAdminOverview}
                            requiredRole="crew"
                        />
                        <ProtectedRoute path="/competitions/:id/register" component={CompetitionRegistration} />
                        <Route path="/competitions/:id" component={CompetitionDetails} />
                        <Route path="/login" component={Auth} />
                        <Route path="/logout" component={Logout} />
                    </Switch>
                </div>
                <ToastContainer />
            </BrowserRouter>
        </Sentry.ErrorBoundary>
    );
};

export { App };
