import { UUID } from 'crypto'

export enum AgentStatus {
  CREATED = 'Created',
  PROVISIONING = 'Provisioning',
  PROVISIONED = 'Provisioned',
  DEPROVISIONING = 'Deprovisioning',
  DEPROVISIONED = 'Deprovisioned',
  ERRORED = 'Errored',
  ACTIVE = 'Active',
  STARTING = 'Starting',
  STOPPING = 'Stopping',
  STOPPED = 'Stopped',
  DELETING = 'Deleting',
  DELETED = 'Deleted',
  HEALTHY = 'Healthy',
  DEGRADED = 'Degraded',
  INACTIVE = 'Inactive',
  PAYMENT_PENDING = 'Payment Required',
  PAYMENT_PROCESSING = 'Processing Payment',
}

export enum AgentAction {
  START = 'start',
  STOP = 'stop',
  RESTART = 'restart',
}

export interface Agent {
  id: UUID
  api_key?: string
  contexts: {
    id: string | null
    name: string | null
  }[]
  user_id: string
  name: string
  description: string
  model: string
  prompt: string
  created_at: string
  updated_at: string
  host: string
  status: AgentStatus
  auth_enabled: boolean
  restart_required: boolean
  upgrade_available: boolean
  addons: {
    agent_wallet: {
      enabled: boolean
      wallet_address?: string
    }
  }
}

export interface NewAgent {
  context_id: string
  name: string
  description: string
  model: string
  prompt: string
}

export interface UpdateAgentRequest {
  name: string
  description: string
  prompt: string
  auth_enabled: boolean
}

export interface NewAPIKey {
  id: string
  api_key: string
}

export type InvokeRequest = {
  input: {
    input: string
    tools: string[]
  }
  config: object
  kwargs: object
}

export type AIStreamResponse =
  | { event: 'metadata'; data: { run_id: string } }
  | { event: 'data'; data: string }
  | {
    event: 'data'
    data: {
      type: 'on_chain_start'
      event: 'agent'
      data: { input: { input: string } }
    }
  }
  | {
    event: 'data'
    data: {
      type: 'on_chain_end'
      event: 'agent'
      data: { output: { output: string; messages: Message[] } }
    }
  }
  | { event: 'end' }

export interface Message {
  content: string
  additional_kwargs: object
  type: string
  name: string | null
  id: string | null
  example: boolean
}

export type ResponseChunk = {
  event: string
  name: string
  run_id: string
  tags: string[]
  metadata: object
  data: {
    input: {
      input: string
      tools: string[]
    }
  }
}
