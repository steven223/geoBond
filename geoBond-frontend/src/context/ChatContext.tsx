import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react';
import { getSocket } from '../services/socket';
import { chatService, Message, Conversation } from '../services/chatService';
import { AuthContext } from './AuthContext';
import Toast from 'react-native-toast-message';
import { debounce, rateLimit } from '../utils/debounce';

interface ChatContextType {
  conversations: Conversation[];
  messages: { [conversationId: string]: Message[] };
  unreadCount: number;
  loading: boolean;
  typingUsers: { [conversationId: string]: string[] };
  loadConversations: () => Promise<void>;
  loadMessages: (conversationId: string, page?: number) => Promise<any>;
  sendMessage: (conversationId: string, content: string, messageType?: string, replyTo?: string) => Promise<void>;
  markAsRead: (conversationId: string) => Promise<void>;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  sendTyping: (conversationId: string, isTyping: boolean) => void;
  createConversation: (participantId: string) => Promise<Conversation>;
  loadUnreadCount: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<{ [conversationId: string]: Message[] }>({});
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [typingUsers, setTypingUsers] = useState<{ [conversationId: string]: string[] }>({});

  // Refs to prevent excessive API calls
  const loadingConversationsRef = useRef(false);
  const loadingUnreadCountRef = useRef(false);
  const lastUnreadCountLoadRef = useRef(0);

  // Create debounced versions of API calls
  const debouncedLoadUnreadCount = useRef(
    debounce(() => {
      if (!user || loadingUnreadCountRef.current) return;

      const now = Date.now();
      if (now - lastUnreadCountLoadRef.current < 2000) return;

      loadingUnreadCountRef.current = true;
      lastUnreadCountLoadRef.current = now;

      chatService.getUnreadCount()
        .then(count => setUnreadCount(count))
        .catch(error => console.error('Error loading unread count:', error))
        .finally(() => {
          loadingUnreadCountRef.current = false;
        });
    }, 1000)
  ).current;

