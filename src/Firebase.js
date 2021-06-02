import firebase from 'firebase/app';
import "firebase/firestore";
import "firebase/auth";
import key from "./key";

firebase.initializeApp(key);

export const db = firebase.firestore();
export default firebase;