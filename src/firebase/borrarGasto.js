import { db } from "./firebaseConfig";
import { collection, deleteDoc, doc } from "firebase/firestore";

const borrarGastos = async (id) => await deleteDoc(doc(collection(db, "gastos"), id));

export default borrarGastos
    
