export const getLastDialogs = async (roomId: string) => {
  try {
    const response = await fetch(`/api/dialogs/${roomId}`);
    return response.json();
  } catch (error) {
    console.error(error);
    return [{
        type: "join",
        user_id: "system",
        content: "채팅방에 참여하셨습니다.",
        url: [],
      },
    ];
  }
};
