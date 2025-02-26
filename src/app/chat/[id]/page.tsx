"use client";

import { useParams } from "next/navigation";
import ChatRoom from "@/features/chat/ChatRoom";
import { useSession } from "next-auth/react";
import { ExtendedSession } from "@/lib/auth";
import useJoinChat from "@/hooks/useJoinChat";
import useAutoExitChat from "@/hooks/useAutoExitChat";
import { ChatRoomContext, WS_URL } from "@/hooks/useChatRoom";

export default function ChatRoomPage() {
  const { id } = useParams();
  const roomId = String(id || "");
  const { data: sessionData } = useSession();
  const session = sessionData as ExtendedSession;
  const { isJoined, users, fetchUsers } = useJoinChat(
    session?.user?.id || "",
    roomId
  );
  useAutoExitChat(session?.user?.id || "", roomId);

  return (
    <ChatRoomContext.Provider value={{ roomId, isJoined, users, fetchUsers, WS_URL }}>
      {(roomId && session && isJoined) ?
      <ChatRoom />
      : <div>채팅방 아이디가 없습니다.</div>}
    </ChatRoomContext.Provider>
  );
}

