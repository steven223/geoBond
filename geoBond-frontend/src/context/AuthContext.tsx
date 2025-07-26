import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initSocket, getSocket } from '../services/socket';

type User = {
    _id: string;
    name: string;
    email: string;
};

type AuthContextType = {
    user: User | null;
    login: (userData: User) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
    user: null,
    login: async () => { },
    logout: async () => { },
    loading: true,
});

type Props = {
    children: ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await AsyncStorage.getItem('user');
                if (userData) setUser(JSON.parse(userData));
            } catch (e) {
                console.error('Error loading user:', e);
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, []);
    useEffect(() => {
        if (user) {
            // Initialize and connect socket
            initSocket();
            const socket = getSocket();
            socket.connect();
            socket.emit('register', user._id);
            console.log('🔗 Socket connected and register emitted:', user._id);

            return () => {
                // Cleanup socket connection on user change (logout)
                socket.disconnect();
                console.log('🧹 Socket disconnected');
            };
        }
        if (!user) return;
    }, [user]);

    const login = async (userData: User) => {
        setUser(userData);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
    }

    const logout = async () => {
        setUser(null);
        await AsyncStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
