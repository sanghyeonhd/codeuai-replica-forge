
import { Send, User, Bot } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '안녕하세요! 코드 작성을 도와드릴 준비가 되었습니다. 무엇을 만들어보시겠어요?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: '네, 도와드리겠습니다! 구체적으로 어떤 기능을 구현하고 싶으신가요?',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-3 border-b border-sidebar-border">
        <h3 className="text-sm font-medium text-sidebar-foreground">AI Assistant</h3>
      </div>
      
      <div className="flex-1 overflow-auto custom-scrollbar p-3 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2 ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            {!message.isUser && (
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="h-3 w-3 text-white" />
              </div>
            )}
            <div
              className={`max-w-[80%] p-2 rounded-lg text-sm ${
                message.isUser
                  ? 'bg-primary text-white'
                  : 'bg-sidebar-accent text-sidebar-foreground'
              }`}
            >
              {message.content}
            </div>
            {message.isUser && (
              <div className="w-6 h-6 rounded-full bg-sidebar-accent flex items-center justify-center flex-shrink-0 mt-1">
                <User className="h-3 w-3 text-sidebar-foreground" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-sidebar-border">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="메시지를 입력하세요..."
            className="flex-1 bg-sidebar-accent border-sidebar-border text-sidebar-foreground"
          />
          <Button
            onClick={handleSendMessage}
            size="sm"
            className="bg-primary hover:bg-primary/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
