import api from './api';

export interface User {
    _id: string;
    fullName: string;
    email: string;
}

export interface Message {
    _id: string;
    conversationId: string;
    sender: User;
    content: string;
    messageType: 'text' | 'image' | 'location' | 'system';
    status: 'sent' | 'delivered' | 'read';
    isDeleted: boolean;
    replyTo: string | null;
    readBy: Array<{
        user: string;
        readAt: string;
        _id: string;
    }>;
    createdAt: string;
    updatedAt: string;
}

export interface Conversation {
    _id: string;
    participants: User[];
    type: 'direct' | 'group';
    createdBy: string;
    isActive: boolean;
    lastActivity: string;
    createdAt: string;
    updatedAt: string;
    lastMessage?: Message;
}

export interface ConversationResponse {
    status: string;
    data: Conversation;
}

export interface MessagesResponse {
    status: string;
    data: Message[];
    pagination: {
        page: number;
        limit: number;
        total: number;
    };
}

export interface UnreadCountResponse {
    status: string;
    data: {
        unreadCount: number;
    };
}

class ChatService {
    // Create or get conversation with a participant
    async createConversation(participantId: string): Promise<Conversation> {
        try {
            const response = await api.post<ConversationResponse>('/chat/conversation', {
                participantId
            });
            return response.data.data;
        } catch (error) {
            console.error('Error creating conversation:', error);
            throw error;
        }
    }

    // Get all conversations for the current user
    async getConversations(page: number = 1, limit: number = 20): Promise<Conversation[]> {
        try {
            const response = await api.get<{ status: string; data: Conversation[] }>('/chat/conversations', {
                params: { page, limit }
            });
            return response.data.data;
        } catch (error) {
            console.error('Error fetching conversations:', error);
            throw error;
        }
    }

    // Get messages for a specific conversation
    async getMessages(conversationId: string, page: number = 1, limit: number = 50): Promise<MessagesResponse> {
        try {
            const response = await api.get<MessagesResponse>(`/chat/conversation/${conversationId}/messages`, {
                params: { page, limit }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching messages:', error);
            throw error;
        }
    }

    // Send a message
    async sendMessage(
        conversationId: string,
        content: string,
        messageType: string = 'text',
        replyTo?: string
    ): Promise<Message> {
        try {
            const response = await api.post<{ status: string; data: Message }>('/chat/message', {
                conversationId,
                content,
                messageType,
                replyTo
            });
            return response.data.data;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }

    // Mark messages as read
    async markAsRead(conversationId: string): Promise<void> {
        try {
            await api.put(`/chat/conversation/${conversationId}/read`);
        } catch (error) {
            console.error('Error marking messages as read:', error);
            throw error;
        }
    }

    // Get unread message count
    async getUnreadCount(): Promise<number> {
        try {
            const response = await api.get<UnreadCountResponse>('/chat/unread-count');
            return response.data.data.unreadCount;
        } catch (error) {
            console.error('Error fetching unread count:', error);
            throw error;
        }
    }

    // Delete a message
    async deleteMessage(messageId: string): Promise<void> {
        try {
            await api.delete(`/chat/message/${messageId}`);
        } catch (error) {
            console.error('Error deleting message:', error);
            throw error;
        }
    }
}

export const chatService = new ChatService();