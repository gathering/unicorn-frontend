import dayjs from "dayjs";
import cookie from "js-cookie";
import React, { createContext, useContext, useEffect, useReducer, useRef } from "react";
import { useNavigate } from "react-router";
import useSWR, { mutate as globalMutate } from "swr";
import { httpGet, loginWithCode, loginWithRefreshToken } from "../utils/fetcher";
import type { Permission } from "../utils/permissions";

const ACCESS_TOKEN = "UNICORN_ACCESS_TOKEN";
const REFRESH_TOKEN = "UNICORN_REFRESH_TOKEN";

interface SetAccessTokenAction {
    type: "SET_ACCESS_TOKEN";
    token?: string;
}

interface LogoutAction {
    type: "LOGOUT";
}

interface SaveUserAction {
    type: "SAVE_USER";
    user: User;
}

interface SetFetchStatusAction {
    type: "SET_FETCH_STATUS";
    status: FetchStatus;
}

interface SaveUserPermissionsAction {
    type: "SAVE_USER_PERMISSIONS";
    permissions: Permission[];
}

export type Action =
    | SetAccessTokenAction
    | LogoutAction
    | SaveUserAction
    | SetFetchStatusAction
    | SaveUserPermissionsAction;

type ObjType = "full" | "partial";

interface ROLE_CREW {
    value: "crew";
    label: "Crew";
}
interface ROLE_PARTICIPANT {
    value: "participant";
    label: "Participant";
}
interface ROLE_JURY {
    value: "jury";
    label: "Jury";
}
interface ROLE_ANON {
    value: "anon";
    label: "Anonymous";
}
interface ROLE_OTHER {
    value: "mortal";
    label: "Other";
}

export type Role = ROLE_CREW | ROLE_PARTICIPANT | ROLE_JURY | ROLE_ANON | ROLE_OTHER;

