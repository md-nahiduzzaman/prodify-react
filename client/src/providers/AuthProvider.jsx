import { createContext, useEffect, useState } from "react";
import auth from "../firebase/firebase.config";

import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import toast from "react-hot-toast";
import axios from "axios";

export const AuthContext = createContext(null);

// social auth providers
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  //create user with email & pass
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  //update user profile
  const updateUserProfile = (name, image) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: image,
    });
  };

  // sign in user
  const signInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // logout user
  const logout = async () => {
    setLoading(true);
    // setUser(null);
    const { data } = await axios(`${import.meta.env.VITE_API_URL}/logout`, {
      withCredentials: true,
    });
    console.log(data);
    // setUser(null);
    toast.success("Successfully Logout!");
    return signOut(auth);
  };

  //google login
  const googleLogin = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  //

  // save user
  const saveUser = async (user, providerId) => {
    if (providerId === googleProvider.providerId) {
      const currentUser = {
        email: user.email,
        name: user.displayName,
        role: "Employee",

        verified: false,
      };
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/user`,
        currentUser
      );
      return data;
    }
  };

  //user observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const providerId = currentUser.providerData[0]?.providerId;
        saveUser(currentUser, providerId);
      }
      console.log("CurrentUser:", currentUser);
      setLoading(false);
    });
    return () => {
      return unsubscribe();
    };
  }, []);

  console.log(user);

  const allValues = {
    createUser,
    signInUser,
    user,
    setUser,
    logout,
    updateUserProfile,
    googleLogin,
    loading,
    setLoading,
    saveUser,
  };

  return (
    <AuthContext.Provider value={allValues}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
