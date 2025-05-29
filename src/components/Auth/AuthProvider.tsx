
import { jwtDecode } from "jwt-decode";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { GetUserByEmail } from "../../service/UserData";

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
        const token = localStorage.getItem('lofToken');
        

        if (token) {
            setIsAuthenticated(!!token);
        }
    }, [])

    const login = (token: string) => {
        //set token from local storage
        localStorage.setItem('lofToken', token);

         try {
                const decoded = jwtDecode<any>(token);
                const email = decoded.sub;

                // Fetch user data and store userId in local storage
                console.log("Email:", email);
                GetUserByEmail(email)
                    .then((userData) => {
                        localStorage.setItem("lofUserId", userData.userId);
                    })
                    .catch((error) => {
                        console.error("Error fetching user data:", error);
                    });

        } catch (error) {
            console.error("Error decoding token:", error);
        }


        setIsAuthenticated(true);
    }
    
    const logout = () => {
        //remove token from local storage
        localStorage.removeItem('lofToken');
        localStorage.removeItem('lofUserId');

        setIsAuthenticated(false);
    }

    return(
        <AuthContext.Provider value={{isAuthenticated, login, logout}}>
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