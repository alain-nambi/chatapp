import React, { useState, useEffect, useRef } from 'react';
import { Button, TextInput, Textarea, Container, Paper, ScrollArea, Group, Title, Box } from '@mantine/core';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3456'); // adjust your server URL here

export default function ChatApp() {
  const [userId, setUserId] = useState('');
  const [registered, setRegistered] = useState(false);
  const [toUser, setToUser] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const scrollAreaRef = useRef(null);

  useEffect(() => {
    socket.on('receive-message', (data) => {
      setMessages((msgs) => [...msgs, { ...data, incoming: true }]);
    });

    return () => {
      socket.off('receive-message');
    };
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleRegister = () => {
    if (!userId.trim()) return alert('Please enter your user ID');
    socket.emit('register', userId.trim());
    setRegistered(true);
  };

  const handleSendMessage = () => {
    if (!toUser.trim() || !message.trim()) return alert('Please fill all fields');
    socket.emit('message', { from: userId, to: toUser.trim(), text: message.trim() });
    setMessages((msgs) => [...msgs, { from: userId, text: message.trim(), incoming: false }]);
    setMessage('');
  };

  return (
    <Container size="sm" my="xl">
      <Paper shadow="sm" padding="md" radius="md" withBorder>
        <Title order={3} mb="md" align="center">⚡ Real-Time Chat</Title>

        {!registered && (
          <Group mb="md" grow>
            <TextInput
              placeholder="Your user ID"
              value={userId}
              onChange={(e) => setUserId(e.currentTarget.value)}
              label="Register your User ID"
              withAsterisk
            />
            <Button onClick={handleRegister} mt="auto">Register</Button>
          </Group>
        )}

        {registered && (
          <>
            <Group mb="md" grow>
              <TextInput
                placeholder="Send to User ID"
                value={toUser}
                onChange={(e) => setToUser(e.currentTarget.value)}
                label="Recipient User ID"
                withAsterisk
              />
            </Group>

            <Group mb="md" grow>
              <Textarea
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.currentTarget.value)}
                autosize
                minRows={2}
                label="Message"
                withAsterisk
              />
              <Button onClick={handleSendMessage} mt="auto">Send</Button>
            </Group>

            <Box sx={{ height: 300, overflow: 'auto', border: '1px solid #eaeaea', padding: 10, borderRadius: 6 }} ref={scrollAreaRef}>
              {messages.length === 0 && <div style={{ textAlign: 'center', color: '#999' }}>No messages yet</div>}
              {messages.map((msg, index) => (
                <Paper
                  key={index}
                  padding="xs"
                  mb="xs"
                  radius="sm"
                  withBorder
                  sx={{
                    maxWidth: '70%',
                    alignSelf: msg.incoming ? 'flex-start' : 'flex-end',
                    backgroundColor: msg.incoming ? '#f1f3f5' : '#4dabf7',
                    color: msg.incoming ? 'black' : 'white',
                    marginLeft: msg.incoming ? 0 : 'auto',
                  }}
                >
                  <div><strong>{msg.incoming ? msg.from : 'You'}</strong></div>
                  <div>{msg.text}</div>
                </Paper>
              ))}
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
}
