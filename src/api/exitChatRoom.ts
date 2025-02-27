export const exitChatRoom = async (roomId: string, userId: string) => {
    try {
      const response = await fetch(`/api/chat/exit`, {
        method: "DELETE",
        body: JSON.stringify({ roomId, userId }),
      });
      if (response.ok) {
        return true;    
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
};
