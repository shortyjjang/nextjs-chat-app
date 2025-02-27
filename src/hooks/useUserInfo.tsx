import { ExtendedSession } from "@/lib/auth";
import { useSession } from "next-auth/react";

export const useUserInfo = () => {
  const { data: sessionData } = useSession();
  const session = sessionData as ExtendedSession;
  if(session?.user)return session.user
  return {
    id: "",
    name: "",
    email: "",
    image: "",
  }
};
