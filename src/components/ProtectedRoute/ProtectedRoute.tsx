import React, { useMemo } from 'react';
import { useUserState } from '../../context/Auth';
import { hasPermission as objectHasPermission, Permission } from '../../utils/permissions';

interface Props {
    requiredRole?: 'crew' | 'particpant' | 'jury' | 'anon' | 'other';
    requiredPermission?: Permission | Permission[];
}

export const ProtectedRoute: React.FC<React.PropsWithChildren<Props>> = ({
    requiredRole,
    requiredPermission,
    children,
}) => {
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

    return <>{children}</>;
};
