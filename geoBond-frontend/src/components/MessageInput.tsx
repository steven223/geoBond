import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  onTyping?: (isTyping: boolean) => void;
  placeholder?: string;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onTyping,
  placeholder = "Type a message...",
  disabled = false,
}) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const sendButtonScale = useRef(new Animated.Value(0.8)).current;

  const handleTextChange = (text: string) => {
    setMessage(text);

    // Handle typing indicator
    if (text.length > 0 && !isTyping) {
      setIsTyping(true);
      onTyping?.(true);
    } else if (text.length === 0 && isTyping) {
      setIsTyping(false);
      onTyping?.(false);
    }

    // Reset typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (text.length > 0) {
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        onTyping?.(false);
      }, 2000);
    }

    // Animate send button
    Animated.spring(sendButtonScale, {
      toValue: text.trim().length > 0 ? 1 : 0.8,
      useNativeDriver: true,
    }).start();
  };

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      setIsTyping(false);
      onTyping?.(false);
      
      // Reset send button animation
      Animated.spring(sendButtonScale, {
        toValue: 0.8,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.textInput}
          value={message}
          onChangeText={handleTextChange}
          placeholder={placeholder}
          placeholderTextColor="#999"
          multiline
          maxLength={1000}
          editable={!disabled}
          returnKeyType="send"
          onSubmitEditing={handleSend}
          blurOnSubmit={false}
        />
        
        <Animated.View style={[styles.sendButton, { transform: [{ scale: sendButtonScale }] }]}>
          <TouchableOpacity
            onPress={handleSend}
            disabled={!message.trim() || disabled}
            style={[
              styles.sendButtonInner,
              message.trim() ? styles.sendButtonActive : styles.sendButtonInactive
            ]}
          >
            <Ionicons 
              name="send" 
              size={18} 
              color={message.trim() ? '#fff' : '#ccc'} 
            />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f8f8f8',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 44,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: 8,
    color: '#333',
    ...Platform.select({
      ios: {
        paddingTop: 8,
      },
      android: {
        paddingTop: 6,
      },
    }),
  },
  sendButton: {
    marginLeft: 8,
  },
  sendButtonInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#007AFF',
  },
  sendButtonInactive: {
    backgroundColor: 'transparent',
  },
});

export default MessageInput;