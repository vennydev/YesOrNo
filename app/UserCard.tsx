import { DefaultSession } from "next-auth";

export default function UserCard({user}: {user: DefaultSession["user"]}){
  return (
    <>
      <div>
        <h1>Current login user info</h1>
        <p>{user?.name}</p>
        <p>{user?.email}</p>
      </div>
    </>
  )
}