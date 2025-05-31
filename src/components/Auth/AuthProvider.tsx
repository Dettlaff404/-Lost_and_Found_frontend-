import { jwtDecode } from "jwt-decode";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { GetUserByEmail } from "../../service/UserData";

interface AuthContextType {
    isAuthenticated: boolean;
    userRole: string;
    userId: string | undefined;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState<string>('ROLE_USER');
    const [userId, setUserId] = useState<string>();

    useEffect(() => {
        // Get the token from local storage and validate
        const token = localStorage.getItem('lofToken');
        const role = localStorage.getItem('lofRole');
        
        if (token) {
            setIsAuthenticated(!!token);
            
            // If we have a token, decode it and fetch user data to restore userId
            try {
                const decoded = jwtDecode<any>(token);
                const email = decoded.sub;
                
                GetUserByEmail(email)
                    .then((userData) => {
                        setUserId(userData.userId);
                    })
                    .catch((error) => {
                        console.error("Error fetching user data:", error);
                    });
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
        
        if (role) {
            setUserRole(role);
        }
    }, [])

    const login = (token: string) => {
        // Set token in local storage
        localStorage.setItem('lofToken', token);

        const decoded = jwtDecode<any>(token);
        const role = decoded.roles;

        localStorage.setItem('lofRole', role);
        
        // Update state immediately
        setUserRole(role);

        const email = decoded.sub;
        
        // Fetch user data and store userId in state
        GetUserByEmail(email)
            .then((userData) => {
                setUserId(userData.userId);
            })
            .catch((error) => {
                console.error("Error fetching user data:", error);
            });

        setIsAuthenticated(true);
    }
    
    const logout = () => {
        // Remove token from local storage
        localStorage.removeItem('lofRole');
        localStorage.removeItem('lofToken');

        setIsAuthenticated(false);
        setUserRole('ROLE_USER');
        setUserId(undefined);
    }

    return(
        <AuthContext.Provider value={{isAuthenticated, userRole, userId, login, logout}}>
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