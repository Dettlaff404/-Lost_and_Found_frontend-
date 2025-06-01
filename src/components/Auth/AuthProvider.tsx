import { jwtDecode } from "jwt-decode";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { GetUserByEmail } from "../../service/UserData";

interface AuthContextType {
    isAuthenticated: boolean;
    userRole: string;
    userId: string | undefined;
    isLoading: boolean;
    login: (token: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState<string>('ROLE_USER');
    const [userId, setUserId] = useState<string>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            setIsLoading(true);
            // Get the token from local storage and validate
            const token = localStorage.getItem('lofToken');
            const role = localStorage.getItem('lofRole');
            
            if (token) {
                setIsAuthenticated(true);
                
                // If we have a token, decode it and fetch user data to restore userId
                try {
                    const decoded = jwtDecode<any>(token);
                    const email = decoded.sub;
                    
                    const userData = await GetUserByEmail(email);
                    console.log("User data fetched on reload:", userData);
                    setUserId(userData.userId);
                } catch (error) {
                    console.error("Error fetching user data on reload:", error);
                    // If token is invalid or user fetch fails, clear auth state
                    logout();
                }
            }
            
            if (role) {
                setUserRole(role);
            }
            
            setIsLoading(false);
        };

        initializeAuth();
    }, [])

    const login = async (token: string): Promise<void> => {
        // Set token in local storage
        localStorage.setItem('lofToken', token);

        const decoded = jwtDecode<any>(token);
        const role = decoded.roles;

        localStorage.setItem('lofRole', role);
        
        // Update state immediately
        setUserRole(role);
        setIsAuthenticated(true);

        const email = decoded.sub;
        
        // Fetch user data and store userId in state - make this await
        try {
            const userData = await GetUserByEmail(email);
            console.log("User data fetched:", userData);
            setUserId(userData.userId);
        } catch (error) {
            console.error("Error fetching user data:", error);
            throw error; // Re-throw to let caller handle the error
        }
    }
    
    const logout = () => {
        // Remove token from local storage
        localStorage.removeItem('lofRole');
        localStorage.removeItem('lofToken');

        setIsAuthenticated(false);
        setUserRole('ROLE_USER');
        setUserId(undefined);
        setIsLoading(false);
    }

    return(
        <AuthContext.Provider value={{isAuthenticated, userRole, userId, isLoading, login, logout}}>
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