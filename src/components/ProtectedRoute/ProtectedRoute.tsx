import React, { useMemo } from 'react';
import { Route } from 'react-router-dom';
import type { RouteProps } from 'react-router-dom';
import { useUserState } from '../../context/Auth';
import { hasPermission as objectHasPermission, Permission } from '../../utils/permissions';

interface Props extends RouteProps {
    requiredRole?: 'crew' | 'particpant' | 'jury' | 'anon' | 'other';
    requiredPermission?: Permission | Permission[];
}

export const ProtectedRoute = ({ requiredRole, requiredPermission, ...rest }: Props) => {
    const { user, permissions } = useUserState();

    const hasRole = useMemo(() => {
        if (!requiredRole) {
            return true;
        }

        if (!user) {
            return false;
        }

        return user.role.value === requiredRole;
    }, [user, requiredRole]);

    const hasPermission = useMemo(() => {
        if (!requiredPermission) {
            return true;
        }

        if (!permissions) {
            return false;
        }

        return objectHasPermission(requiredPermission, permissions);
    }, [permissions, requiredPermission]);

    if (!user || !hasRole || !hasPermission) {
        return null;
    }

    return <Route {...rest} />;
};
