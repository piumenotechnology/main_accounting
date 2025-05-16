import React from "react";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  role: 'user' | 'ai';
  content: string;
}

export default function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === 'user';
  
  return (
    <div className={cn(
      "flex items-start mb-4",
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && (
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
          AI
        </div>
      )}
      
      <div className={cn(
        "p-3 rounded-lg text-sm max-w-[80%]",
        isUser 
          ? "ml-auto bg-primary text-white" 
          : "ml-3 bg-gray-100 text-gray-800"
      )}>
        <p className="whitespace-pre-wrap">{content}</p>
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-300 ml-3 flex items-center justify-center text-gray-700">
          You
        </div>
      )}
    </div>
  );
}