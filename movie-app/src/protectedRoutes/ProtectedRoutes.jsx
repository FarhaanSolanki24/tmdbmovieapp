import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoutes({ children }) {
    const { sessionId } = useContext(AuthContext);

    if (!sessionId) {
        alert("⚠️ Please login first!");
        return <Navigate to="/login" />
    }

    return children
}