import { createContext, useContext } from "react";

export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080";

export const ChatRoomContext = createContext<{
  roomId: string;
  isJoined: boolean;
  users: { user_id: string; name: string; avatar: string }[];
  fetchUsers: () => void;
  WS_URL: string;
}>({
  roomId: "",
  isJoined: false,
  users: [],
  fetchUsers: () => {},
  WS_URL: WS_URL,
});

export function ChatRoomProvider({ children }: { children: React.ReactNode }) {
  const { roomId, isJoined, users, fetchUsers, WS_URL } = useChatRoom();
  return (
    <ChatRoomContext.Provider value={{ roomId, isJoined, users, fetchUsers, WS_URL }}>
      {children}
    </ChatRoomContext.Provider>
  );
}
export function useChatRoom() {
  return useContext(ChatRoomContext);
}
