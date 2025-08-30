// Simple test script for chat API endpoints
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test data
const testUser1 = {
  email: 'user1@test.com',
  password: 'password123',
  fullName: 'Test User 1'
};

const testUser2 = {
  email: 'user2@test.com', 
  password: 'password123',
  fullName: 'Test User 2'
};

let user1Token, user2Token, user1Id, user2Id;

async function testChatAPI() {
  try {
    console.log('🧪 Starting Chat API Tests...\n');

    // Test 1: Register users (if needed)
    console.log('1. Testing user registration...');
    try {
      await axios.post(`${BASE_URL}/auth/register`, testUser1);
      console.log('✅ User 1 registered');
    } catch (err) {
      console.log('⚠️ User 1 already exists or registration failed');
    }

    try {
      await axios.post(`${BASE_URL}/auth/register`, testUser2);
      console.log('✅ User 2 registered');
    } catch (err) {
      console.log('⚠️ User 2 already exists or registration failed');
    }

    // Test 2: Login users
    console.log('\n2. Testing user login...');
    const login1 = await axios.post(`${BASE_URL}/auth/login`, {
      email: testUser1.email,
      password: testUser1.password
    });
    user1Token = login1.data.token;
    user1Id = login1.data.user._id;
    console.log('✅ User 1 logged in');

    const login2 = await axios.post(`${BASE_URL}/auth/login`, {
      email: testUser2.email,
      password: testUser2.password
    });
    user2Token = login2.data.token;
    user2Id = login2.data.user._id;
    console.log('✅ User 2 logged in');

    // Test 3: Send friend request
    console.log('\n3. Testing friend request...');
    await axios.post(`${BASE_URL}/friendship/request`, {
      toUserId: user2Id
    }, {
      headers: { Authorization: `Bearer ${user1Token}` }
    });
    console.log('✅ Friend request sent');

    // Test 4: Accept friend request
    console.log('\n4. Testing friend request acceptance...');
    const incomingRequests = await axios.get(`${BASE_URL}/friendship/requests/incoming`, {
      headers: { Authorization: `Bearer ${user2Token}` }
    });
    
    if (incomingRequests.data.data.length > 0) {
      const requestId = incomingRequests.data.data[0]._id;
      await axios.put(`${BASE_URL}/friendship/request/${requestId}/accept`, {}, {
        headers: { Authorization: `Bearer ${user2Token}` }
      });
      console.log('✅ Friend request accepted');
    }

    // Test 5: Create conversation
    console.log('\n5. Testing conversation creation...');
    const conversation = await axios.post(`${BASE_URL}/chat/conversation`, {
      participantId: user2Id
    }, {
      headers: { Authorization: `Bearer ${user1Token}` }
    });
    const conversationId = conversation.data.data._id;
    console.log('✅ Conversation created:', conversationId);

    // Test 6: Send message
    console.log('\n6. Testing message sending...');
    const message = await axios.post(`${BASE_URL}/chat/message`, {
      conversationId,
      content: 'Hello! This is a test message from the chat API.',
      messageType: 'text'
    }, {
      headers: { Authorization: `Bearer ${user1Token}` }
    });
    console.log('✅ Message sent:', message.data.data.content);

    // Test 7: Get messages
    console.log('\n7. Testing message retrieval...');
    const messages = await axios.get(`${BASE_URL}/chat/conversation/${conversationId}/messages`, {
      headers: { Authorization: `Bearer ${user2Token}` }
    });
    console.log('✅ Messages retrieved:', messages.data.data.length, 'messages');

    // Test 8: Get conversations
    console.log('\n8. Testing conversations list...');
    const conversations = await axios.get(`${BASE_URL}/chat/conversations`, {
      headers: { Authorization: `Bearer ${user1Token}` }
    });
    console.log('✅ Conversations retrieved:', conversations.data.data.length, 'conversations');

    // Test 9: Mark as read
    console.log('\n9. Testing mark as read...');
    await axios.put(`${BASE_URL}/chat/conversation/${conversationId}/read`, {}, {
      headers: { Authorization: `Bearer ${user2Token}` }
    });
    console.log('✅ Messages marked as read');

    // Test 10: Get unread count
    console.log('\n10. Testing unread count...');
    const unreadCount = await axios.get(`${BASE_URL}/chat/unread-count`, {
      headers: { Authorization: `Bearer ${user2Token}` }
    });
    console.log('✅ Unread count:', unreadCount.data.data.unreadCount);

    console.log('\n🎉 All chat API tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run tests
testChatAPI();