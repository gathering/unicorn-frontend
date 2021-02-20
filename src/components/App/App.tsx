import React, { useContext } from 'react';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import CompetitionDetails from '../../views/CompetitionDetails';
import CompetitionsOverview from '../../views/CompetitionOverview';
import CompetitionRegisterEntry from '../../views/CompetitionRegisterEntry';
import CompetitionAdminOverview from '../../views/CompetitionAdminOverview';
import CompetitionAdminCreate from '../../views/CompetitionAdminCreate';
import CompetitionAdminEdit from '../../views/CompetitionAdminEdit';
import { getOscarUrl } from '../../utils/fetcher';
import Auth from '../../views/Auth';
import { AuthContext } from '../../context/auth';
import { ProtectedRoute } from '../ProtectedRoute';

const App = () => {
    const { isLoggedin, user } = useContext(AuthContext);

    return (
        <BrowserRouter>
            <div id="unicorn" className="flex flex-col min-h-screen bg-gray-200">
                <nav className="flex flex-wrap items-center justify-between flex-shrink-0 px-4 bg-white shadow-lg">
                    <Link to="/" href="https://gathering.org">
                        <img src="/images/tg_logo_liten.png" className="inline w-16 ml-1" alt="Back to homepage" />
                    </Link>

                    {isLoggedin ? (
                        <>{user?.display_name}</>
                    ) : (
                        <a
                            className="px-1 pt-1 mx-3 text-xl leading-8 text-gray-800 transition duration-200 ease-in-out border-b-2 border-transparent hover:text-black hover:border-orange-500"
                            href={getOscarUrl()}
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
                    <ProtectedRoute path="/competitions/:id/register" component={CompetitionRegisterEntry} />
                    <Route path="/competitions/:id" component={CompetitionDetails} />
                    <Route path="/login" component={Auth} />
                </Switch>
            </div>
        </BrowserRouter>
    );
};

export { App };
