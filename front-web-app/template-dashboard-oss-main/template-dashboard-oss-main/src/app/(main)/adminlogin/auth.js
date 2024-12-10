// src/auth.js (or auth.ts)
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../../../firebaseConfig'; // Import the auth instance

export const signInAdmin = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      return {
        user,
        idToken: user.getIdToken(),
      };
    })
    .catch((error) => {
      throw new Error(error.message);
    });
};
