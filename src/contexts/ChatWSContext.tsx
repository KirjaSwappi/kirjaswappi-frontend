import { createContext, useContext, ReactNode } from 'react';
import { useChatWS } from '../hooks/useChatWS';

type ChatWSContextType = ReturnType<typeof useChatWS>;

const ChatWSContext = createContext<ChatWSContextType | null>(null);

export function ChatWSProvider({ children }: { children: ReactNode }) {
  const chatWS = useChatWS();
  return <ChatWSContext.Provider value={chatWS}>{children}</ChatWSContext.Provider>;
}

export function useChatWSContext(): ChatWSContextType {
  const ctx = useContext(ChatWSContext);
  if (!ctx) throw new Error('useChatWSContext must be used within ChatWSProvider');
  return ctx;
}
