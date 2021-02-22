import React, { useContext, useEffect, useMemo } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useLogin } from '../context/Auth';
import { View } from '../components/View';

const Auth = () => {
    const { search } = useLocation<{ code?: string }>();
    const s = new URLSearchParams(search);
    const history = useHistory();

    const authorizationCode = useMemo(() => {
        if (!s.has('code')) {
            return null;
        }

        return s.get('code');
    }, [s]);

    useLogin(authorizationCode);

    if (!s.has('code')) {
        history.replace('/');
    }

    return <View>Logging in</View>;
};

export default Auth;
