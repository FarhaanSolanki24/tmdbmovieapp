import axios from "axios";
import { createContext, useState } from "react";

const API_KEY = "4755bfd52ed699ba65ceafa0d34e55d2";

export const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [sessionId, setSessionId] = useState(localStorage.getItem("session_id"))
    const [accountId, setAccountId] = useState(localStorage.getItem("account_id"))
    const [loading, setLoading] = useState(false)

    const login = async (username, password) => {
        setLoading(true);
        try {
            const tokenRes = await
                axios.get(`https://api.themoviedb.org/3/authentication/token/new?api_key=${API_KEY}`)
            const requestToken = tokenRes.data.request_token;

            await axios.post(`https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=${API_KEY}`,
                {
                    username,
                    password,
                    request_token: requestToken
                }
            )

            const sessionRes = await axios.post(`https://api.themoviedb.org/3/authentication/session/new?api_key=${API_KEY}`,
                {
                    request_token: requestToken
                }
            )
            const newSession = sessionRes.data.session_id
            localStorage.setItem("session_id", newSession)
            setSessionId(newSession)

            const accountRes = await axios.get(`https://api.themoviedb.org/3/account?api_key=${API_KEY}&session_id=${newSession}`,

            )
            const newAccount = accountRes.data.id
            localStorage.setItem("account_id", newAccount)
            setAccountId(newAccount)

            return { success: true };

        } catch (err) {
            console.log("Login Failed", err)
            return { success: false, message: "Invalid username or password" };
        } finally {
            setLoading(false)
        }
    }

    const logout = async () => {
        if (!sessionId) return;
        try {
            await axios.delete(
                `https://api.themoviedb.org/3/authentication/session?api_key=${API_KEY}`,
                { data: { session_id: sessionId } }
            );
        } catch (err) {
            console.error("Logout API failed:", err);
        }
        localStorage.removeItem("session_id");
        localStorage.removeItem("account_id");
        setSessionId(null);
        setAccountId(null);
    };

    return (
        <AuthContext.Provider value={{ sessionId, accountId, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}