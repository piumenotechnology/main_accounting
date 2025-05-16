import { useState, useRef, useEffect } from "react";
import { ChatMessage, TableOption } from "@/types/chat";
import TableSelector from "./TableSelector";
import MobileTableSelector from "./MobileTableSelector";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ChatContainerProps {
  messages: ChatMessage[];
  isLoading: boolean;
  tableOptions: TableOption[];
  selectedTable: string;
  onTableSelect: (table: string) => void;
  onSendMessage: (message: string) => void;
}

export default function ChatContainer({
  messages,
  isLoading,
  tableOptions,
  selectedTable,
  onTableSelect,
  onSendMessage
}: ChatContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Placeholder recent conversations - not functional in MVP
  const recentConversations = [
    { title: "Account reconciliation", timestamp: "2 minutes ago" },
    { title: "Q1 tax preparation", timestamp: "Yesterday" },
    { title: "Expense analysis", timestamp: "3 days ago" }
  ];

  return (
    <div className="flex flex-col flex-grow overflow-hidden rounded-xl bg-white shadow-lg">
      <div className="flex flex-grow overflow-hidden">
        {/* Left sidebar - only visible on larger screens */}
        <div className="hidden md:block w-64 bg-gray-50 border-r border-gray-200 p-4">
          <div className="mb-6">
            <h2 className="text-sm font-medium text-gray-600 mb-2">Select Table</h2>
            <TableSelector 
              options={tableOptions}
              value={selectedTable}
              onChange={onTableSelect}
            />
          </div>
          
          <div>
            <h2 className="text-sm font-medium text-gray-600 mb-2">Recent Conversations</h2>
            <div className="space-y-2">
              {recentConversations.map((convo, index) => (
                <div key={index} className="p-2 rounded-md hover:bg-gray-200 cursor-pointer">
                  <div className="text-sm font-medium text-gray-700 truncate">{convo.title}</div>
                  <div className="text-xs text-gray-500">{convo.timestamp}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Main chat area */}
        <div className="flex-grow flex flex-col overflow-hidden p-4 md:p-6">
          {/* Mobile-only table selector */}
          <div className="md:hidden mb-4">
            <MobileTableSelector 
              options={tableOptions}
              value={selectedTable}
              onChange={onTableSelect}
            />
          </div>
          
          {/* Messages container */}
          <div className="flex-grow overflow-y-auto mb-4 space-y-4 p-2">
            {messages.map(message => (
              <MessageBubble 
                key={message.id}
                role={message.role}
                content={message.content}
              />
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex items-start mb-4">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
                  AI
                </div>
                <div className="ml-3 message-bubble-ai bg-gray-100 p-3 text-sm text-gray-800 max-w-[80%] flex items-center">
                  <div className="spinner w-4 h-4 border-2 border-gray-300 border-t-primary rounded-full mr-2 animate-spin"></div>
                  <p>Thinking...</p>
                </div>
              </div>
            )}
            
            {/* Empty div for scrolling to bottom */}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Error message */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {/* Message input */}
          <MessageInput onSendMessage={onSendMessage} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
}
