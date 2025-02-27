import { dehydrate, QueryClient } from "@tanstack/react-query";

export const fetchRoomInfo = async (roomId: string, userId: string) => {
  return {
    room_id: roomId,
    name: "test",
    description: "test",
    created_at: new Date().toISOString(),
    users: [
      {
        id: userId,
        name: "test",
        email: "test@test.com",
        image: "https://example.com/image.png",
      },
    ],
  };
  //   const response = await fetch(`/api/chat/join`, {
  //     method: "POST",
  //     body: JSON.stringify({ roomId, userId }),
  //   });
  //   if (!response?.ok) return null;
  //   const data = await response.json();
  //   return data;
};

export async function getRoomInfoPrefetch(roomId: string, userId: string) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["roomInfo", roomId, userId],
    queryFn: () => fetchRoomInfo(roomId, userId),
  });
  return dehydrate(queryClient);
}
