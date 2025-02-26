import { useEffect, useState } from "react";

const MAX_MESSAGE_SIZE = 1024 * 10; // 10KB

export default function useWebSocket(url: string, token: string, roomId: string) {
  const [socket, setSocket] = useState<WebSocket | undefined>(undefined);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<
    {
      content: string;
      type: string;
      url?: string[];
      user_id: string;
    }[]
  >([]);

  useEffect(() => {
    let ws: WebSocket | undefined;

    const connect = () => {
      ws = new WebSocket(`${url}?token=${token}&roomId=${roomId}`);

      ws.onopen = () => {
        setIsConnected(true);
        console.log("WebSocket 연결됨");
      };

      ws.onmessage = (event: MessageEvent) => {

        setMessages(
          (prev: { content: string; type: string; url?: string[], user_id: string }[]) => [
            ...prev,
            JSON.parse(event.data),
          ]
        );
      };

      ws.onclose = () => {
        setIsConnected(false);
        console.log("연결 종료, 3초 후 재연결 시도...");
        setTimeout(connect, 3000);
      };

      setSocket(ws);
    };

    connect();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [url, token, roomId]);

  const checkMessageSize = (message: {
    content: string;
    type: string;
    url?: string;
  }) => {
    const messageSize = new TextEncoder().encode(message.content).length; // UTF-8 바이트 길이 계산

    if (messageSize > MAX_MESSAGE_SIZE) {
      alert("메시지가 너무 큽니다! (10KB 이하로 입력해주세요.)");
      return false;
    }
    return true;
  };

  const sendMessage = (message: {
    content: string;
    type: string;
    url?: string;
  }) => {
    if (!checkMessageSize(message)) return;
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  };

  return { socket, isConnected, messages, sendMessage };
}
