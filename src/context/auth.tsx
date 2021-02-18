import React, { useState, useMemo, useEffect, useContext } from 'react';
import { httpGet, fetchToken } from '../utils/fetcher';

interface AuthContext {
    tokenFetchStatus: FetchStatus;
    userFetchStatus: FetchStatus;
    isLoggedin: boolean;
    loginWithCode: Function;
    logout: Function;
    user?: User;
}

interface RefreshResponse {}

interface Token {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
}

interface TokenResponse {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
    token_type: string;
}

type ObjType = 'full' | 'partial';

interface ROLE_CREW {
    value: 'crew';
    label: 'Crew';
}
interface ROLE_PARTICIPANT {
    value: 'participant';
    label: 'Participant';
}
interface ROLE_JURY {
    value: 'jury';
    label: 'Jury';
}
interface ROLE_ANON {
    value: 'anon';
    label: 'Anonymous';
}
interface ROLE_OTHER {
    value: 'mortal';
    label: 'Other';
}

export type Role = ROLE_CREW | ROLE_PARTICIPANT | ROLE_JURY | ROLE_ANON | ROLE_OTHER;

interface User {
    obj_type: ObjType;
    uuid: string;
    display_name_format: { value: string; label: string };
    username: string;
    url: string;
    accepted_location: boolean;
    row: null | string;
    seat: null | string;
    crew: null | string;
    display_name: string;
    email: string;
    role: Role;
}

type FetchStatus = 'idle' | 'pending' | 'resolved' | 'rejected';

export const AuthContext = React.createContext((null as unknown) as AuthContext);

const ACCESS_TOKEN = 'UNICORN_ACCESS_TOKEN';
const ACCESS_TOKEN_EXP = 'ACCESS_TOKEN_EXP';
const REFRESH_TOKEN = 'UNICORN_REFRESH_TOKEN';

const AuthContextProvider: React.FC = ({ children }) => {
    const [tokenData, setTokenData] = useState<Token>();
    const [user, updateUser] = useState<User>();
    const [tokenFetchStatus, setTokenFetchStatus] = useState<FetchStatus>('idle');
    const [userFetchStatus, setUserFetchStatus] = useState<FetchStatus>('idle');

    const logout = (message?: { type: 'info' | 'error'; text: string }) => {
        setTokenData(undefined);
        updateUser(undefined);
        window.sessionStorage.removeItem(ACCESS_TOKEN);
        window.sessionStorage.removeItem(ACCESS_TOKEN_EXP);
        window.localStorage.removeItem(REFRESH_TOKEN);

        const s = new URLSearchParams();

        if (message) {
            s.append('a', 'logout');
            s.append('t', message.type);
            s.append('msg', message.text);
        }

        window.location.href = '/?' + s.toString();
    };

    const fetchUser = () => {
        setUserFetchStatus('pending');
        httpGet<User>('accounts/users/@me')
            .then((d) => {
                updateUser(d);
                setUserFetchStatus('resolved');
            })
            .catch((e) => {
                setUserFetchStatus('rejected');
            });
    };

    const login = (accessToken: string, refreshToken: string, expiresIn: number) => {
        const expiresAt = Math.floor(Number(expiresIn) + Date.now() / 1000);

        window.sessionStorage.setItem(ACCESS_TOKEN, accessToken);
        window.sessionStorage.setItem(ACCESS_TOKEN_EXP, expiresAt.toString());
        window.localStorage.setItem(REFRESH_TOKEN, refreshToken);

        setTokenData({
            accessToken,
            refreshToken,
            expiresAt: Number(expiresAt),
        });

        if (user) {
            updateUser(user);
        } else {
            fetchUser();
        }
    };

    const isLoggedin = useMemo(() => (tokenData && tokenData.expiresAt > Date.now() / 1000) || false, [tokenData]);

    const loginWithCode = (code?: string) => {
        fetchToken({
            client_secret: import.meta.env.SNOWPACK_PUBLIC_CLIENT_SECRET,
            client_id: import.meta.env.SNOWPACK_PUBLIC_CLIENT_ID,
            grant_type: 'authorization_code',
            redirect_uri: document.location.origin + '/login',
            code,
        })
            .then((d: TokenResponse) => {
                setTokenFetchStatus('resolved');
                login(d.access_token, d.refresh_token, d.expires_in);
            })
            .catch((e) => {
                setTokenFetchStatus('rejected');
                logout();
            });
    };

    useEffect(() => {
        if (tokenData && !isLoggedin) {
            logout();
        }
    }, [tokenData, isLoggedin]);

    // check for tokens on startup
    useEffect(() => {
        const accessTokenStr = window.sessionStorage.getItem(ACCESS_TOKEN);
        const accessTokenExp = window.sessionStorage.getItem(ACCESS_TOKEN_EXP);
        const refreshToken = window.localStorage.getItem(REFRESH_TOKEN);

        if (accessTokenStr && accessTokenExp) {
            // try to refresh token if it is expired or will expire within 5 minutes
            if (Number(accessTokenExp) < Date.now() / 1000 - 300 || !refreshToken) {
                setUserFetchStatus('pending');
                fetchToken({
                    client_secret: import.meta.env.SNOWPACK_PUBLIC_CLIENT_SECRET,
                    client_id: import.meta.env.SNOWPACK_PUBLIC_CLIENT_ID,
                    grant_type: 'refresh_token',
                    refresh_token: refreshToken,
                    redirect_uri: document.location.origin + '/login',
                })
                    .then((d: TokenResponse) => {
                        setUserFetchStatus('resolved');
                        login(d.access_token, d.refresh_token, d.expires_in);
                    })
                    .catch((e) => {
                        setUserFetchStatus('rejected');
                        logout();
                    });
            }

            if (accessTokenStr && Number(accessTokenExp) && refreshToken) {
                login(accessTokenStr, refreshToken, Number(accessTokenExp));
            }
        } else if (refreshToken) {
            setTokenFetchStatus('pending');
            fetchToken({
                client_secret: import.meta.env.SNOWPACK_PUBLIC_CLIENT_SECRET,
                client_id: import.meta.env.SNOWPACK_PUBLIC_CLIENT_ID,
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
                redirect_uri: document.location.origin + '/login',
            })
                .then((d: TokenResponse) => {
                    setTokenFetchStatus('resolved');
                    login(d.access_token, d.refresh_token, d.expires_in);
                })
                .catch((e) => {
                    setTokenFetchStatus('rejected');
                    logout();
                });
        }
    }, []);

    const context = {
        loginWithCode,
        isLoggedin,
        logout,
        user,
        accessToken: tokenData?.accessToken,
        tokenFetchStatus,
        userFetchStatus,
    };

    return <AuthContext.Provider value={context}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export { AuthContextProvider };
