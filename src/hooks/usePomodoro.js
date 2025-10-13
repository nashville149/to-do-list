import { useState, useEffect, useRef } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const usePomodoro = (userId, updateTask) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [currentTask, setCurrentTask] = useState(null);
  const [breakTime, setBreakTime] = useState(0); // break time in seconds
  const [currentBreakTime, setCurrentBreakTime] = useState(0); // current break session
  const intervalRef = useRef(null);
  const breakIntervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const sessionStartTime = useRef(null);
  const pauseStartTime = useRef(null);

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

  useEffect(() => {
    if (isBreak && pauseStartTime.current) {
      breakIntervalRef.current = setInterval(() => {
        const elapsed = Math.floor((new Date() - pauseStartTime.current) / 1000);
        setCurrentBreakTime(elapsed);
      }, 1000);
    } else {
      clearInterval(breakIntervalRef.current);
      setCurrentBreakTime(0);
    }

    return () => clearInterval(breakIntervalRef.current);
  }, [isBreak]);

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

  const pauseTimer = () => {
    setIsActive(false);
    setIsBreak(true);
    pauseStartTime.current = new Date();
    setCurrentBreakTime(0);
  };

  const resumeTimer = () => {
    if (pauseStartTime.current) {
      const breakDuration = Math.floor((new Date() - pauseStartTime.current) / 1000);
      setBreakTime(prev => prev + breakDuration);
      pauseStartTime.current = null;
    }
    setIsBreak(false);
    setCurrentBreakTime(0);
    setIsActive(true);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setBreakTime(0);
    setCurrentBreakTime(0);
    clearInterval(breakIntervalRef.current);
    if (currentTask && currentTask.duration) {
      setTimeLeft(currentTask.duration * 60);
    } else {
      setTimeLeft(25 * 60);
    }
    setCurrentTaskId(null);
    setCurrentTask(null);
    pauseStartTime.current = null;
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

  const formatBreakTime = () => {
    const totalBreakSeconds = breakTime + currentBreakTime;
    return formatTime(totalBreakSeconds);
  };

  return {
    timeLeft,
    isActive,
    isBreak,
    currentTaskId,
    currentTask,
    breakTime: breakTime + currentBreakTime,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    formatTime,
    formatBreakTime
  };
};