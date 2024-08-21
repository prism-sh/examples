"use client";

import { useState } from "react";
import { useChat } from "ai/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowBigUp } from "lucide-react";

export default function Component() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    initialMessages: [
      {
        id: "1",
        role: "assistant",
        content: "Hello! I'm your PRISM agent. How can I assist you?",
      },
    ],
    api: "/api/chat",
    body: {
      host: process.env.NEXT_PUBLIC_PRISM_HOST_URL,
      // tools: form.getValues("tools"),
      tools: [],
      api_key: process.env.NEXT_PUBLIC_PRISM_API_SECRET,
      auth_enabled: true,
    },
    // onFinish: (message) => {
    //   setCurrentMessages((prevMessages) => [...prevMessages, message]);
    // },
    onError: (error) => {
      console.error(error);
    },
  });

  return (
    <div className="flex flex-col w-full max-w-md mx-auto h-[600px] bg-background border rounded-lg overflow-hidden">
      <ScrollArea className="flex-1 p-4 text-sm md:text-base">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.role === "assistant" ? "text-black" : "text-slate-600"
            }`}
          >
            <span className="font-bold">
              {message.role === "assistant" ? "AI: " : "You: "}
            </span>
            {message.content}
          </div>
        ))}
      </ScrollArea>
      <form
        onSubmit={handleSubmit}
        className="p-4 border-t text-sm md:text-base"
      >
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message here..."
            className="flex-1 text-sm! md:text-base!"
          />
          <Button type="submit" className="md:hidden">
            <ArrowBigUp size={20} />
          </Button>
          <Button type="submit" className="hidden md:block">
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}
