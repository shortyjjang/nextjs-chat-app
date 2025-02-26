import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  // 로그인이 안 된 경우 /login으로 리다이렉트
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// 로그인 여부를 확인할 페이지 설정 (예: /chat)
export const config = {
  matcher: ["/chat/:path*"], // /chat 하위 모든 경로에 적용
};