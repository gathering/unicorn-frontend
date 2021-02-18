import React, { useContext, useMemo } from 'react';
import { Route, RouteProps } from 'react-router-dom';
import { AuthContext } from '../../context/auth';

interface Props extends RouteProps {
    requiredRole?: 'crew' | 'particpant' | 'jury' | 'anon' | 'other';
}

export const ProtectedRoute = ({ requiredRole, ...rest }: Props) => {
    const { isLoggedin, user } = useContext(AuthContext);
    const hasRole = useMemo(() => {
        if (!requiredRole) {
            return true;
        }

        if (!user) {
            return false;
        }

        return user.role.value === requiredRole;
    }, [user, requiredRole]);

    if (!isLoggedin || !user || !hasRole) {
        return null;
    }

    return <Route {...rest} />;
};
