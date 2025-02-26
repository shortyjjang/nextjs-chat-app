import { useSession, signOut } from 'next-auth/react'
import React from 'react'

export default function UserHeader() {
    const {data: session} = useSession()
  if(session) {
    return (
      <div>
        <p>{session.user?.name}</p>
        <button onClick={() => signOut()}>로그아웃</button>
      </div>
    )
  }
  return null
}
