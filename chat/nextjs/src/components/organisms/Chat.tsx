"use client";

import React, { useEffect, useState } from "react";
import { useAgent } from "@/providers/AgentProvider";
import { useChat } from "ai/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ReactMarkdown from "react-markdown";
import {
  agentPlaygroundSchema,
  AgentPlaygroundValues,
} from "@/lib/validators/agent-form";
import { cn, copyToClipboard } from "@/lib/utils";
import { WrenchIcon, CopyIcon } from "lucide-react";
import { spinner } from "../atoms/Spinner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Label } from "@radix-ui/react-label";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";

export default function Chat() {
  const { agent } = useAgent();

  // Form for the agent playground
  const form = useForm<AgentPlaygroundValues>({
    resolver: zodResolver(agentPlaygroundSchema),
    defaultValues: {
      message: "Tell me about the history of Solana.",
      tools: [],
    },
  });
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      initialMessages: [
        {
          id: "1",
          role: "assistant",
          content: agent
            ? "Hi! What can I help you with on Solana today?"
            : "Agent not found.",
        },
      ],
      api: "/api/chat",
      body: {
        host: agent?.host,
        tools: form.getValues("tools"),
        api_key: agent?.api_key,
        auth_enabled: agent?.auth_enabled,
      },
      onError: (error) => {
        // Push an error message to the chat
        messages.push({
          id: String(messages.length + 1),
          role: "assistant",
          content: `Sorry, I am unable to process your request at the moment. And no, Solana isn't broken! Error message: ${error.message}`,
        });
      },
    });

  // State to handle tool start message
  const [isToolStart, setIsToolStart] = useState(false);
  // State to handle selected tool names
  const [selectedToolNames, setSelectedToolNames] = useState<string[]>([]);

  useEffect(() => {
    // When the tool starts and the m.content is "on_tool_start", set isToolStart to true
    if (messages[messages.length - 1]?.content === '"on_tool_start"') {
      setIsToolStart(true);
    }
  }, [messages]);

  // Function to clean the message content
  const cleanMessageContent = (content: string) => {
    // Remove "on_tool_start" and any surrounding quotes
    const cleanedContent = content.replace(/"on_tool_start"/g, "").trim();
    console.log("Cleaned Markdown content:", cleanedContent); // Log the cleaned content
    return cleanedContent;
  };

  return (
    <div className="w-full mx-auto space-y-8">
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col-reverse w-full border border-foreground/20 bg-foreground/5 rounded h-80 overflow-auto">
            <div>
              {messages.map((m) => (
                <div key={m.id} className="whitespace-pre-wrap p-2">
                  <div className="flex flex-row justify-between">
                    {m.role === "user" ? (
                      <Badge variant={"outline"}>User</Badge>
                    ) : (
                      <div className="flex flex-row items-center gap-2">
                        <Badge variant={"secondary"}>
                          {agent?.name || "Agent"}
                        </Badge>
                        {isToolStart &&
                          m.id === messages[messages.length - 1]?.id && (
                            <div
                              className={cn(
                                "text-foreground text-xs flex flex-row items-center gap-1",
                                isLoading && "animate-pulse text-foreground/50 "
                              )}
                            >
                              <WrenchIcon className="w-3 h-3" />:{" "}
                              {selectedToolNames.join(" ")}
                            </div>
                          )}
                      </div>
                    )}
                    <button
                      onClick={() =>
                        copyToClipboard(cleanMessageContent(m.content))
                      }
                      className="text-foreground/40 h-fit w-fit p-1"
                    >
                      <CopyIcon size={16} />
                    </button>
                  </div>
                  <div
                    className={
                      (cn(
                        m.role === "user"
                          ? "bg-transparent text-foreground/40"
                          : "bg-input text-foreground"
                      ),
                      "text-sm px-4 py-2 w-full")
                    }
                  >
                    {m.role === "user" ? (
                      m.content
                    ) : (
                      <>
                        {isLoading &&
                        m.id === messages[messages.length - 1]?.id ? (
                          spinner
                        ) : (
                          <ReactMarkdown>
                            {cleanMessageContent(m.content)}
                          </ReactMarkdown>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* {agent?.contexts && agent?.contexts?.length > 0 && (
            <div className="w-full gap-3 flex flex-col">
              <Label htmlFor="toolkit">Available Contexts</Label>
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7">
                {agent.contexts?.map((context) => (
                  <Badge
                    className="w-fit h-fit "
                    variant={"outline"}
                    key={context.id}
                  >
                    {context.name}
                  </Badge>
                ))}
              </div>
            </div>
          )} */}

          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* <FormField
                control={form.control}
                name="tools"
                render={() => (
                  <FormItem>
                    <FormLabel>Select a Tool</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={tools || []}
                        onValueChange={(selectedToolsIds) => {
                          const selectedTools = tools
                            ?.filter((tool) =>
                              selectedToolsIds.includes(tool.id)
                            )
                            .map((tool) => tool.id);
                          setSelectedToolNames(
                            tools
                              ?.filter((tool) =>
                                selectedToolsIds.includes(tool.id)
                              )
                              .map((tool) => tool.name)
                          );
                          form.setValue("tools", selectedTools || [], {
                            shouldValidate: true,
                          });
                        }}
                        placeholder="View available tools"
                        animation={2}
                        variant={"default"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <FormField
                control={form.control}
                name="message"
                render={() => (
                  <FormItem>
                    <FormLabel>Prompt</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Tell me about the history of Solana."
                        value={input}
                        onChange={handleInputChange}
                        className="border border-foreground/20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
