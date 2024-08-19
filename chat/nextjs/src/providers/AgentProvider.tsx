"use client";

import { useQuery } from "@tanstack/react-query";
import React, { createContext, useContext, useState } from "react";

import useApi from "@/hooks/useApi";
import { Agent } from "@/lib/domain/agent/schemas";

interface AgentContextType {
  agent: Agent | null;
  setAgent: React.Dispatch<React.SetStateAction<Agent | null>>;
  isLoading: boolean;
  error: Error | null;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export const AgentProvider: React.FC<{
  agentId: string;
  children: React.ReactNode;
  initialAgent?: Agent;
}> = ({ agentId, initialAgent, children }) => {
  const api = useApi();

  const [agent, setAgent] = useState<Agent | null>(initialAgent || null);
  const [error, setError] = useState<Error | null>(null);

  const { isLoading } = useQuery({
    queryKey: ["agent", agentId],
    queryFn: async () => {
      if (!agentId) {
        throw new Error("Must be initialized with agentId");
      }
      const fetchedData = await api
        .get(`agents/${agentId}?with_addons=true`)
        .json<Agent>();
      setAgent(fetchedData);
      return fetchedData;
    },
    initialData: initialAgent,
    refetchInterval: 30000, // 30 seconds in milliseconds
    refetchIntervalInBackground: false,
  });

  const value: AgentContextType = {
    agent,
    setAgent,
    isLoading,
    error,
  };

  return (
    <AgentContext.Provider value={value}>{children}</AgentContext.Provider>
  );
};

export const useAgent = () => {
  const context = useContext(AgentContext);
  if (context === undefined) {
    throw new Error("useAgent must be used within an AgentProvider");
  }
  return context;
};