  // Load conversations with debouncing
  const loadConversations = useCallback(async () => {
    if (!user || loadingConversationsRef.current) return;

    try {
      loadingConversationsRef.current = true;
      setLoading(true);
      const data = await chatService.getConversations();
      setConversations(data);
    } catch (error) {
      console.error('Error loading conversations:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load conversations'
      });
    } finally {
      setLoading(false);
      loadingConversationsRef.current = false;
    }
  }, [user]);

  // Load messages for a conversation
  const loadMessages = useCallback(async (conversationId: string, page: number = 1) => {
    try {
      const response = await chatService.getMessages(conversationId, page);

      if (page === 1) {
        setMessages(prev => ({
          ...prev,
          [conversationId]: response.data
        }));
      } else {
        setMessages(prev => ({
          ...prev,
          [conversationId]: [...(response.data || []), ...(prev[conversationId] || [])]
        }));
      }

      return response;
    } catch (error) {
      console.error('Error loading messages:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load messages'
      });
      throw error;
    }
  }, []);

  // Send message
  const sendMessage = useCallback(async (
    conversationId: string,
    content: string,
    messageType: string = 'text',
    replyTo?: string
  ) => {
    if (!user || !content.trim()) return;

    try {
      const socket = getSocket();

      // Send via socket for real-time delivery
      if (socket) {
        socket.emit('chat:message', {
          conversationId,
          content: content.trim(),
          messageType,
          replyTo
        });
      }

      // Also send via API as backup
      await chatService.sendMessage(conversationId, content.trim(), messageType, replyTo);

    } catch (error) {
      console.error('Error sending message:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to send message'
      });
    }
  }, [user]);

  // Mark messages as read
  const markAsRead = useCallback(async (conversationId: string) => {
    try {
      await chatService.markAsRead(conversationId);

      const socket = getSocket();
      if (socket) {
        socket.emit('chat:read', { conversationId });
      }

      // Update local unread count with debouncing
      debouncedLoadUnreadCount();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  }, [loadUnreadCount]);

  // Load unread count with rate limiting to prevent excessive calls
  const loadUnreadCount = useCallback(() => {
    debouncedLoadUnreadCount();
  }, [debouncedLoadUnreadCount]);

  // Join conversation room
  const joinConversation = useCallback((conversationId: string) => {
    const socket = getSocket();
    if (socket) {
      socket.emit('chat:join', conversationId);
    }
  }, []);

  // Leave conversation room
  const leaveConversation = useCallback((conversationId: string) => {
    const socket = getSocket();
    if (socket) {
      socket.emit('chat:leave', conversationId);
    }
  }, []);

  // Send typing indicator
  const sendTyping = useCallback((conversationId: string, isTyping: boolean) => {
    const socket = getSocket();
    if (socket) {
      socket.emit('chat:typing', { conversationId, isTyping });
    }
  }, []);

  // Create or get conversation
  const createConversation = useCallback(async (participantId: string) => {
    try {
      const conversation = await chatService.createConversation(participantId);

      // Add to conversations if not already present
      setConversations(prev => {
        const exists = prev.find(c => c._id === conversation._id);
        if (exists) return prev;
        return [conversation, ...prev];
      });

      return conversation;
    } catch (error) {
      console.error('Error creating conversation:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to create conversation'
      });
      throw error;
    }
  }, []);

  // Socket event listeners
  useEffect(() => {
    if (!user) return;

    const socket = getSocket();
    if (!socket) return;

    // Clear any existing listeners to prevent duplicates
    socket.off('chat:message');
    socket.off('chat:typing');
    socket.off('chat:read');

    // Listen for new messages
    const handleNewMessage = (message: Message) => {
      setMessages(prev => ({
        ...prev,
        [message.conversationId]: [...(prev[message.conversationId] || []), message]
      }));

      // Update conversation's last message
      setConversations(prev => prev.map(conv =>
        conv._id === message.conversationId
          ? { ...conv, lastMessage: message, lastActivity: message.createdAt }
          : conv
      ));

      // Only update unread count if message is not from current user
      if (message.sender._id !== user._id) {
        // Use debounced function to prevent excessive calls
        debouncedLoadUnreadCount();
      }
    };

    // Listen for typing indicators
    const handleTyping = ({ userId, isTyping, conversationId }: {
      userId: string;
      isTyping: boolean;
      conversationId: string;
    }) => {
      if (userId === user._id) return; // Ignore own typing

      setTypingUsers(prev => {
        const currentTyping = prev[conversationId] || [];

        if (isTyping) {
          if (!currentTyping.includes(userId)) {
            return {
              ...prev,
              [conversationId]: [...currentTyping, userId]
            };
          }
        } else {
          return {
            ...prev,
            [conversationId]: currentTyping.filter(id => id !== userId)
          };
        }

        return prev;
      });
    };

    // Listen for read receipts
    const handleRead = ({ userId, conversationId }: { userId: string; conversationId: string }) => {
      if (userId === user._id) return;

      // Update message read status in local state
      setMessages(prev => ({
        ...prev,
        [conversationId]: (prev[conversationId] || []).map(msg => ({
          ...msg,
          status: msg.sender._id === user._id ? 'read' : msg.status
        }))
      }));
    };

    socket.on('chat:message', handleNewMessage);
    socket.on('chat:typing', handleTyping);
    socket.on('chat:read', handleRead);

    return () => {
      socket.off('chat:message', handleNewMessage);
      socket.off('chat:typing', handleTyping);
      socket.off('chat:read', handleRead);
    };
  }, [user, loadUnreadCount]);

  // Load initial data only once when user is available
  useEffect(() => {
    if (user && conversations.length === 0 && !loadingConversationsRef.current) {
      loadConversations();
      debouncedLoadUnreadCount();
    }
  }, [user]); // Remove loadConversations and loadUnreadCount from dependencies to prevent loops

  const value: ChatContextType = {
    conversations,
    messages,
    unreadCount,
    loading,
    typingUsers,
    loadConversations,
    loadMessages,
    sendMessage,
    markAsRead,
    joinConversation,
    leaveConversation,
    sendTyping,
    createConversation,
    loadUnreadCount
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};