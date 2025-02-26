import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions, Session } from "next-auth";

// Session 타입을 확장하여 user에 id 속성을 추가합니다.
export interface ExtendedSession extends Session {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    token?: string;
  };
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // 로그인 검증 로직 (예: DB 확인)
        if (
          credentials?.email === "test@example.com" &&
          credentials?.password === "password"
        ) {
          return {
            id: "1",
            name: "Test User",
            email: credentials.email,
            image: "https://example.com/image.png",
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login", // 로그인 페이지 지정
  },
  debug: true, // 디버그 모드 활성화
  callbacks: {
    async jwt({ token, user }) {
      const now = Math.floor(Date.now() / 1000);
      const expiresIn = 60 * 60 * 24 * 7; // 7일 후 만료

      if (user) {
        token.id = user.id;
        token.exp = now + expiresIn; // 항상 7일로 설정
        token.iat = now;
      } else if (!token.exp || Number(token.exp) > now + expiresIn) {
        // 기존 exp가 너무 길다면 재설정
        token.exp = now + expiresIn;
        token.iat = now;
      }
      return token;
    },
    async session({ session, token }) {
      const extendedSession: ExtendedSession = session as ExtendedSession;
      if (!extendedSession.user || !extendedSession.user.id) {
        // 빈 객체 대신 기본값을 포함한 객체로 초기화합니다.
        extendedSession.user = {
          id: "",
          name: null,
          email: null,
          image: null,
        };
      }
      extendedSession.user = {
        id: String(token.id),
        name: String(token.name),
        email: String(token.email),
        image: String(token.picture),
        token: String(token.jti) || "",
      };
      return extendedSession;
    },
  },
};
