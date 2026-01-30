import { Navigate } from "react-router";

export default function AdminRoute({ children }) {
    const isAdmin = localStorage.getItem("admin") === "true";
    return isAdmin ? children : <Navigate to='/home' replace />;
}