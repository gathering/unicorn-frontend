import React, { useMemo } from 'react';
import { Route } from 'react-router-dom';
import type { RouteProps } from 'react-router-dom';
import { useUserState } from '../../context/Auth';

interface Props extends RouteProps {
    requiredRole?: 'crew' | 'particpant' | 'jury' | 'anon' | 'other';
}

export const ProtectedRoute = ({ requiredRole, ...rest }: Props) => {
    const { user } = useUserState();
    const hasRole = useMemo(() => {
        if (!requiredRole) {
            return true;
        }

        if (!user) {
            return false;
        }

        return user.role.value === requiredRole;
    }, [user, requiredRole]);

    if (!user || !hasRole) {
        return null;
    }

    return <Route {...rest} />;
};
