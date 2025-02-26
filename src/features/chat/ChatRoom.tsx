import { useEffect, useState } from "react";
import useWebSocket from "@/hooks/useWebSocket";
import useFileUpload from "@/hooks/useFileUpload";
import { useSession } from "next-auth/react";
import { ExtendedSession } from "@/lib/auth";
import ChatDialog from "./ChatDialog";
import { useChatRoom } from "@/hooks/useChatRoom";

export default function ChatRoom() {
  const { roomId, WS_URL, fetchUsers } = useChatRoom();
  const { data: sessionData } = useSession();
  const session = sessionData as ExtendedSession;
  const { socket, isConnected, messages, sendMessage } = useWebSocket(
    WS_URL,
    session?.user?.id || "",
    roomId
  );
  const { uploadFile } = useFileUpload(socket);
  const [input, setInput] = useState("");

  const handleSendMessage = () => {
    sendMessage({ type: "message", content: input });
    setInput("");
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      uploadFile(Array.from(files));
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.type === "join") {
        fetchUsers();
      }
    }
  }, [fetchUsers, messages]);
  return (
    <div>
      <h1>WebSocket 채팅</h1>
      <p>{isConnected ? "✅ 연결됨" : "❌ 연결 끊김"}</p>

      <div>
        {messages.map((msg, index) => (
          <ChatDialog key={index} msg={msg} />
        ))}
      </div>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="메시지를 입력하세요"
      />
      <button onClick={handleSendMessage}>전송</button>

      <input
        type="file"
        accept="image/*"
        multiple={true}
        onChange={handleFileChange}
      />
    </div>
  );
}
