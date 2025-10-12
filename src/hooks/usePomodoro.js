import { useState, useEffect, useRef } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const usePomodoro = (userId) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

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

  const startTimer = (taskId = null) => {
    setCurrentTaskId(taskId);
    setIsActive(true);
    startTimeRef.current = new Date();
  };

  const pauseTimer = () => setIsActive(false);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(isBreak ? 5 * 60 : 25 * 60);
    setCurrentTaskId(null);
  };

  const handleSessionComplete = async () => {
    setIsActive(false);
    
    if (userId && startTimeRef.current) {
      const endTime = new Date();
      const duration = isBreak ? 5 * 60 : 25 * 60;
      
      await addDoc(collection(db, 'pomodoroSessions'), {
        userId,
        taskId: currentTaskId,
        startTime: startTimeRef.current,
        endTime,
        duration,
        type: isBreak ? 'break' : 'focus',
        createdAt: new Date()
      });
    }

    // Switch between focus and break
    setIsBreak(!isBreak);
    setTimeLeft(isBreak ? 25 * 60 : 5 * 60);
    setCurrentTaskId(null);
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
    startTimer,
    pauseTimer,
    resetTimer,
    formatTime
  };
};