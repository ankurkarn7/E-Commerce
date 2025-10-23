import { createContext, useEffect, useState, useContext } from "react"
import api from "../services/api";

export const AuthContext = createContext();


export const AuthProvider = ({children}) => {

    const [user, setUser] = useState(null);

    const verifyUser = async() => {
        try{
            const res = await api.get('/auth/verify');
            setUser(res.data.user);
        }catch(err){
            setUser(null);  // not logged in
        }
    }

    useEffect(() => {
      verifyUser()
    }, [])

    const logout = async() => {
        await api.post('/auth/logout');
        setUser(null);
    }
    


  return (
    <AuthContext.Provider value={{user, setUser, logout}}>
        {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);
