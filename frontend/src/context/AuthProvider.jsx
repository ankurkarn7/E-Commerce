import { useEffect, useState } from "react";
import api from "../api/axios";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const verifyUser = async () => {
        try {
            const res = await api.get('/auth/verify');
            setUser(res.data.user);
        } catch {
            setUser(null);  // not logged in
        }
    }

    useEffect(() => {
        verifyUser();
    }, [])

    const logout = async () => {
        await api.post('/auth/logout');
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
