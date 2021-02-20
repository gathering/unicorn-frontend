import get from 'lodash/get';

enum Method {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
}

export enum FetchState {
    IDLE,
    PENDING,
    RESOVLED,
    REJECTED,
}

export const API_URL = import.meta.env.VITE_APP_API_URL;
export const AUTH_URL = import.meta.env.VITE_APP_AUTH_URL;

const ACCESS_TOKEN = 'UNICORN_ACCESS_TOKEN';

const fetcher = async <T>(request: Request): Promise<T> => {
    const token = window.sessionStorage.getItem(ACCESS_TOKEN);

    if (token) {
        request.headers.append('authorization', 'Bearer ' + token);
    }

    return fetch(request).then<Promise<T>>((res) => {
        if (!res.ok) {
            return res.json().then((body) => {
                return Promise.reject({
                    status: res.status,
                    ok: false,
                    body,
                });
            });
        }

        return res.json();
    });
};

export const httpGet = <T>(url: string, args: RequestInit = { method: Method.GET }): Promise<T> => {
    const _url = url.startsWith('http') ? url : API_URL + url + '/';
    return fetcher<T>(new Request(_url, args));
};

export const httpPost = <T>(
    url: string,
    body?: string,
    args: RequestInit = {
        method: Method.POST,
        headers: {
            'Content-Type': 'application/json',
        },
        body,
    }
) => {
    const _url = url.startsWith('http') ? url : API_URL + url + '/';
    return fetcher<T>(new Request(_url, args));
};

export const httpPut = <T>(
    url: string,
    body?: string,
    args: RequestInit = {
        method: Method.PUT,
        headers: {
            'Content-Type': 'application/json',
        },
        body,
    }
) => {
    const _url = url.startsWith('http') ? url : API_URL + url + '/';
    return fetcher(new Request(_url, args));
};

export const httpDelete = <T>(
    url: string,
    body?: string,
    args: RequestInit = {
        method: Method.DELETE,
        headers: {
            'Content-Type': 'application/json',
        },
        body,
    }
) => {
    const _url = url.startsWith('http') ? url : API_URL + url + '/';
    return fetcher(new Request(_url, args));
};

export const fetchToken = (payload) => {
    const url = AUTH_URL + '/oauth/token/';
    const body = Object.entries(payload)
        .map(([key, value]) => encodeURIComponent(key) + '=' + encodeURIComponent(value))
        .join('&');
    return httpPost(url, body, {
        method: Method.POST,
        body,
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
    });
};

export const getOscarUrl = (state = '') => {
    const redirectUri = get(document, 'location.origin', '') + '/login';
    let uriState = '';

    if (typeof state === 'object') {
        uriState = JSON.stringify(state);
    } else {
        uriState = state;
    }

    return import.meta.env.VITE_APP_OSCAR_LINK + '&' + objectToQuery({ redirect_uri: redirectUri, state: uriState });
};

export const objectToQuery = (object = {}, arrayAsCsv = false) =>
    Object.entries(object)
        .reduce((params, [key, value]) => {
            if (!Array.isArray(value)) {
                params.set(key, value);
                return params;
            }
            if (arrayAsCsv) {
                params.set(key, value.join(','));
            } else {
                value.forEach((entry) => params.append(key, entry));
            }
            return params;
        }, new URLSearchParams())
        .toString()
        .replace(/%2C/g, ',');