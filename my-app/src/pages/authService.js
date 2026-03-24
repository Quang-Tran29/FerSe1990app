import { auth } from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

const provider = new GoogleAuthProvider();

export const login = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const register = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const loginWithGoogle = () => {
  return signInWithPopup(auth, provider);
};

export const forgotPassword = (email) => {
  return sendPasswordResetEmail(auth, email);
};

