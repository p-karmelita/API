import { useState } from 'react';
import { Send } from 'lucide-react';
import Button from './Button';

interface Message {
  id: number;
  type: 'user' | 'agent';
  content: string;
  timestamp: Date;
}

interface ChatBoxProps {
  onSendMessage: (message: string) => Promise<string>;
}

export default function ChatBox({ onSendMessage }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'agent',
      content: 'Hello! I\'m your PayMind AI assistant. I can help you schedule payments, manage transactions, and automate real estate deals. Try saying something like "Pay rent on the 1st of every month" or "Transfer 600 USDC after contract is signed".',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await onSendMessage(input);

      const agentMessage: Message = {
        id: messages.length + 2,
        type: 'agent',
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, agentMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: messages.length + 2,
        type: 'agent',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg px-4 py-3 ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p
                className={`text-xs mt-1 ${
                  message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}
              >
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your command..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button onClick={handleSend} variant="primary" disabled={isLoading}>
            {isLoading ? '...' : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
