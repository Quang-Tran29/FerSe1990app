import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAAn_9hve-S2M4KVoaYnwfVv0bYg_jpkQo",
  authDomain: "shopping-46646.firebaseapp.com",
  projectId: "shopping-46646",
  storageBucket: "shopping-46646.appspot.com",
  messagingSenderId: "XXXX",
  appId: "XXXX",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

