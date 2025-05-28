import { createContext, ReactNode, useEffect, useState } from "react";

interface AuthContextType {
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        //get the token from local storage and validate
        const token = localStorage.getItem('libToken');
    }, [])

    const login = (token: string) => {
        //set token from local storage
        localStorage.setItem('libToken', token);
        setIsAuthenticated(true);
    }
    
    const logout = () => {
        //remove token from local storage
        localStorage.removeItem('libToken');
        setIsAuthenticated(false);
    }

    return(
        <AuthContext.Provider value={{isAuthenticated, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}