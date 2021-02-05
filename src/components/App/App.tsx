import React, { useMemo } from 'react';
import { BrowserRouter, Link, matchPath, NavLink, useLocation } from 'react-router-dom';

const App = () => {
    return (
        <BrowserRouter>
            <div id="unicorn" className="bg-gray-200">
                <nav className="flex flex-wrap items-center flex-shrink-0 px-4 bg-white shadow">
                    <Link to="/" href="https://gathering.org">
                        <img src="/images/tg_logo_liten.png" className="inline w-16 ml-1" alt="Back to homepage" />
                    </Link>

                    <div className="flex ">
                        <a
                            className="px-1 pt-1 mx-3 text-xl leading-8 text-gray-800 transition duration-200 ease-in-out border-b-2 border-transparent hover:text-black hover:border-orange-500"
                            // href={getOscarUrl()}
                            rel="noreferrer noopener"
                        >
                            Log in
                        </a>
                    </div>
                </nav>
                <main>
                    <h1>wat</h1>
                </main>
            </div>
        </BrowserRouter>
    );
};

export { App };
