/**
 * IPC 消息类型定义
 * 主进程和渲染进程共享
 */

export interface ScreenshotResult {
  dataUrl: string;
  width: number;
  height: number;
  displayId?: number;
}

export interface SelectionArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface OllamaMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  images?: string[];
}

export interface OllamaChatRequest {
  model: string;
  messages: OllamaMessage[];
  stream?: boolean;
}

export interface OllamaResponse {
  model: string;
  message: {
    role: 'assistant';
    content: string;
  };
  done: boolean;
}

export interface OllamaStatus {
  running: boolean;
  version?: string;
}

export interface OllamaModel {
  name: string;
  size?: string;
  modified_at?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  image?: string;
}

export type QuickAction = 'translate' | 'explain' | 'code-review' | 'ocr';