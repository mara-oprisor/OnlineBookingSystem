import {Navigate, Outlet} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import Token from "../model/Token.ts";

interface AuthenticatedRouteGuardProps {
    requiredRole: string;
}
function AuthenticatedRouteGuard({requiredRole}: AuthenticatedRouteGuardProps) {
    const token = sessionStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" />;
    }

    try {
        const decodedToken = jwtDecode<Token>(token);

        const isIssuerValid = decodedToken.iss === "backend-spring";
        const isNotExpired = decodedToken.exp * 1000 > Date.now();
        const hasRequiredClaims = decodedToken.userId && decodedToken.role;

        if (!isIssuerValid || !isNotExpired || !hasRequiredClaims) {
            return <Navigate to="/auth" />;
        }

        if (requiredRole && decodedToken.role !== requiredRole) {
            return <Navigate to="/forbidden" />;
        }
    } catch (error) {
        console.log("Invalid token", error);
        return <Navigate to="/login" />;
    }

    return (
        <div>
            <Outlet />
        </div>
    );
}

export default AuthenticatedRouteGuard;