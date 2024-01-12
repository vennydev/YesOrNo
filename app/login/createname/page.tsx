"use client"

import styled from "styled-components";
import EditInput from "@/components/edit/EditInput";
import { createUserNameText } from "@/constants";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { collection, getDocs, query, where } from "firebase/firestore";
import firestore from "@/firebase/firestore";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading/Loading";

export default function CreateUserName() {
  const [isLoading, setIsLoading] = useState(true);
  const session = useSession();
  const router = useRouter();
  
  const checkIsNewUser = async (userid: string) => {
    const userRef = collection(firestore, "users");
    const q = query(userRef, where("id", "==", userid));
    const querySnapshot = await getDocs(q);
    try {
      querySnapshot.forEach(doc => {
        if(doc.data().nickname !== ''){
          router.push("/");
          return
        };
        setIsLoading(false);
      });
    } catch (error) {
      alert(error)
    }
    }
    
    useEffect(() => {
      const userid = session.data?.user.id;
      userid && checkIsNewUser(userid);
  }, [session])

  return (
    <>
    {isLoading ? <Loading/> : (
      <CreateUserNameCOntainer>
        <EditWrapper>
          <EditInput text={createUserNameText}/>
        </EditWrapper>
      </CreateUserNameCOntainer>
    )
    }
    </>
)};

const CreateUserNameCOntainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height:100vh;
`;

const EditWrapper = styled.div`
  width: 375px;
`