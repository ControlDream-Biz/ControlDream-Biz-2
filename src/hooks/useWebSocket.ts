'use client';

import { useEffect, useRef, useCallback } from 'react';
import { createWsConnection, type WsMessage } from '@/lib/ws-client';

/**
 * WebSocket 连接 Hook
 * 用于在 React 组件中管理 WebSocket 连接
 */
export function useWebSocket(
  path: string,
  onMessage: (msg: WsMessage) => void,
  onOpen?: () => void,
  onClose?: () => void,
  onError?: (error: Event) => void
) {
  const connRef = useRef<ReturnType<typeof createWsConnection> | null>(null);
  const isConnectedRef = useRef(false);

  useEffect(() => {
    console.log(`[useWebSocket] Connecting to ${path}`);
    
    connRef.current = createWsConnection({
      path,
      onMessage,
      onOpen: () => {
        isConnectedRef.current = true;
        console.log(`[useWebSocket] Connected to ${path}`);
        onOpen?.();
      },
      onClose: () => {
        isConnectedRef.current = false;
        console.log(`[useWebSocket] Disconnected from ${path}`);
        onClose?.();
      },
      onError: (error) => {
        console.error(`[useWebSocket] Error on ${path}:`, error);
        onError?.(error);
      },
    });

    return () => {
      console.log(`[useWebSocket] Cleaning up connection to ${path}`);
      connRef.current?.close();
    };
  }, [path]);

  const send = useCallback(
    (msg: WsMessage): boolean => {
      if (connRef.current && isConnectedRef.current) {
        return connRef.current.send(msg);
      }
      console.warn('[useWebSocket] Cannot send message: not connected');
      return false;
    },
    []
  );

  const close = useCallback(() => {
    connRef.current?.close();
    isConnectedRef.current = false;
  }, []);

  const isConnected = useCallback(() => isConnectedRef.current, []);

  return { send, close, isConnected };
}
