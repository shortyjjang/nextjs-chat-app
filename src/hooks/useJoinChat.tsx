import { useCallback, useEffect, useState } from "react";

const useJoinChat = (userId: string, roomId: string) => {
    const [users, setUsers] = useState<{user_id: string, name: string, avatar: string}[]>([]);
    const [isJoined, setIsJoined] = useState(false);

    const fetchUsers = async () => {
        if(!userId || !roomId) return;
        const response = await fetch(`/api/chat/users`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, roomId }),
        });
        const data = await response.json();
        if(Array.isArray(data?.users)) setUsers(data.users);
    };

    const joinChatRoom = useCallback(async () => {
        if(!userId || !roomId) return;
        const response = await fetch(`/api/chat/join`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, roomId }),
      });
      if(!response?.ok) return setIsJoined(false);
      const data = await response.json();
      if(Array.isArray(data?.users)) setUsers(data.users);
      setIsJoined(Array.isArray(data?.users));
    },[userId, roomId]);


    useEffect(() => {
        joinChatRoom();
    }, [joinChatRoom]);

    return { users, isJoined, fetchUsers };
};

export default useJoinChat;
