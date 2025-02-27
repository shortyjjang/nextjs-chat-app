import { exitChatRoom } from "@/api/exitChatRoom";
import { useEffect } from "react";

const useAutoExitChat = (userId: string, roomId: string) => {
  useEffect(() => {
    

    const handleUnload = () => exitChatRoom(roomId, userId);
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        exitChatRoom(roomId, userId);
      }
    };

    //브라우저 종료/새로고침 시 채팅방 나가기
    window.addEventListener("beforeunload", handleUnload);
    //탭을 백그라운드로 보내면 나가기 처리 가능
    document.addEventListener("visibilitychange", handleVisibilityChange);

    //컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      exitChatRoom(roomId, userId);
      window.removeEventListener("beforeunload", handleUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [userId, roomId]);
};

export default useAutoExitChat;
