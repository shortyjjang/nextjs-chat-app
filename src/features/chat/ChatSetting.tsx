import { exitChatRoom } from "@/api/exitChatRoom";
import { useChatRoom } from "@/context/ChatRoomProvider";
import { useUserInfo } from "@/hooks/useUserInfo";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

export default function ChatSetting() {
  const router = useRouter();
  const { roomInfo, showChatSetting } = useChatRoom();
  const { id: userId } = useUserInfo();
  if (!userId) {
    return null;
  }
  const closeChat = async () => {
    try {
      const res = await exitChatRoom(roomInfo.room_id, userId);
      if (!res) {
        alert("채팅방 나가기 실패");
      } else {
        router.push("/chat");
      }
    } catch (error) {
      console.error("Error exiting chat room:", error);
      alert("채팅방 나가기 중 오류가 발생했습니다.");
    }
  };
  return (
    <div
      className="flex flex-col gap-4 fixed top-0 right-0 p-4 bg-white shadow-lg z-50 will-change-transform"
      style={{
        transform: showChatSetting ? "translateX(0)" : "translateX(100%)",
      }}
    >
      <h1>{roomInfo.name}</h1>
      <p>{roomInfo.description}</p>
      <p>{roomInfo.created_at}</p>
      <div>
        <h2>참여자</h2>
        <ul>
          {roomInfo.users.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      </div>
      <div>
        <button onClick={closeChat}>채팅방 나가기</button>
        <button onClick={() => signOut()}>로그아웃</button>
      </div>
    </div>
  );
}
