import React, { useContext, useEffect, useMemo } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { AuthContext } from '../context/auth';
import { View } from '../components/View';

const Auth = () => {
    const { search } = useLocation<{ code?: string }>();
    const { loginWithCode, tokenFetchStatus, isLoggedin } = useContext(AuthContext);
    const s = new URLSearchParams(search);
    const history = useHistory();

    const authCode = useMemo(() => {
        if (!s.has('code')) {
            return null;
        }

        return s.get('code');
    }, [s]);

    useEffect(() => {
        if (authCode && tokenFetchStatus === 'idle') {
            loginWithCode(authCode);
        }
    }, [authCode, loginWithCode, tokenFetchStatus]);

    if (!s.has('code')) {
        history.replace('/');
    }

    if (isLoggedin) {
        history.replace('/');
    }

    return <View>Logging in</View>;
};

export default Auth;
