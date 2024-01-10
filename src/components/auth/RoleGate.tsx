"use client"

import {useCurrentRole} from "@/hooks/useCurrentRole";
import {FormError} from "@/components/auth/FormError";

interface RoleGateProps {
    children: React.ReactNode;
    isAdmin: boolean;
}

export const RoleGate = ({children, isAdmin}: RoleGateProps) => {
    const role = useCurrentRole();

    if(role !== isAdmin){
        return (
            <FormError message="У вас нет прав администратора!"/>
        )
    }

    return (
        <>
            {children}
        </>
    )
}