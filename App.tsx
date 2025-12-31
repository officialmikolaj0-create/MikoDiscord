
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { 
  Plus, 
  Compass, 
  Download, 
  Hash, 
  Volume2, 
  Settings, 
  Mic, 
  Headphones, 
  Search, 
  Bell, 
  Pin, 
  Users, 
  Inbox, 
  HelpCircle,
  PlusCircle,
  Gift,
  Sticker,
  Smile,
  SendHorizontal
} from 'lucide-react';
import { Server, Channel, Message, User } from './types';
import { SERVERS, CURRENT_USER, GEMINI_BOT } from './constants';
import { askGemini } from './services/geminiService';

const App: React.FC = () => {
  const [activeServer, setActiveServer] = useState<Server>(SERVERS[0]);
  const [activeChannel, setActiveChannel] = useState<Channel>(SERVERS[0].channels[0]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    'chan-1': [
      {
        id: 'msg-1',
        author: GEMINI_BOT,
        content: 'Welcome to the Gemini Community! Feel free to ask me anything in #ai-chat.',
        timestamp: new Date(),
      }
    ]
  });
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, activeChannel.id, isTyping]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      author: CURRENT_USER,
      content: inputValue,
      timestamp: new Date(),
    };

    const channelId = activeChannel.id;
    setMessages(prev => ({
      ...prev,
      [channelId]: [...(prev[channelId] || []), newMessage]
    }));
    setInputValue('');

    // Trigger AI response if in AI chat or mentioned
    if (activeChannel.name === 'ai-chat' || inputValue.toLowerCase().includes('@gemini')) {
      setIsTyping(true);
      
      const chatHistory = (messages[channelId] || [])
        .slice(-10)
        .map(msg => ({
          role: msg.author.id === GEMINI_BOT.id ? 'model' as const : 'user' as const,
          text: msg.content
        }));

      const aiResponseText = await askGemini(inputValue, chatHistory);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        author: GEMINI_BOT,
        content: aiResponseText,
        timestamp: new Date(),
        isAiResponse: true,
      };

      setMessages(prev => ({
        ...prev,
        [channelId]: [...(prev[channelId] || []), aiMessage]
      }));
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#313338] text-[#dbdee1] overflow-hidden">
      {/* 1. Server Sidebar */}
      <div className="w-[72px] bg-[#1e1f22] flex flex-col items-center py-3 gap-2 flex-shrink-0">
        <div className="w-12 h-12 bg-[#5865f2] rounded-[16px] flex items-center justify-center text-white transition-all cursor-pointer hover:rounded-[16px] group">
          <svg width="28" height="20" viewBox="0 0 28 20" fill="currentColor"><path d="M23.0212 1.67671C21.3107 0.883357 19.4863 0.311345 17.5548 0C17.2737 0.501603 16.9531 1.15933 16.7324 1.67671C14.6534 1.36511 12.5855 1.36511 10.5175 1.67671C10.2968 1.15933 9.96503 0.501603 9.69512 0C7.75336 0.311345 5.91866 0.883357 4.20815 1.67671C0.75133 6.81186 -0.191244 11.8159 0.0593441 16.7456C2.35515 18.4357 4.58249 19.4633 6.77123 20.1367C7.3112 19.4019 7.78423 18.6148 8.18342 17.778C7.39958 17.4831 6.65088 17.1132 5.94017 16.6781C6.12933 16.5385 6.31341 16.3912 6.49132 16.2374C10.8354 18.2381 15.541 18.2381 19.8277 16.2374C20.0056 16.3912 20.1897 16.5385 20.3788 16.6781C19.6681 17.1132 18.9194 17.4831 18.1356 17.778C18.5348 18.6148 19.0078 19.4019 19.5477 20.1367C21.7365 19.4633 23.9749 18.4357 26.2707 16.7456C26.5821 11.2334 25.7383 6.27854 23.0212 1.67671ZM9.65411 13.6829C8.35339 13.6829 7.28821 12.4938 7.28821 11.0336C7.28821 9.5734 8.33233 8.38428 9.65411 8.38428C10.9759 8.38428 12.0411 9.5734 12.0305 11.0336C12.0305 12.4938 10.9759 13.6829 9.65411 13.6829ZM16.6732 13.6829C15.3724 13.6829 14.3073 12.4938 14.3073 11.0336C14.3073 9.5734 15.3514 8.38428 16.6732 8.38428C17.9949 8.38428 19.0601 9.5734 19.0496 11.0336C19.0496 12.4938 17.9949 13.6829 16.6732 13.6829Z"></path></svg>
        </div>
        <div className="w-8 h-[2px] bg-[#35363c] rounded-full mx-auto my-1"></div>
        
        {SERVERS.map((server) => (
          <div 
            key={server.id}
            onClick={() => {
              setActiveServer(server);
              setActiveChannel(server.channels[0]);
            }}
            className={`relative flex items-center justify-center w-12 h-12 rounded-[24px] hover:rounded-[16px] transition-all duration-200 cursor-pointer overflow-hidden group ${activeServer.id === server.id ? 'rounded-[16px]' : ''}`}
          >
            {activeServer.id === server.id && <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-10 bg-white rounded-r-full" />}
            <img src={server.icon} alt={server.name} className="w-full h-full object-cover" />
            <div className="absolute left-16 bg-black text-white px-3 py-1 rounded-md text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl">
              {server.name}
            </div>
          </div>
        ))}

        <div className="w-12 h-12 bg-[#313338] text-[#23a559] rounded-[24px] hover:rounded-[16px] hover:bg-[#23a559] hover:text-white flex items-center justify-center transition-all cursor-pointer group">
          <Plus size={24} />
        </div>
        <div className="w-12 h-12 bg-[#313338] text-[#23a559] rounded-[24px] hover:rounded-[16px] hover:bg-[#23a559] hover:text-white flex items-center justify-center transition-all cursor-pointer group">
          <Compass size={24} />
        </div>
        <div className="w-8 h-[2px] bg-[#35363c] rounded-full mx-auto my-1"></div>
        <div className="w-12 h-12 bg-[#313338] text-[#23a559] rounded-[24px] hover:rounded-[16px] hover:bg-[#23a559] hover:text-white flex items-center justify-center transition-all cursor-pointer group">
          <Download size={24} />
        </div>
      </div>

      {/* 2. Channels Sidebar */}
      <div className="w-60 bg-[#2b2d31] flex flex-col flex-shrink-0">
        <div className="h-12 px-4 flex items-center justify-between border-b border-[#1e1f22] shadow-sm hover:bg-[#35373c] transition-colors cursor-pointer font-bold">
          <span className="truncate">{activeServer.name}</span>
          <svg width="18" height="18" viewBox="0 0 18 18"><path fill="currentColor" d="M4.5 7.5L9 12L13.5 7.5L4.5 7.5Z"></path></svg>
        </div>

        <div className="flex-1 overflow-y-auto pt-4 space-y-4">
          <div className="px-2">
            <div className="flex items-center justify-between px-2 text-[#949ba4] hover:text-[#dbdee1] cursor-pointer group uppercase text-xs font-bold mb-1">
              <span>Text Channels</span>
              <Plus size={14} className="opacity-0 group-hover:opacity-100" />
            </div>
            {activeServer.channels.filter(c => c.type === 'text').map(channel => (
              <div 
                key={channel.id}
                onClick={() => setActiveChannel(channel)}
                className={`flex items-center px-2 py-1.5 rounded-md cursor-pointer group mb-[1px] ${activeChannel.id === channel.id ? 'bg-[#3f4147] text-white' : 'text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1]'}`}
              >
                <Hash size={20} className="mr-1.5 text-[#80848e]" />
                <span className="font-medium truncate">{channel.name}</span>
              </div>
            ))}
          </div>

          <div className="px-2">
            <div className="flex items-center justify-between px-2 text-[#949ba4] hover:text-[#dbdee1] cursor-pointer group uppercase text-xs font-bold mb-1">
              <span>Voice Channels</span>
              <Plus size={14} className="opacity-0 group-hover:opacity-100" />
            </div>
            {activeServer.channels.filter(c => c.type === 'voice').map(channel => (
              <div 
                key={channel.id}
                className="flex items-center px-2 py-1.5 rounded-md text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1] cursor-pointer group mb-[1px]"
              >
                <Volume2 size={20} className="mr-1.5 text-[#80848e]" />
                <span className="font-medium truncate">{channel.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* User Control Panel */}
        <div className="bg-[#232428] h-[52px] px-2 flex items-center justify-between">
          <div className="flex items-center gap-2 p-1 pr-2 hover:bg-[#3f4147] rounded-md transition-colors cursor-pointer group">
            <div className="relative">
              <img src={CURRENT_USER.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#23a559] border-[3px] border-[#232428] rounded-full" />
            </div>
            <div className="flex flex-col leading-tight overflow-hidden">
              <span className="text-sm font-bold text-white truncate">{CURRENT_USER.username}</span>
              <span className="text-[10px] text-[#b5bac1]">#{CURRENT_USER.discriminator}</span>
            </div>
          </div>
          <div className="flex items-center gap-0.5">
            <div className="p-1.5 hover:bg-[#3f4147] rounded-md transition-colors cursor-pointer text-[#b5bac1] hover:text-[#dbdee1]">
              <Mic size={20} />
            </div>
            <div className="p-1.5 hover:bg-[#3f4147] rounded-md transition-colors cursor-pointer text-[#b5bac1] hover:text-[#dbdee1]">
              <Headphones size={20} />
            </div>
            <div className="p-1.5 hover:bg-[#3f4147] rounded-md transition-colors cursor-pointer text-[#b5bac1] hover:text-[#dbdee1]">
              <Settings size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Chat Area */}
      <div className="flex-1 flex flex-col bg-[#313338] min-w-0">
        {/* Chat Header */}
        <div className="h-12 px-4 flex items-center justify-between border-b border-[#1e1f22] shadow-sm flex-shrink-0">
          <div className="flex items-center gap-2 overflow-hidden">
            <Hash size={24} className="text-[#80848e] flex-shrink-0" />
            <span className="font-bold text-white whitespace-nowrap">{activeChannel.name}</span>
            {activeChannel.description && (
              <>
                <div className="w-[1px] h-6 bg-[#3f4147] mx-2 flex-shrink-0" />
                <span className="text-sm text-[#b5bac1] truncate">{activeChannel.description}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-4 text-[#b5bac1]">
            <Bell size={24} className="hover:text-[#dbdee1] cursor-pointer transition-colors hidden sm:block" />
            <Pin size={24} className="hover:text-[#dbdee1] cursor-pointer transition-colors hidden sm:block" />
            <Users size={24} className="hover:text-[#dbdee1] cursor-pointer transition-colors" />
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search" 
                className="bg-[#1e1f22] text-sm h-6 px-2 rounded w-36 outline-none hidden md:block" 
              />
              <Search size={16} className="absolute right-1.5 top-1 text-[#949ba4] hidden md:block" />
            </div>
            <Inbox size={24} className="hover:text-[#dbdee1] cursor-pointer transition-colors hidden sm:block" />
            <HelpCircle size={24} className="hover:text-[#dbdee1] cursor-pointer transition-colors hidden sm:block" />
          </div>
        </div>

        {/* Messages List */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 pt-4 space-y-6 flex flex-col"
        >
          {/* Channel Start Welcome */}
          <div className="mb-8">
            <div className="w-16 h-16 bg-[#41434a] rounded-full flex items-center justify-center mb-2">
              <Hash size={40} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-1">Welcome to #{activeChannel.name}!</h1>
            <p className="text-[#b5bac1]">This is the start of the #{activeChannel.name} channel.</p>
            <div className="w-full h-[1px] bg-[#3f4147] mt-8" />
          </div>

          {(messages[activeChannel.id] || []).map((msg, idx) => {
            const isSameUserAsPrev = idx > 0 && messages[activeChannel.id][idx-1].author.id === msg.author.id && 
              (new Date(msg.timestamp).getTime() - new Date(messages[activeChannel.id][idx-1].timestamp).getTime() < 300000);

            if (isSameUserAsPrev) {
              return (
                <div key={msg.id} className="pl-14 -mt-5 group relative hover:bg-[#2e3035] -mx-4 px-4 py-0.5">
                  <span className="absolute left-2 top-1 opacity-0 group-hover:opacity-100 text-[10px] text-[#949ba4] w-10 text-right">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <div className="text-[#dbdee1] whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                </div>
              );
            }

            return (
              <div key={msg.id} className="flex gap-4 group hover:bg-[#2e3035] -mx-4 px-4 py-1 transition-colors">
                <img src={msg.author.avatar} alt="avatar" className="w-10 h-10 rounded-full flex-shrink-0 cursor-pointer hover:shadow-lg mt-0.5" />
                <div className="flex flex-col flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium cursor-pointer hover:underline ${msg.author.id === GEMINI_BOT.id ? 'text-[#34d399]' : 'text-white'}`}>
                      {msg.author.username}
                    </span>
                    {msg.author.isBot && (
                      <span className="bg-[#5865f2] text-[10px] text-white px-1 rounded flex items-center h-4 font-bold tracking-tighter">BOT</span>
                    )}
                    <span className="text-xs text-[#949ba4]">
                      {msg.timestamp.toLocaleDateString() === new Date().toLocaleDateString() 
                        ? `Today at ${msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` 
                        : msg.timestamp.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-[#dbdee1] whitespace-pre-wrap leading-relaxed">
                    {msg.content}
                  </div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-4 animate-pulse">
              <img src={GEMINI_BOT.avatar} alt="avatar" className="w-10 h-10 rounded-full flex-shrink-0 opacity-50" />
              <div className="flex flex-col gap-2 pt-1">
                <div className="h-4 w-24 bg-[#3f4147] rounded" />
                <div className="h-4 w-48 bg-[#3f4147] rounded" />
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="px-4 pb-6 pt-2">
          <form 
            onSubmit={handleSendMessage}
            className="bg-[#383a40] rounded-lg flex items-center px-4 min-h-[44px]"
          >
            <PlusCircle className="text-[#b5bac1] hover:text-[#dbdee1] cursor-pointer mr-4" />
            <input 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Message #${activeChannel.name}`}
              className="flex-1 bg-transparent border-none outline-none py-2.5 text-[#dbdee1] placeholder-[#949ba4]"
            />
            <div className="flex items-center gap-3 text-[#b5bac1] ml-4">
              <Gift className="hover:text-[#dbdee1] cursor-pointer hidden sm:block" />
              <Sticker className="hover:text-[#dbdee1] cursor-pointer hidden sm:block" />
              <Smile className="hover:text-[#dbdee1] cursor-pointer" />
              <button type="submit" className="text-[#5865f2] hover:text-[#4752c4] disabled:opacity-50" disabled={!inputValue.trim()}>
                <SendHorizontal size={20} />
              </button>
            </div>
          </form>
          <div className="mt-1 text-[10px] text-[#b5bac1] flex gap-1">
            <span className="font-bold text-[#f23f42]">Pro Tip:</span> 
            <span>Try asking Gemini about TypeScript or React! Mention @gemini or chat in #ai-chat.</span>
          </div>
        </div>
      </div>

      {/* 4. Members List Sidebar (Hidden on small screens) */}
      <div className="w-60 bg-[#2b2d31] flex flex-col flex-shrink-0 border-l border-[#1e1f22] hidden lg:flex">
        <div className="flex-1 overflow-y-auto pt-6 px-4">
          <h2 className="text-[#949ba4] text-xs font-bold uppercase mb-4 tracking-wider">Online — 2</h2>
          <div className="space-y-4">
            {/* User item */}
            <div className="flex items-center gap-3 p-1.5 hover:bg-[#3f4147] rounded-md transition-colors cursor-pointer group">
              <div className="relative">
                <img src={GEMINI_BOT.avatar} alt="bot" className="w-8 h-8 rounded-full" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#23a559] border-[3px] border-[#2b2d31] rounded-full" />
              </div>
              <div className="flex flex-col leading-tight">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-[#34d399]">{GEMINI_BOT.username}</span>
                  <span className="bg-[#5865f2] text-[8px] text-white px-1 rounded font-bold h-3 flex items-center">BOT</span>
                </div>
                <span className="text-[11px] text-[#b5bac1] truncate">Helping you build...</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-1.5 hover:bg-[#3f4147] rounded-md transition-colors cursor-pointer group">
              <div className="relative">
                <img src={CURRENT_USER.avatar} alt="user" className="w-8 h-8 rounded-full" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#23a559] border-[3px] border-[#2b2d31] rounded-full" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-bold text-white group-hover:text-white">{CURRENT_USER.username}</span>
                <span className="text-[11px] text-[#b5bac1] truncate">Coding hard 💻</span>
              </div>
            </div>
          </div>

          <h2 className="text-[#949ba4] text-xs font-bold uppercase mb-4 mt-8 tracking-wider">Offline — 12</h2>
          <div className="space-y-4 opacity-60 grayscale-[0.5]">
             {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-1.5 hover:bg-[#3f4147] rounded-md transition-colors cursor-pointer group">
                  <div className="relative">
                    <img src={`https://picsum.photos/id/${100+i}/50/50`} alt="user" className="w-8 h-8 rounded-full" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#80848e] border-[3px] border-[#2b2d31] rounded-full" />
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-sm font-bold text-[#b5bac1]">User_{i + 124}</span>
                  </div>
                </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
