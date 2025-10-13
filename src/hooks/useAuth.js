import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendEmailVerification } from 'firebase/auth';
import { auth } from '../firebase/config';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  
  const register = async (email, password) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(result.user);
    return result;
  };
  
  const logout = () => signOut(auth);
  
  const sendVerification = async () => {
    const lastSent = localStorage.getItem('lastVerificationSent');
    const now = Date.now();
    
    // Rate limit: only allow one email per minute
    if (lastSent && (now - parseInt(lastSent)) < 60000) {
      throw new Error('Please wait before requesting another verification email');
    }
    
    await sendEmailVerification(auth.currentUser);
    localStorage.setItem('lastVerificationSent', now.toString());
  };

  return { user, loading, login, register, logout, sendVerification };
};