import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../AllCss/Login.css"

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { sessionId, accountId, login, loading } = useContext(AuthContext);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        const result = await login(username, password);
        if (result.success) {
            navigate("/home");
        } else {
            setError(result.message);
        }
    };

    useEffect(() => {
        console.log("Updated Session:", sessionId);
        console.log("Updated Account:", accountId);
    }, [sessionId, accountId]);

    return (
        <div className="login-container">
            {!sessionId ? (
                <div className="login-card">
                    <h2 className="login-title">Login to TMDB</h2>
                    {error && <p className="error-text">{error}</p>}
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="login-btn" disabled={loading}>
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>
                </div>
            ) : (
                <div className="login-card">
                    <h2>You are logged in ✅</h2>
                    <p><strong>Session ID:</strong> {sessionId}</p>
                </div>
            )}
        </div>
    );
}
