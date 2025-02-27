import { useEffect, useRef, useState } from "react";
import useWebSocket from "@/hooks/useWebSocket";
import useFileUpload from "@/hooks/useFileUpload";
import ChatDialog from "./ChatDialog";
import { useChatRoom } from "@/context/ChatRoomProvider";
import { IoMdMic } from "react-icons/io";
import { GrGallery } from "react-icons/gr";
import { useUserInfo } from "@/hooks/useUserInfo";

export default function ChatRoom() {
  const { roomInfo, refetchRoomInfo, toggleChatSetting, showChatSetting } = useChatRoom();
  const { id: userId } = useUserInfo();
  const [files, setFiles] = useState<File[]>([]);
  const { socket, isConnected, messages, sendMessage } = useWebSocket(
    process.env.NEXT_PUBLIC_WS_URL || "",
    userId || "",
    roomInfo.room_id
  );
  const { uploadFile } = useFileUpload(socket);
  const [input, setInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if (files.length > 0) {
      uploadFile(files);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
        fileInputRef.current.files = null;
        setFiles([]);
      }
    }
    sendMessage({ type: "message", content: input });
    setInput("");
  };
  

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.type === "join") {
        refetchRoomInfo();
      }
    }
  }, [messages, refetchRoomInfo]);
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col justify-between sticky top-0 bg-white p-4 z-10">
        <h1>{roomInfo.name}</h1>
        <small className="text-gray-500 text-xs">
          {roomInfo.users.length}명 참여중
        </small>
        {!isConnected && (
          <p className="text-red-500 text-xs">❌ 연결 끊김</p>
        )}
        <button onClick={() => toggleChatSetting(!showChatSetting)}>설정</button>
      </div>

      <div className="flex-1 p-4">
        {messages.map((msg, index) => (
          <ChatDialog key={index} msg={msg} />
        ))}
      </div>

      <form
        onSubmit={handleSendMessage}
        className="p-4 sticky bottom-0 bg-white z-10 flex flex-col gap-2 border-t border-gray-200"
      >
        <input
          type="text"
          value={input}
          className="w-full"
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지를 입력하세요"
        />
        <div className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <GrGallery />
              <input
                type="file"
                accept="image/*"
                multiple={true}
                ref={fileInputRef}
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => setFiles(Array.from(e.target.files || []))}
              />
            </div>
            <button type="button">
              <IoMdMic />
            </button>
          </div>
          <button type="submit">전송</button>
        </div>
      </form>
    </div>
  );
}
