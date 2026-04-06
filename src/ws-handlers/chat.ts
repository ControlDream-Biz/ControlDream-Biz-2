import { WebSocket, type WebSocketServer } from 'ws';
import type { WsMessage, ChatMessagePayload, ConversationUpdatePayload, TypingPayload } from '@/lib/ws-client';

/**
 * 客服系统 WebSocket 端点处理器
 * 路径: /ws/chat
 *
 * 功能：
 * 1. 实时推送新消息
 * 2. 实时推送对话状态更新
 * 3. 支持人工接管通知
 * 4. 支持打字指示器
 */

// 存储所有连接的客户端，按对话 ID 分组
const clientsByConversation = new Map<number, Set<WebSocket>>();
// 存储对话 ID 到 WebSocket 的映射
const conversationsByClient = new Map<WebSocket, Set<number>>();

/**
 * 设置聊天 WebSocket 处理器
 */
export function setupChatHandler(wss: WebSocketServer) {
  console.log('[WS Chat] Chat handler initialized');

  wss.on('connection', (ws: WebSocket) => {
    console.log('[WS Chat] New client connected');
    const clientConversations = new Set<number>();
    conversationsByClient.set(ws, clientConversations);

    // 心跳处理
    let alive = true;
    ws.on('message', (raw: Buffer) => {
      try {
        const msg: WsMessage = JSON.parse(raw.toString());

        // 处理心跳
        if (msg.type === 'ping') {
          alive = true;
          ws.send(JSON.stringify({ type: 'pong', payload: null }));
          return;
        }

        // 订阅对话更新
        if (msg.type === 'subscribe') {
          const conversationId = msg.payload as number;
          if (conversationId && !isNaN(conversationId)) {
            clientConversations.add(conversationId);

            if (!clientsByConversation.has(conversationId)) {
              clientsByConversation.set(conversationId, new Set());
            }
            clientsByConversation.get(conversationId)!.add(ws);

            console.log(`[WS Chat] Client subscribed to conversation ${conversationId}`);
          }
        }

        // 取消订阅对话更新
        if (msg.type === 'unsubscribe') {
          const conversationId = msg.payload as number;
          if (conversationId && clientConversations.has(conversationId)) {
            clientConversations.delete(conversationId);
            const clients = clientsByConversation.get(conversationId);
            if (clients) {
              clients.delete(ws);
              if (clients.size === 0) {
                clientsByConversation.delete(conversationId);
              }
            }
            console.log(`[WS Chat] Client unsubscribed from conversation ${conversationId}`);
          }
        }

        // 打字指示器
        if (msg.type === 'typing') {
          const payload = msg.payload as TypingPayload;
          if (payload.conversationId) {
            broadcastToConversation(payload.conversationId, {
              type: 'typing',
              payload: payload,
            }, ws);
          }
        }

      } catch (error) {
        console.error('[WS Chat] Failed to handle message:', error);
      }
    });

    // 定期检查心跳
    const heartbeatInterval = setInterval(() => {
      if (!alive) {
        console.log('[WS Chat] Client heartbeat timeout, closing connection');
        ws.terminate();
        return;
      }
      alive = false;
      ws.ping();
    }, 30000);

    ws.on('pong', () => {
      alive = true;
    });

    // 连接关闭
    ws.on('close', () => {
      console.log('[WS Chat] Client disconnected');
      clearInterval(heartbeatInterval);

      // 清理订阅
      clientConversations.forEach(conversationId => {
        const clients = clientsByConversation.get(conversationId);
        if (clients) {
          clients.delete(ws);
          if (clients.size === 0) {
            clientsByConversation.delete(conversationId);
          }
        }
      });

      conversationsByClient.delete(ws);
    });

    // 连接错误
    ws.onerror = (error) => {
      console.error('[WS Chat] WebSocket error:', error);
    };
  });
}

/**
 * 向订阅特定对话的所有客户端广播消息
 */
export function broadcastToConversation(conversationId: number, message: WsMessage, excludeWs?: WebSocket) {
  const clients = clientsByConversation.get(conversationId);
  if (!clients || clients.size === 0) {
    return;
  }

  const messageStr = JSON.stringify(message);
  clients.forEach(client => {
    if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
      try {
        client.send(messageStr);
      } catch (error) {
        console.error('[WS Chat] Failed to broadcast message:', error);
      }
    }
  });
}

/**
 * 推送新消息
 */
export function broadcastNewMessage(conversationId: number, message: ChatMessagePayload) {
  broadcastToConversation(conversationId, {
    type: 'new-message',
    payload: message,
  });
}

/**
 * 推送对话状态更新
 */
export function broadcastConversationUpdate(conversationId: number, update: ConversationUpdatePayload) {
  broadcastToConversation(conversationId, {
    type: 'conversation-update',
    payload: update,
  });
}

/**
 * 推送人工接管通知
 */
export function broadcastHumanTakeover(conversationId: number) {
  broadcastToConversation(conversationId, {
    type: 'human-takeover',
    payload: { conversationId },
  });
}

/**
 * 推送人工接管释放通知
 */
export function broadcastHumanRelease(conversationId: number) {
  broadcastToConversation(conversationId, {
    type: 'human-release',
    payload: { conversationId },
  });
}

// 导出给外部使用
export {
  clientsByConversation,
  conversationsByClient,
};
