import { useEffect, useState, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Stomp, CompatClient } from '@stomp/stompjs';
import { useAuth } from './use-auth';

export interface ChatMessage {
  sender: string;
  content: string;
  type: 'CHAT' | 'JOIN' | 'LEAVE';
}

export const useSocket = () => {
  // We need the user's name (we'll extract it from the token later, 
  // for now we'll just use the email prefix as a hack)
  const { token } = useAuth();
  
  // Extract name from token (Rough hack for now)
  const getUserName = () => {
    if (!token) return "Anonymous";
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub.split('@')[0]; // "abhi@test.com" -> "abhi"
    } catch (e) {
      return "User";
    }
  };

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const stompClientRef = useRef<CompatClient | null>(null);
  const username = getUserName();

  useEffect(() => {
    if (!token) return;

    // 🚨 ENVIRONMENT DETECTION LOGIC 🚨
    // Checks if the window is currently loaded on your local machine or live on Vercel
    const isLocalhost = typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    // Bypasses Vercel Environment UI entirely with clean fallback routing
    const socketUrl = isLocalhost 
      ? 'http://localhost:8080/ws' 
      : 'https://nexus-community-backend-1.onrender.com/ws';

    // 1. Connect to the Dynamic Java Endpoint
    const socket = new SockJS(socketUrl);
    const client = Stomp.over(socket);

    // Disable debug logs to keep console clean
    client.debug = () => {};

    client.connect({}, () => {
      setIsConnected(true);
      
      // 2. Subscribe to Public Topic
      client.subscribe('/topic/public', (payload) => {
        const message = JSON.parse(payload.body);
        setMessages((prev) => [...prev, message]);
      });

      // 3. Tell everyone you joined
      client.send(
        '/app/chat.addUser',
        {},
        JSON.stringify({ sender: username, type: 'JOIN' })
      );
    }, (err: any) => {
      console.error('Socket error:', err);
      setIsConnected(false);
    });

    stompClientRef.current = client;

    // Cleanup on unmount
    return () => {
      if (client.connected) {
        client.disconnect();
      }
    };
  }, [token, username]);

  // Function to send a message
  const sendMessage = (content: string) => {
    if (stompClientRef.current && isConnected) {
      const chatMessage = {
        sender: username,
        content: content,
        type: 'CHAT',
      };
      stompClientRef.current.send(
        '/app/chat.sendMessage',
        {},
        JSON.stringify(chatMessage)
      );
    }
  };

  return { messages, sendMessage, isConnected, username };
};