import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { v4 as uuidv4 } from 'uuid';
import { sendChatMessage } from "@/lib/chatApi";
import { ChatMessage, TableOption } from "@/types/chat";
import { useToast } from "@/hooks/use-toast";
import ChatContainer from "@/components/ChatContainer";

// Function to generate a session ID or retrieve from localStorage
const getOrCreateSessionId = (): string => {
  const storedSessionId = localStorage.getItem('accounting_chat_session_id');
  
  if (storedSessionId) {
    return storedSessionId;
  } else {
    const newSessionId = `session-${uuidv4()}`;
    localStorage.setItem('accounting_chat_session_id', newSessionId);
    return newSessionId;
  }
};

// Available table options
const TABLE_OPTIONS: TableOption[] = [
  { value: "", label: "No table (general query)" },
  { value: "closed_deal", label: "Closed Deal" },
  { value: "invoice", label: "Invoice" },
  { value: "payment", label: "Payment" },
  { value: "ar", label: "AR" },
  { value: "ap", label: "AP" }
];

// Initial welcome message
const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: uuidv4(),
    role: 'ai',
    content: "Hello! I'm your accounting assistant. How can I help you today? You can select a specific table from the dropdown to focus our conversation.",
    timestamp: new Date()
  }
];

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [sessionId] = useState<string>(getOrCreateSessionId());
  const { toast } = useToast();

  // Mutation for sending messages to API
  const sendMessageMutation = useMutation({
    mutationFn: sendChatMessage,
    onSuccess: (data) => {
      // Add AI response to messages
      const aiMessage: ChatMessage = {
        id: uuidv4(),
        role: 'ai',
        content: data.response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get response",
        variant: "destructive"
      });
    }
  });

  // Handle sending a new message
  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;
    
    // Add user message to state
    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content: message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Create payload with selected table
    const payload = {
      session_id: sessionId,
      table: selectedTable,
      message: message
    };
    
    // Log payload to confirm table is included
    console.log('Sending payload:', payload);
    
    // Send to API
    sendMessageMutation.mutate(payload);
  };

  // Handle table selection
  const handleTableSelect = (table: string) => {
    setSelectedTable(table);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="flex flex-col h-screen max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-800">Accounting AI Assistant</h1>
          </div>
          
          {/* Session indicator */}
          <div className="flex items-center bg-green-100 px-3 py-1 rounded-full">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm text-green-700 font-medium">{sessionId}</span>
          </div>
        </header>
        
        <ChatContainer 
          messages={messages}
          isLoading={sendMessageMutation.isPending}
          tableOptions={TABLE_OPTIONS}
          selectedTable={selectedTable}
          onTableSelect={handleTableSelect}
          onSendMessage={handleSendMessage}
        />
        
        <footer className="mt-4 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Accounting AI Assistant</p>
        </footer>
      </div>
    </div>
  );
}
