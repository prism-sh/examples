"use client";

import { useState } from "react";
import {
  QueryClient,
  QueryClientProvider as ReactQueryClientProvider,
} from "@tanstack/react-query";
import { AgentProvider } from "@/providers/AgentProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ReactQueryClientProvider client={queryClient}>
      <AgentProvider agentId={process.env.NEXT_PUBLIC_AGENT_ID!}>
        {children}
      </AgentProvider>
    </ReactQueryClientProvider>
  );
}
