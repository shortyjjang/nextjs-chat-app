import { getServerSession } from "next-auth/next";
import { authOptions, ExtendedSession } from "@/lib/auth";
import { getRoomInfoPrefetch } from "@/api/getRoomInfo";
import { redirect } from "next/navigation";
import ChatRoomProvider from "@/context/ChatRoomProvider";


export default async function ChatRoomPage({ params }: { params: { id: string } }) {
  // ✅ params를 먼저 구조 분해
  const { id: roomId } = params;

  const sessionData = await getServerSession(authOptions);

  const session = sessionData as ExtendedSession;

  // ✅ session이 없는 경우 로그인 페이지로 리다이렉트
  if (!session || !session.user?.id) {
    return redirect("/login");
  }


  // ✅ roomId가 비어있는 경우 404 페이지로 리다이렉트
  if (!roomId) {
    return redirect("/chat")
  }

  const userId = session.user.id;
  await getRoomInfoPrefetch(roomId, userId);
  return <ChatRoomProvider roomId={roomId} userId={userId} />;
}