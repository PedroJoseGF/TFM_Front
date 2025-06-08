import { createContext, useState } from "react";
import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';

// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext();

export const UserProvider = ({children}) => {
    const [user, setUser] = useState(null);

    const { data: userData, isLoading } = useQuery({
        queryKey: ["verifyAuthenticated"],
        queryFn: async () => {
            try {
                const response = await apiClient.get('/auth/verifyAuthenticated');
                setUser(response.data.user);
                return response.data;
            } catch {
                setUser(null);
                return [];
            }
        }
    });

    if (isLoading) return <div className="isLoading">{}</div>;

    return (
        <UserContext.Provider value={{user, setUser, userData}}>
            { children }
        </UserContext.Provider>
    );
};