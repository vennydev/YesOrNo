import { getFirestore } from "firebase/firestore"
import firebasedb from "./firebasedb"

const firestore = getFirestore(firebasedb);
export default firestore;