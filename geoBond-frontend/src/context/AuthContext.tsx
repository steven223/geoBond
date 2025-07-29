import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initSocket, getSocket } from '../services/socket';
import { locationService } from '../services/locationService';

type User = {
    _id: string;
    fullName: string;
    email: string;
};

// Add token to the context
type AuthContextType = {
    user: User | null;
    token: string | null;
    login: (userData: User, token: string) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
    hasSeenWelcome: boolean;
    setHasSeenWelcome: (seen: boolean) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    login: async () => { },
    logout: async () => { },
    loading: true,
    hasSeenWelcome: false,
    setHasSeenWelcome: async () => { },
});

type Props = {
    children: ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [hasSeenWelcome, setHasSeenWelcomeState] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await AsyncStorage.getItem('user');
                const storedToken = await AsyncStorage.getItem('token');
                const welcomeSeen = await AsyncStorage.getItem('hasSeenWelcome');
                
                if (userData) {
                    setUser(JSON.parse(userData));
                }
                
                if (storedToken) {
                    setToken(storedToken);
                }
                
                if (welcomeSeen === 'true') {
                    setHasSeenWelcomeState(true);
                }
            } catch (e) {
                console.error('Error loading user:', e);
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, []);

    // Update login function to store token
    const login = async (userData: User, authToken: string) => {
        setUser(userData);
        setToken(authToken);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        await AsyncStorage.setItem('token', authToken);
    }

    const logout = async () => {
        // Stop location tracking before logout
        await locationService.stopLocationTracking();
        
        setUser(null);
        setToken(null);
        await AsyncStorage.removeItem('user');
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('hasSeenWelcome');
        setHasSeenWelcomeState(false);
    };

    useEffect(() => {
        if (user) {
            // Initialize and connect socket
            initSocket();
            const socket = getSocket();
            socket.connect();
            socket.emit('register', user._id);
            console.log('🔗 Socket connected and register emitted:', user._id);

            // Start location tracking with user ID
            locationService.startLocationTracking(user._id);

            return () => {
                // Cleanup socket connection on user change (logout)
                socket.disconnect();
                console.log('🧹 Socket disconnected');
                
                // Stop location tracking
                locationService.stopLocationTracking();
            };
        }
        if (!user) return;
    }, [user]);

    const setHasSeenWelcome = async (seen: boolean) => {
        setHasSeenWelcomeState(seen);
        await AsyncStorage.setItem('hasSeenWelcome', seen.toString());
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            token,
            login, 
            logout, 
            loading, 
            hasSeenWelcome, 
            setHasSeenWelcome 
        }}>
            {children}
        </AuthContext.Provider>
    );
};
