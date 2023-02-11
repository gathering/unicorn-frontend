import React, { useContext, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLogin } from '../context/Auth';
import { View } from '../components/View';

const Auth = () => {
    const { search } = useLocation<{ code?: string }>();
    const s = new URLSearchParams(search);
    const navigate = useNavigate();

    const authorizationCode = useMemo(() => {
        if (!s.has('code')) {
            return null;
        }

        return s.get('code');
    }, [s]);

    useLogin(authorizationCode);

    if (!s.has('code')) {
        navigate('/', { replace: true });
    }

    return <View>Logging in</View>;
};

export default Auth;
