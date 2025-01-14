import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../../firebaseConfig"; // Import the auth instance

export const signInAdmin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Await the ID token resolution
    const idToken = await user.getIdToken();

    return {
      user,
      idToken, // Return the resolved token
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
