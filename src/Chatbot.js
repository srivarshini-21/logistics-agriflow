import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  IconButton, 
  TextField, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemAvatar, 
  Avatar 
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import AgricultureIcon from '@mui/icons-material/Agriculture';

const AgriChatbot = () => {
  const [messages, setMessages] = useState([
    { 
      text: "Hello! I'm AgriBot. I can help you navigate our agriculture supply chain platform. What would you like to know?", 
      sender: 'bot' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const defaultQuestions = [
    "How can I track my order?",
    "What fertilizers do you offer?",
    "What are the current market prices?",
    "How long does delivery take?"
  ];

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending a message
  const handleSend = (text) => {
    const userMessage = text || input.trim();
    if (userMessage === '') return;

    const newMessages = [...messages, { text: userMessage, sender: 'user' }];
    setMessages(newMessages);
    setInput('');

    setTimeout(() => {
      const botReply = generateBotReply(userMessage);
      setMessages([...newMessages, { text: botReply, sender: 'bot' }]);
    }, 1000);
  };

  // Generate bot reply based on keywords
  const generateBotReply = (userInput) => {
    const lowerInput = userInput.toLowerCase();

    if (lowerInput.includes('order') || lowerInput.includes('track')) {
      return "To track your order, please provide your **order number**.";
    } else if (lowerInput.includes('fertilizer') || lowerInput.includes('seed')) {
      return "We have organic fertilizers and high-yield seeds available. Check our **Products** section!";
    } else if (lowerInput.includes('price') || lowerInput.includes('cost')) {
      return "Current market prices are updated daily. Visit **Pricing** for details.";
    } else if (lowerInput.includes('delivery') || lowerInput.includes('ship')) {
      return "Delivery takes **2-5 business days** depending on location.";
    } else {
      return "I’m here to help with orders, products, and farming advice. Ask me anything!";
    }
  };

  return (
    <>
      {/* Chat Icon */}
      {!isOpen && (
        <IconButton
          onClick={() => setIsOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            bgcolor: '#4CAF50',
            color: 'white',
            '&:hover': { bgcolor: '#388E3C' },
            boxShadow: 3,
          }}
        >
          <ChatBubbleIcon />
        </IconButton>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <Box sx={{ 
          position: 'fixed', 
          bottom: 20, 
          right: 20, 
          width: { xs: '90%', sm: 350 }, 
          maxHeight: '90vh', 
          bgcolor: 'white',
          boxShadow: 3,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          zIndex: 1000
        }}>
          {/* Chatbot Header */}
          <Box sx={{ 
            bgcolor: '#4CAF50', 
            color: 'white', 
            p: 2, 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AgricultureIcon sx={{ mr: 1 }} />
              <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>AgriBot Assistant</Typography>
            </Box>
            <IconButton
              onClick={() => setIsOpen(false)}
              sx={{ color: 'white' }}
            >
              ✕
            </IconButton>
          </Box>

          {/* Default Questions */}
          <Box sx={{ 
            p: 2, 
            borderBottom: '1px solid #e0e0e0', 
            bgcolor: '#f9f9f9', 
            maxHeight: '50%', // Limit height for default questions
            overflowY: 'auto' // Allow scrolling if questions exceed the height
          }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Quick Questions:</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {defaultQuestions.map((question, index) => (
                <Paper
                  key={index}
                  onClick={() => handleSend(question)}
                  sx={{
                    p: 1,
                    bgcolor: '#e8f5e9',
                    color: '#4CAF50',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: '#c8e6c9' }
                  }}
                >
                  {question}
                </Paper>
              ))}
            </Box>
          </Box>

          {/* Messages Area */}
          <Box sx={{ 
            flex: 1, 
            p: 2, 
            overflowY: 'auto', // Ensure messages are scrollable
            bgcolor: '#f9f9f9' 
          }}>
            <List>
              {messages.map((msg, index) => (
                <ListItem key={index} sx={{ 
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-start'
                }}>
                  {msg.sender === 'bot' && (
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: '#4CAF50' }}>
                        <SmartToyIcon />
                      </Avatar>
                    </ListItemAvatar>
                  )}
                  <Paper sx={{ 
                    p: 1.5, 
                    ml: msg.sender === 'bot' ? 0 : 2,
                    mr: msg.sender === 'bot' ? 2 : 0,
                    bgcolor: msg.sender === 'bot' ? '#e8f5e9' : '#4CAF50',
                    color: msg.sender === 'bot' ? 'black' : 'white',
                    borderRadius: msg.sender === 'bot' ? '0 10px 10px 10px' : '10px 0 10px 10px'
                  }}>
                    <Typography variant="body1" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                      {msg.text}
                    </Typography>
                  </Paper>
                </ListItem>
              ))}
              <div ref={messagesEndRef} />
            </List>
          </Box>

          {/* Input Area */}
          <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0', display: 'flex' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              sx={{ mr: 1, fontSize: { xs: '0.875rem', sm: '1rem' } }}
            />
            <IconButton 
              color="primary" 
              onClick={() => handleSend()}
              sx={{ bgcolor: '#4CAF50', color: 'white', '&:hover': { bgcolor: '#388E3C' } }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      )}
    </>
  );
};

export default AgriChatbot;