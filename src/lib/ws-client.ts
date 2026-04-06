/**
 * WebSocket 消息类型定义
 */
export interface WsMessage<T = unknown> {
  type: string;
  payload: T;
}

/**
 * WebSocket 连接选项
 */
export interface WsOptions {
  path: string; // 例如 '/ws/chat'
  onMessage: (msg: WsMessage) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  reconnect?: boolean; // 默认: true
  heartbeatMs?: number; // 默认: 30000
}

/**
 * 创建 WebSocket 连接
 * 提供自动重连、心跳机制等高级功能
 */
export function createWsConnection(opts: WsOptions): {
  send: (msg: WsMessage) => void;
  close: () => void;
  isConnected: () => boolean;
} {
  const {
    path,
    onMessage,
    onOpen,
    onClose,
    onError,
    reconnect = true,
    heartbeatMs = 30000,
  } = opts;

  let ws: WebSocket | null = null;
  let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  let closed = false;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  function cleanup() {
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer);
      heartbeatTimer = null;
    }
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
  }

  function connect() {
    // 使用当前协议和域名
    const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${location.host}${path}`;

    try {
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log(`[WS] Connected to ${path}`);
        // 启动心跳
        heartbeatTimer = setInterval(() => {
          if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'ping', payload: null }));
          }
        }, heartbeatMs);
        onOpen?.();
      };

      ws.onmessage = (e) => {
        try {
          const msg: WsMessage = JSON.parse(e.data);
          // 忽略心跳响应
          if (msg.type === 'pong') return;
          onMessage(msg);
        } catch (error) {
          console.error('[WS] Failed to parse message:', error);
        }
      };

      ws.onclose = (event) => {
        console.log(`[WS] Disconnected from ${path}`, event.code, event.reason);
        cleanup();
        onClose?.();

        // 自动重连
        if (reconnect && !closed) {
          reconnectTimer = setTimeout(() => {
            console.log(`[WS] Reconnecting to ${path}...`);
            connect();
          }, 1000);
        }
      };

      ws.onerror = (error) => {
        console.error(`[WS] Error on ${path}:`, error);
        onError?.(error);
      };
    } catch (error) {
      console.error('[WS] Failed to create WebSocket:', error);
      if (reconnect && !closed) {
        reconnectTimer = setTimeout(connect, 1000);
      }
    }
  }

  // 启动连接
  connect();

  return {
    send: (msg) => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(JSON.stringify(msg));
          return true;
        } catch (error) {
          console.error('[WS] Failed to send message:', error);
          return false;
        }
      }
      console.warn('[WS] WebSocket is not connected');
      return false;
    },
    close: () => {
      closed = true;
      cleanup();
      if (ws) {
        ws.close();
        ws = null;
      }
    },
    isConnected: () => ws?.readyState === WebSocket.OPEN,
  };
}

/**
 * 客服系统专用 WebSocket 消息类型
 */
export interface ChatMessagePayload {
  conversationId: number;
  message: {
    id: number;
    type: 'user' | 'agent' | 'bot';
    content: string;
    senderId?: string;
    agentId?: string;
    createdAt: Date;
  };
}

export interface ConversationUpdatePayload {
  conversationId: number;
  status: string;
  isHumanTakeover: boolean;
}

export interface TypingPayload {
  conversationId: number;
  isTyping: boolean;
}