export interface User {
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

type FetchStatus = "idle" | "pending" | "resolved" | "rejected";

interface State {
    error: string;
    accessToken?: string;
    tokenFetchStatus: FetchStatus;
    permissions?: Permission[];
    user?: User;
    revalidateUser: () => void;
    forcedLoggedOut: boolean;
}

const defaultState: State = {
    ...(null as unknown as State),
    tokenFetchStatus: "idle",
};

type Dispatch = (action: Action) => void;
type UserProviderProps = { children: React.ReactNode };

const UserStateContext = createContext<State | undefined>(undefined);
const UserDispatchContext = createContext<Dispatch | undefined>(undefined);

const userReducer = (state: State, action: Action) => {
    const _state = { ...state };

    switch (action.type) {
        case "SET_ACCESS_TOKEN":
            _state.accessToken = action.token;
            return _state;

        case "SAVE_USER":
            _state.user = action.user;
            return _state;

        case "LOGOUT":
            cookie.remove(REFRESH_TOKEN);
            cookie.remove(ACCESS_TOKEN);

            return { ...defaultState, forcedLoggedOut: true };

        case "SAVE_USER_PERMISSIONS":
            _state.permissions = action.permissions;
            return _state;

        default:
            return state;
    }
};

export const UserProvider = ({ children }: UserProviderProps) => {
    const [state, dispatch] = useReducer(userReducer, defaultState);
    const refreshTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
    const hasInitialToken = useRef(false);

    const { data: user, mutate } = useSWR<User>(state.accessToken ? "accounts/users/@me" : null, httpGet);
    const { data: permissions } = useSWR<Permission[]>(state.accessToken ? "accounts/mypermissions" : null, httpGet);

    useEffect(() => {
        if (user) {
            dispatch({ type: "SAVE_USER", user });
        }
    }, [user]);

    useEffect(() => {
        if (permissions) {
            dispatch({ type: "SAVE_USER_PERMISSIONS", permissions });
        }
    }, [permissions]);

    // On the first token acquisition, revalidate all SWR caches.
    // This fixes a race condition where API data (e.g. competitions) is fetched
    // before auth completes, caching unauthenticated responses.
    // Subsequent token refreshes only update the cookie — no need to revalidate,
    // as that would reset forms the user may be editing.
    useEffect(() => {
        if (state.accessToken) {
            if (hasInitialToken.current) {
                return;
            }
            hasInitialToken.current = true;
            globalMutate(() => true);
        }
    }, [state.accessToken]);

    useEffect(() => {
        if (window.location.pathname.startsWith("/login") || window.location.pathname.startsWith("/logout")) {
            return;
        }

        const token = cookie.get(REFRESH_TOKEN);
        if (!token) {
            cookie.remove(REFRESH_TOKEN);
            cookie.remove(ACCESS_TOKEN);
            return;
        }

        function scheduleRefresh(expiresIn: number) {
            if (refreshTimerRef.current) {
                clearTimeout(refreshTimerRef.current);
            }

            // Refresh 60 seconds before expiry, with a minimum of 10 seconds
            const refreshIn = Math.max((expiresIn - 60) * 1000, 10_000);
            refreshTimerRef.current = setTimeout(() => {
                const rt = cookie.get(REFRESH_TOKEN);
                if (!rt) return;

                loginWithRefreshToken(rt)
                    .then((d) => {
                        cookie.set(REFRESH_TOKEN, d.refresh_token, { expires: 5 });
                        cookie.set(ACCESS_TOKEN, d.access_token, {
                            expires: dayjs(new Date()).add(d.expires_in, "seconds").toDate(),
                        });
                        dispatch({ type: "SET_ACCESS_TOKEN", token: d.access_token });
                        scheduleRefresh(d.expires_in);
                    })
                    .catch(() => {
                        dispatch({ type: "LOGOUT" });
                    });
            }, refreshIn);
        }

        dispatch({ type: "SET_FETCH_STATUS", status: "pending" });

        loginWithRefreshToken(token)
            .then((d) => {
                cookie.set(REFRESH_TOKEN, d.refresh_token, {
                    expires: 5,
                });
                cookie.set(ACCESS_TOKEN, d.access_token, {
                    expires: dayjs(new Date()).add(d.expires_in, "seconds").toDate(),
                });

                dispatch({ type: "SET_FETCH_STATUS", status: "resolved" });
                dispatch({ type: "SET_ACCESS_TOKEN", token: d.access_token });
                scheduleRefresh(d.expires_in);
            })
            .catch(() => {
                dispatch({ type: "SET_FETCH_STATUS", status: "rejected" });
                dispatch({ type: "SET_ACCESS_TOKEN" });
            });

        return () => {
            if (refreshTimerRef.current) {
                clearTimeout(refreshTimerRef.current);
            }
        };
    }, []);

    return (
        <UserStateContext.Provider value={{ ...state, revalidateUser: mutate }}>
            <UserDispatchContext.Provider value={dispatch}>{children}</UserDispatchContext.Provider>
        </UserStateContext.Provider>
    );
};

export const useUserState = () => {
    const context = useContext(UserStateContext);

    if (context === undefined) {
        throw new Error("useUserState must be used within a UserProvider");
    }

    return context;
};

export const useUserDispatch = () => {
    const context = useContext(UserDispatchContext);

    if (context === undefined) {
        throw new Error("useUserDispatch must be used within a UserProvider");
    }

    return context;
};

export const useLogin = (code: string | null) => {
    const dispatch = useUserDispatch();
    const navigate = useNavigate();
    const { tokenFetchStatus } = useUserState();

    useEffect(() => {
        if (!code || tokenFetchStatus === "pending") {
            return;
        }

        dispatch({ type: "SET_FETCH_STATUS", status: "pending" });

        loginWithCode(code)
            .then((d) => {
                cookie.set(REFRESH_TOKEN, d.refresh_token, {
                    expires: 5,
                });
                cookie.set(ACCESS_TOKEN, d.access_token, {
                    expires: dayjs(new Date()).add(d.expires_in, "seconds").toDate(),
                });

                dispatch({ type: "SET_FETCH_STATUS", status: "resolved" });
                dispatch({ type: "SET_ACCESS_TOKEN", token: d.access_token });
                const redirectPath = sessionStorage.getItem("unicorn_login_redirect");
                sessionStorage.removeItem("unicorn_login_redirect");
                navigate(redirectPath && redirectPath.startsWith("/") ? redirectPath : "/");
            })
            .catch(() => {
                dispatch({ type: "SET_FETCH_STATUS", status: "rejected" });
                dispatch({ type: "SET_ACCESS_TOKEN" });
            });
    }, [code, tokenFetchStatus, dispatch, navigate]);
};
