import firestore from "@/firebase/firestore";
import firebase from "firebase/compat/app";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  updateDoc,
  doc,
  where
} from "firebase/firestore";
import { useEffect, useState, useCallback } from "react";

export default function usePagination ( collectionName: string, limitCount: number, target: any) {
  const [data, setData] = useState<any[]>([]); // 불러온 문서들 상태
  const [closedPosts, setClosedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false); // 로딩 상태 
  const [loadingMore, setLoadingMore] = useState(false); // 추가 요청시 로딩 상태
  const [key, setKey] = useState<any>(null); // 마지막으로 불러온 스냅샷 상태
  const [noMore, setNoMore] = useState(false); // 불러올 데이터가 없을 떄 보여줄 flag

  const getFirstPage = useCallback(async () => {
      async function updateToClosedData(id: string){
        const postRef = doc(firestore, "posts", id);
        await updateDoc(postRef, {
          isOver: true
        });
      };

      async function getData() {
        const postQueryRef = query(
          collection(firestore, collectionName),
          where('isOver', '==', false),
          where('isDeleted', '==', false),
          orderBy("timestamp", "desc"), // 최신 작성순으로 정렬
          limit(limitCount),
        );
        try{
          setLoading(true);
          const snap = await getDocs(postQueryRef);
          const firstData = snap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }
          ));
          setData(firstData);
          setKey(snap.docs[snap.docs.length - 1]);
    
        } catch(error) {
          console.log('error', error);
        }
        setLoading(false);
      }

    const postsRef = collection(firestore, "posts");
    await getDocs(query(postsRef, orderBy("timestamp", "desc")))
      .then((value) => {
        const closedArr: any = [];
        value.forEach(async (doc) => {
          let currentTime = new Date().getTime();
          if(!doc.data().isOver){
            if(doc.data().expiredAt < currentTime) {
              updateToClosedData(doc.id);
            }
          } else {
            closedArr.push({...doc.data(), id: doc.id});
          }
        });
        setClosedPosts(closedArr);
      }).then(() => {
        getData();
      })
  }, [collectionName, limitCount, ]);

  // 다음 페이지 요청 함수
  const loadMore = useCallback(async (loadCount: number) => {
    const postQueryRef = query(
      collection(firestore, collectionName),
      where('isOver', '==', false),
      where('isDeleted', '==', false),
      orderBy("timestamp", "desc"),
      startAfter(key),
      limit(loadCount)
    );
    try {
      const snap = await getDocs(postQueryRef);
        if(snap.empty){
          setNoMore(true)
        } else {
          setKey(snap.docs[snap.docs.length - 1]);
            const extraData = snap.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));
            setData([...data, ...extraData]);
        }
    }catch(error){
      console.log('error: ', error);
    }
  }, [collectionName, data, key]);

  // 지정한 요소(target)가 뷰포트에 들어왔을 때 요청 함수
  // 뷰포트에 들어왔는지 들어오지 않았는지 여부에 따라 loadMore 함수를 call한다
  const onIntersect = useCallback(async ([entry]: any, observer: any) => {
    if(entry.isIntersecting && !loadingMore){
      setLoadingMore(true);
      key && await loadMore(3);
      setLoadingMore(false);
      observer.unobserve(entry.target);
    }
  }, [loadMore, loadingMore, key]);

  useEffect(() => {
    getFirstPage();
  }, [])

  useEffect(() => {
    let observer: any;
    if (target && !noMore) {
      observer = new IntersectionObserver(onIntersect, {
        threshold: 0,
      });
      observer.observe(target);
    }
    return () => {
      setLoading(false);
      setLoadingMore(false);
      observer && observer.disconnect();
    }
  }, [target, onIntersect, noMore])

  return {
    data,     
    closedPosts,
    loading,
    loadingMore,
    noMore,
  }
}