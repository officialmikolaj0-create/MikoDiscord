
import React from 'react';
import { User, Server } from './types';

export const CURRENT_USER: User = {
  id: 'user-1',
  username: 'FrontendWizard',
  discriminator: '1337',
  avatar: 'https://picsum.photos/id/64/100/100',
  status: 'online',
};

export const GEMINI_BOT: User = {
  id: 'bot-gemini',
  username: 'Gemini AI',
  discriminator: '0001',
  avatar: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg',
  status: 'online',
  isBot: true,
};

export const SERVERS: Server[] = [
  {
    id: 'server-1',
    name: 'Gemini Community',
    icon: 'https://picsum.photos/id/1/100/100',
    channels: [
      { id: 'chan-1', name: 'general', type: 'text' },
      { id: 'chan-2', name: 'ai-chat', type: 'text', description: 'Chat with Gemini 3 Flash here!' },
      { id: 'chan-3', name: 'showcase', type: 'text' },
      { id: 'chan-4', name: 'voice-lounge', type: 'voice' },
    ],
  },
  {
    id: 'server-2',
    name: 'TypeScript Masters',
    icon: 'https://picsum.photos/id/2/100/100',
    channels: [
      { id: 'chan-5', name: 'help', type: 'text' },
      { id: 'chan-6', name: 'resources', type: 'text' },
    ],
  },
  {
    id: 'server-3',
    name: 'Gaming Hub',
    icon: 'https://picsum.photos/id/3/100/100',
    channels: [
      { id: 'chan-7', name: 'lobby', type: 'text' },
    ],
  },
];
