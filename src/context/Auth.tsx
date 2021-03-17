import React, { createContext, useContext, useEffect, useReducer } from 'react';
import cookie from 'js-cookie';
import dayjs from 'dayjs';
import useSWR from 'swr';
import { useHistory } from 'react-router-dom';
import { httpGet, loginWithCode, loginWithRefreshToken } from '../utils/fetcher';

const ACCESS_TOKEN = 'UNICORN_ACCESS_TOKEN';
const REFRESH_TOKEN = 'UNICORN_REFRESH_TOKEN';

interface SetAccessTokenAction {
    type: 'SET_ACCESS_TOKEN';
    token?: string;
}

interface LogoutAction {
    type: 'LOGOUT';
}

interface SaveUserAction {
    type: 'SAVE_USER';
    user: User;
}

interface SetFetchStatusAction {
    type: 'SET_FETCH_STATUS';
    status: FetchStatus;
}

export type Action = SetAccessTokenAction | LogoutAction | SaveUserAction | SetFetchStatusAction;

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

interface State {
    error: string;
    accessToken?: string;
    tokenFetchStatus: FetchStatus;
    user?: User;
    revalidateUser: () => void;
}

const defaultState: State = {
    ...((null as unknown) as State),
    tokenFetchStatus: 'idle',
};

type Dispatch = (action: Action) => void;
type UserProviderProps = { children: React.ReactNode };

const UserStateContext = createContext<State | undefined>(undefined);
const UserDispatchContext = createContext<Dispatch | undefined>(undefined);

const userReducer = (state: State, action: Action) => {
    const _state = { ...state };

    switch (action.type) {
        case 'SET_ACCESS_TOKEN':
            _state.accessToken = action.token;
            return _state;

        case 'SAVE_USER':
            _state.user = action.user;
            return _state;

        case 'LOGOUT':
            cookie.remove(REFRESH_TOKEN);
            cookie.remove(ACCESS_TOKEN);

            return defaultState;

        default:
            return state;
    }
};

export const UserProvider = ({ children }: UserProviderProps) => {
    const [state, dispatch] = useReducer(userReducer, defaultState);

    const { data: user, revalidate } = useSWR<User>(state.accessToken ? 'accounts/users/@me' : null, httpGet);

    useEffect(() => {
        if (user) {
            dispatch({ type: 'SAVE_USER', user });
        }
    }, [user]);

    useEffect(() => {
        if (window.location.pathname.startsWith('/login')) {
            return;
        }

        const token = cookie.get(REFRESH_TOKEN);

        if (!token) {
            cookie.remove(REFRESH_TOKEN);
            cookie.remove(ACCESS_TOKEN);
            return;
        }

        dispatch({ type: 'SET_FETCH_STATUS', status: 'pending' });

        loginWithRefreshToken(token)
            .then((d) => {
                cookie.set(REFRESH_TOKEN, d.refresh_token, {
                    expires: 5,
                });
                cookie.set(ACCESS_TOKEN, d.access_token, {
                    expires: dayjs(new Date()).add(d.expires_in, 'seconds').toDate(),
                });

                dispatch({ type: 'SET_FETCH_STATUS', status: 'resolved' });
                dispatch({ type: 'SET_ACCESS_TOKEN', token: d.access_token });
            })
            .catch((e) => {
                dispatch({ type: 'SET_FETCH_STATUS', status: 'rejected' });
                dispatch({ type: 'SET_ACCESS_TOKEN' });
            });
    }, []);

    return (
        <UserStateContext.Provider value={{ ...state, revalidateUser: revalidate }}>
            <UserDispatchContext.Provider value={dispatch}>{children}</UserDispatchContext.Provider>
        </UserStateContext.Provider>
    );
};

export const useUserState = () => {
    const context = useContext(UserStateContext);

    if (context === undefined) {
        throw new Error('useUserState must be used within a UserProvider');
    }

    return context;
};

export const useUserDispatch = () => {
    const context = useContext(UserDispatchContext);

    if (context === undefined) {
        throw new Error('useUserDispatch must be used within a UserProvider');
    }

    return context;
};

export const useLogin = (code: string | null) => {
    const dispatch = useUserDispatch();
    const history = useHistory();
    const { tokenFetchStatus } = useUserState();

    useEffect(() => {
        if (!code || tokenFetchStatus === 'pending') {
            return;
        }

        dispatch({ type: 'SET_FETCH_STATUS', status: 'pending' });

        loginWithCode(code)
            .then((d) => {
                cookie.set(REFRESH_TOKEN, d.refresh_token, {
                    expires: 5,
                });
                cookie.set(ACCESS_TOKEN, d.access_token, {
                    expires: dayjs(new Date()).add(d.expires_in, 'seconds').toDate(),
                });

                dispatch({ type: 'SET_FETCH_STATUS', status: 'resolved' });
                dispatch({ type: 'SET_ACCESS_TOKEN', token: d.access_token });
                history.push('/');
            })
            .catch((e) => {
                dispatch({ type: 'SET_FETCH_STATUS', status: 'rejected' });
                dispatch({ type: 'SET_ACCESS_TOKEN' });
            });
    }, [code]);
};
