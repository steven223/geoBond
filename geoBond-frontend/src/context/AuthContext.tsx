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
        try {
            // Stop location tracking before logout
            await locationService.stopLocationTracking();
            
            // Disconnect socket if connected
            const socket = getSocket();
            if (socket && socket.connected) {
                socket.disconnect();
                console.log('🧹 Socket disconnected during logout');
            }
            
            // Clear user data
            setUser(null);
            setToken(null);
            
            // Clear AsyncStorage
            await AsyncStorage.multiRemove(['user', 'token', 'hasSeenWelcome']);
            setHasSeenWelcomeState(false);
            
            console.log('✅ Logout completed successfully');
        } catch (error) {
            console.error('❌ Error during logout:', error);
            // Still clear user data even if there's an error
            setUser(null);
            setToken(null);
            setHasSeenWelcomeState(false);
        }
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
