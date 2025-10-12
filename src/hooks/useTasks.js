import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const useTasks = (userId) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const q = query(collection(db, 'tasks'), where('userId', '==', userId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTasks(tasksData);
    });

    return unsubscribe;
  }, [userId]);

  const addTask = async (title) => {
    await addDoc(collection(db, 'tasks'), {
      title,
      completed: false,
      userId,
      createdAt: new Date()
    });
  };

  const updateTask = async (taskId, updates) => {
    await updateDoc(doc(db, 'tasks', taskId), updates);
  };

  const deleteTask = async (taskId) => {
    await deleteDoc(doc(db, 'tasks', taskId));
  };

  return { tasks, addTask, updateTask, deleteTask };
};