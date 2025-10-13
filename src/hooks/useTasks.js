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

  const addTask = async (taskData) => {
    await addDoc(collection(db, 'tasks'), {
      title: taskData.title || taskData,
      completed: false,
      status: 'pending', // pending, in-progress, completed, overdue
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || null,
      startDate: taskData.startDate || null,
      tags: taskData.tags || [],
      subtasks: taskData.subtasks || [],
      projectId: taskData.projectId || null,
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

  const updateTaskStatus = async (taskId, status) => {
    const updates = { status };
    if (status === 'completed') {
      updates.completed = true;
      updates.completedAt = new Date();
    } else {
      updates.completed = false;
    }
    await updateDoc(doc(db, 'tasks', taskId), updates);
  };

  return { tasks, addTask, updateTask, deleteTask, updateTaskStatus };
};