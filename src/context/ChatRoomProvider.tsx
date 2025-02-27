"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchRoomInfo } from "@/api/getRoomInfo";
import useAutoExitChat from "@/hooks/useAutoExitChat";
import { createContext, useContext, useState } from "react";
import ChatRoom from "@/features/chat/ChatRoom";
import ChatSetting from "@/features/chat/ChatSetting";

interface ChatRoomClientProps {
  roomId: string;
  userId: string;
}

interface ChatUser {
  id: string;
  name: string;
  email: string;
  image: string;
}

interface ChatRoomInfo {
  room_id: string;
  name: string;
  description: string;
  created_at: string;
  users: ChatUser[];
}

const initialRoomInfo: ChatRoomInfo = {
  room_id: "",
  name: "",
  description: "",
  created_at: "",
  users: [],
};

const ChatRoomContext = createContext<{
  roomInfo: ChatRoomInfo;
  refetchRoomInfo: () => void;
  toggleChatSetting: (value: boolean) => void;
  showChatSetting: boolean;
}>({
  roomInfo: initialRoomInfo,
  refetchRoomInfo: () => {},
  toggleChatSetting: () => {},
  showChatSetting: false,
});

export default function ChatRoomProvider({ roomId, userId }: ChatRoomClientProps) {
  const [showChatSetting, toggleChatSetting] = useState(false);
  const { data: roomInfo, refetch: refetchRoomInfo } = useQuery({
    queryKey: ["roomInfo", roomId, userId],
    queryFn: () => fetchRoomInfo(roomId, userId),
    staleTime: 1000 * 60 * 5, // 5분 동안 fresh 유지
  });

  // 언마운트 시 채팅방 자동 종료
  useAutoExitChat(userId, roomId);

  if (!roomInfo) return <div>Loading...</div>;

  return (
    <ChatRoomContext.Provider
      value={{ roomInfo, refetchRoomInfo, toggleChatSetting, showChatSetting }}
    >
      <ChatRoom />
      {showChatSetting && <ChatSetting />}
    </ChatRoomContext.Provider>
  );
}

export function useChatRoom() {
  const context = useContext(ChatRoomContext);
  if (!context) {
    throw new Error("useChatRoom must be used within a ChatRoomProvider");
  }
  return context;
}