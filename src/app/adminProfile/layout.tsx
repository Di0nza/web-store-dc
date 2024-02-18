import {RoleGate} from "@/components/auth/RoleGate";

const AdminLayout = ({children}: {children: React.ReactNode }) => {
    return (
        <RoleGate isAdmin={true}>
            <div style={{backgroundColor:'#fafafa'}}>
                {children}
            </div>
        </RoleGate>
    );
}

export default AdminLayout;