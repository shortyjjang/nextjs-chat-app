//모든 요청을 토큰과 함께 보내줌
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  //next-auth 토큰 확인
  const cookies = request.headers.get("cookie");
  const token = cookies?.split(";").find((cookie) => cookie.trim().startsWith("next-auth.session-token="))?.split("=")[1];
  if (token) {
    request.headers.set("Authorization", `Bearer ${token}`);
  }
  const url = new URL(request.url);
  return handleRequest(process.env.SERVER_URL + url.pathname, {
    method: request.method,
    headers: request.headers,
  });
}

export async function POST(request: NextRequest) {
    const cookies = request.headers.get("cookie");
    const token = cookies?.split(";").find((cookie) => cookie.trim().startsWith("next-auth.session-token="))?.split("=")[1];
  if (token) {
    request.headers.set("Authorization", `Bearer ${token}`);
  }
  const url = new URL(request.url);
  return handleRequest(process.env.SERVER_URL + url.pathname, {
    method: request.method,
    headers: request.headers,
    body: request.body,
  });
}

export async function PUT(request: NextRequest) {
    const cookies = request.headers.get("cookie");
    const token = cookies?.split(";").find((cookie) => cookie.trim().startsWith("next-auth.session-token="))?.split("=")[1];
  if (token) {
    request.headers.set("Authorization", `Bearer ${token}`);
  }
  const url = new URL(request.url);
  return handleRequest(process.env.SERVER_URL + url.pathname, {
    method: request.method,
    headers: request.headers,
    body: request.body,
  });
}

export async function DELETE(request: NextRequest) {
    const cookies = request.headers.get("cookie");
    const token = cookies?.split(";").find((cookie) => cookie.trim().startsWith("next-auth.session-token="))?.split("=")[1];
  if (token) {
    request.headers.set("Authorization", `Bearer ${token}`);
  }
  const url = new URL(request.url);
  return handleRequest(process.env.SERVER_URL + url.pathname, {
    method: request.method,
    headers: request.headers,
  });
}

export async function PATCH(request: NextRequest) {
    const cookies = request.headers.get("cookie");
    const token = cookies?.split(";").find((cookie) => cookie.trim().startsWith("next-auth.session-token="))?.split("=")[1];
  if (token) {
    request.headers.set("Authorization", `Bearer ${token}`);
  }
  const url = new URL(request.url);
  return handleRequest(process.env.SERVER_URL + url.pathname, {
    method: request.method,
    headers: request.headers,
    body: request.body,
  });
}

const handleRequest = async (url: string, options: RequestInit) => {
  try {
    const response = await fetch(url, options);
    return NextResponse.json(response.json());
  } catch {
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
};
