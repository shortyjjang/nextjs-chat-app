import { useChatRoom } from "@/context/ChatRoomProvider";
import Image from "next/image";

export default function ChatDialog({
  msg,
}: {
  msg: {
    type: string;
    user_id: string;
    content: string;
    url?: string[];
  };
}) {
  const { roomInfo } = useChatRoom();
  const Avatar = ({ user_id }: { user_id: string }) => {
    const user = roomInfo.users.find((user) => user.id === user_id);
    if (user) {
      return (
        <div>
          <Image src={user.image} alt="avatar" width={200} height={200} />
        </div>
      );
    }
    return null;
  };
  if (msg.type === "message") {
    return (
      <p>
        <Avatar user_id={msg.user_id} />
        {msg.content}
      </p>
    );
  }
  if (msg.type === "join") {
    return <p>{msg.user_id} 님이 채팅방에 참여했습니다.</p>;
  }
  if (msg.type === "leave") {
    return <p>{msg.user_id} 님이 채팅방을 나갔습니다.</p>;
  }
  if (msg.type === "file" && msg.url) {
    return msg.url.map((url, index) => (
      <Image
        key={index}
        priority={true}
        placeholder="blur"
        src={url}
        alt="파일"
        width={200}
        height={200}
      />
    ));
  }
}
