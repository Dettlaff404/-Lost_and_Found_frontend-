import { jwtDecode } from "jwt-decode";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { GetUserByEmail } from "../../service/UserData";

interface AuthContextType {
    isAuthenticated: boolean;
    userRole: string;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState<string>('ROLE_USER');

    useEffect(() => {
        // Get the token from local storage and validate
        const token = localStorage.getItem('lofToken');
        const role = localStorage.getItem('lofRole');
        
        if (token) {
            setIsAuthenticated(!!token);
        }
        
        if (role) {
            setUserRole(role);
        }
    }, [])

    const login = (token: string) => {
        // Set token in local storage
        localStorage.setItem('lofToken', token);
        console.log("saved token");

        const decoded = jwtDecode<any>(token);
        const role = decoded.roles;

        localStorage.setItem('lofRole', role);
        console.log("saved role");
        
        // Update state immediately
        setUserRole(role);

        const email = decoded.sub;
        
        // Fetch user data and store userId in local storage
        GetUserByEmail(email)
            .then((userData) => {
                localStorage.setItem("lofUserId", userData.userId);
            })
            .catch((error) => {
                console.error("Error fetching user data:", error);
            });

        setIsAuthenticated(true);
    }
    
    const logout = () => {
        // Remove token from local storage
        localStorage.removeItem('lofUserId');
        localStorage.removeItem('lofRole');
        localStorage.removeItem('lofToken');

        setIsAuthenticated(false);
        setUserRole('ROLE_USER');
    }

    return(
        <AuthContext.Provider value={{isAuthenticated, userRole, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth should be used within an AuthProvider');
    }
    return context;
}