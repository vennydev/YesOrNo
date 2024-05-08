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
import useRandomNameGenerator from "@/hooks/useRandomNameGenerator";

export default function CreateUserName() {
  const [isLoading, setIsLoading] = useState(true);
  const session = useSession();
  const router = useRouter();
  
  const checkIsNewUser = async (userid: string) => {
    const userRef = collection(firestore, "users");
    const q = query(userRef, where("id", "==", userid));
    const querySnapshot = await getDocs(q);
    if(querySnapshot.empty){
      console.log('useRandomNameGenerator: ', useRandomNameGenerator);
      setIsLoading(false);
    }else{
      querySnapshot.forEach(doc => {
        if(doc.data().nickname !== ''){
          router.push("/");
          return
        };
        setIsLoading(false);
      });
    }
    }
    
    useEffect(() => {
      const userid = session.data?.user.id;
      console.log('userid: ', userid);
      userid && checkIsNewUser(userid);
    }, [session]);

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