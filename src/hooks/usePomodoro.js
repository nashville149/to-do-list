import { useState, useEffect, useRef } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const usePomodoro = (userId, updateTask) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [currentTask, setCurrentTask] = useState(null);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const sessionStartTime = useRef(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionComplete();
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, timeLeft]);

  const startTimer = (taskId = null, task = null) => {
    setCurrentTaskId(taskId);
    setCurrentTask(task);
    if (task && task.duration) {
      setTimeLeft(task.duration * 60); // Convert minutes to seconds
    }
    setIsActive(true);
    startTimeRef.current = new Date();
    sessionStartTime.current = new Date();
    
    // Update task status to in-progress
    if (taskId && updateTask) {
      updateTask(taskId, { status: 'in-progress' });
    }
  };

  const pauseTimer = () => setIsActive(false);

  const resetTimer = () => {
    setIsActive(false);
    if (currentTask && currentTask.duration) {
      setTimeLeft(currentTask.duration * 60);
    } else {
      setTimeLeft(isBreak ? 5 * 60 : 25 * 60);
    }
    setCurrentTaskId(null);
    setCurrentTask(null);
  };

  const handleSessionComplete = async () => {
    setIsActive(false);
    
    if (userId && startTimeRef.current) {
      const endTime = new Date();
      const sessionDuration = Math.floor((endTime - sessionStartTime.current) / 1000 / 60); // minutes
      
      await addDoc(collection(db, 'pomodoroSessions'), {
        userId,
        taskId: currentTaskId,
        startTime: startTimeRef.current,
        endTime,
        duration: sessionDuration * 60, // store in seconds
        type: isBreak ? 'break' : 'focus',
        createdAt: new Date()
      });
      
      // Update task time spent and status
      if (currentTaskId && updateTask && !isBreak) {
        const newTimeSpent = (currentTask?.timeSpent || 0) + sessionDuration;
        const isCompleted = newTimeSpent >= (currentTask?.duration || 25);
        
        updateTask(currentTaskId, { 
          timeSpent: newTimeSpent,
          status: isCompleted ? 'completed' : 'pending'
        });
      }
    }

    // Switch between focus and break
    setIsBreak(!isBreak);
    setTimeLeft(isBreak ? (currentTask?.duration || 25) * 60 : 5 * 60);
    setCurrentTaskId(null);
    setCurrentTask(null);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    timeLeft,
    isActive,
    isBreak,
    currentTaskId,
    currentTask,
    startTimer,
    pauseTimer,
    resetTimer,
    formatTime
  };
};