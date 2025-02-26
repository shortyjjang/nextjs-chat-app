<think>
사용자가 next-auth를 사용한 채팅 애플리케이션에 대한, 특히 hooks 폴더에 있는 파일들에 대한 설명과 채팅 서비스의 진행 방식을 README.md 형태로 작성해달라고 요청했습니다. 프로젝트의 구조와 주요 기능을 설명하는 README.md를 작성해 보겠습니다.

1. 프로젝트 개요 - 이 애플리케이션은 Next.js를 사용한 채팅 애플리케이션으로, next-auth를 통한 인증 기능을 제공합니다.
2. 인증 시스템 - next-auth를 사용하여 로그인 기능을 구현하고, middleware를 통해 인증되지 않은 사용자는 로그인 페이지로 리디렉션됩니다.
3. 주요 훅스 - hooks 폴더에 있는 각 훅의 기능을 설명합니다:
   - useWebSocket: WebSocket 연결을 관리하고 메시지를 주고받는 기능
   - useFileUpload: 파일 업로드 기능
   - useJoinChat: 채팅방 참여 관리
   - useAutoExitChat: 자동 채팅방 나가기 기능
   - useChatRoom: 채팅방 컨텍스트 관리
4. 주요 기능 - 채팅 서비스의 주요 기능들을 설명합니다:
   - 로그인/인증
   - 채팅방 참여/퇴장
   - 메시지 송수신
   - 파일(이미지) 업로드
   - 사용자 목록 조회

이러한 구조로 README.md를 작성하겠습니다.
</think>

# 채팅 애플리케이션 프로젝트

이 프로젝트는 Next.js와 WebSocket을 활용한 실시간 채팅 애플리케이션으로, Next-Auth를 통해 사용자 인증을 구현하고 있습니다.

## 주요 기능

- 사용자 인증 (Next-Auth)
- 실시간 채팅 (WebSocket)
- 채팅방 참여/퇴장 기능
- 이미지 업로드 기능
- 미들웨어를 통한 인증 보호

## 인증 시스템

프로젝트는 Next-Auth를 사용하여 사용자 인증을 구현하고 있습니다. 로그인하지 않은 사용자는 미들웨어에 의해 자동으로 `/login` 페이지로 리다이렉트됩니다.

```typescript
// middleware.ts
export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/chat/:path*"],
};
```

## Hooks 설명

프로젝트는 다양한 커스텀 훅을 사용하여 기능을 모듈화하고 있습니다:

### useWebSocket

WebSocket 연결을 관리하고 메시지를 주고받는 핵심 훅입니다.

```typescript
function useWebSocket(url: string, token: string, roomId: string) {
  // WebSocket 연결, 메시지 송수신, 재연결 로직 등을 처리
  return { socket, isConnected, messages, sendMessage };
}
```

주요 기능:
- WebSocket 연결 설정 및 관리
- 메시지 수신 및 상태 관리
- 연결 끊김 시 자동 재연결
- 최대 메시지 크기 제한 (10KB)

### useFileUpload

파일(이미지) 업로드 기능을 제공하는 훅입니다.

```typescript
function useFileUpload(socket: WebSocket | undefined) {
  // 파일 업로드 및 WebSocket을 통한 이미지 공유 처리
  return { uploadFile };
}
```

주요 기능:
- FormData를 사용한 파일 업로드
- 업로드된 파일 URL을 WebSocket을 통해 공유

### useJoinChat

채팅방 참여 및 사용자 목록 관리를 위한 훅입니다.

```typescript
function useJoinChat(userId: string, roomId: string) {
  // 채팅방 입장, 사용자 목록 관리
  return { users, isJoined, fetchUsers };
}
```

주요 기능:
- 채팅방 참여 요청 처리
- 채팅방 사용자 목록 조회 및 상태 관리

### useAutoExitChat

브라우저 종료/탭 전환 시 자동으로 채팅방을 나가는 기능을 제공합니다.

```typescript
function useAutoExitChat(userId: string, roomId: string) {
  // 브라우저 이벤트에 따른 자동 퇴장 처리
}
```

주요 기능:
- `beforeunload` 이벤트를 통한 브라우저 종료 감지
- `visibilitychange` 이벤트를 통한 탭 전환 감지
- 컴포넌트 언마운트 시 자동 퇴장 처리

### useChatRoom

채팅방 관련 상태와 기능을 Context를 통해 제공하는 훅입니다.

```typescript
function useChatRoom() {
  // ChatRoomContext에서 채팅방 상태와 기능을 제공
  return { roomId, isJoined, users, fetchUsers, WS_URL };
}
```

주요 기능:
- Context API를 활용한 채팅방 상태 공유
- 채팅 관련 기능을 애플리케이션 전체에서 접근 가능하도록 제공

## 채팅 서비스 흐름

1. **사용자 인증**:
   - 사용자는 `/login` 페이지에서 인증 정보를 입력
   - Next-Auth를 통해 인증 처리 (Credentials Provider 사용)
   - 인증 성공 시 JWT 토큰 발급

2. **채팅방 접속**:
   - 인증된 사용자만 `/chat/:id` 경로에 접근 가능
   - 미들웨어에서 인증 여부 확인 후 접근 제어
   - `useJoinChat` 훅을 통해 채팅방 참여 요청

3. **WebSocket 연결**:
   - `useWebSocket` 훅에서 WebSocket 연결 설정
   - 토큰과 룸 ID를 쿼리 파라미터로 전달하여 인증 처리
   - 연결 성공 시 실시간 메시지 수신 가능

4. **메시지 및 파일 전송**:
   - 텍스트 메시지는 WebSocket을 통해 직접 전송
   - 파일은 HTTP API를 통해 업로드 후 URL을 WebSocket으로 공유

5. **채팅방 퇴장**:
   - 명시적인 퇴장 요청 또는 `useAutoExitChat`의 자동 퇴장 처리
   - 브라우저 종료, 탭 전환, 컴포넌트 언마운트 시 자동 퇴장

## 기술 스택

- **프론트엔드**: Next.js, React, TypeScript
- **인증**: Next-Auth
- **실시간 통신**: WebSocket
- **스타일링**: Tailwind CSS
- **배포**: (사용자 환경에 따라 다름)

## 환경 변수

프로젝트 실행을 위해 다음 환경 변수가 필요합니다:

```
NEXTAUTH_SECRET=
NEXT_PUBLIC_WS_URL=ws://
SERVER_URL=http://
```

## 설치 및 실행

```bash
# 패키지 설치
npm install

# 개발 서버 실행
npm run dev
```
