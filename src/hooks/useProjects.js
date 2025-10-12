import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const useProjects = (userId) => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const q = query(collection(db, 'projects'), where('userId', '==', userId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(projectsData);
    });

    return unsubscribe;
  }, [userId]);

  const addProject = async (name, color = '#FF8A65') => {
    await addDoc(collection(db, 'projects'), {
      name,
      color,
      userId,
      createdAt: new Date()
    });
  };

  const updateProject = async (projectId, updates) => {
    await updateDoc(doc(db, 'projects', projectId), updates);
  };

  const deleteProject = async (projectId) => {
    await deleteDoc(doc(db, 'projects', projectId));
  };

  return { projects, addProject, updateProject, deleteProject };
};