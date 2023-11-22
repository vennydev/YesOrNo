"use client"

import { getCsrfToken, signIn, signOut, useSession } from "next-auth/react";
import UserCard from "./UserCard";
import { useEffect } from "react";

export default function Home() {
  const { data: session } = useSession();
  
  if(session){
    return (
      <>
        <button type="button" onClick={() => signOut()}>sign out</button>
        <UserCard user={session.user}/>                                
      </>
    )
  } else {
    return (
      <>
        <button type="button" onClick={() => signIn()}>sign in</button>
      </>
    )
  }

    {/* get session fron nextauth */}

    {/* useSession uses react context  */}

    {/* if session exist, show sign out btn and their information */}

    {/* if session no exist, show signup btn  */}
}
