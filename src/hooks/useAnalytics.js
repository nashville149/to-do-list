import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';

export const useAnalytics = (userId, tasks) => {
  const [analytics, setAnalytics] = useState({
    completionStats: {},
    timeTracking: {},
    streaks: {},
    weeklyReport: {},
    goals: {}
  });

  useEffect(() => {
    if (!userId || !tasks.length) return;
    calculateAnalytics();
  }, [userId, tasks]);

  const calculateAnalytics = () => {
    const completionStats = calculateCompletionStats();
    const timeTracking = calculateTimeTracking();
    const streaks = calculateStreaks();
    const weeklyReport = generateWeeklyReport();
    
    setAnalytics({
      completionStats,
      timeTracking,
      streaks,
      weeklyReport,
      goals: calculateGoals()
    });
  };

  const calculateCompletionStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = tasks.filter(t => !t.completed && t.status !== 'overdue').length;
    const overdue = tasks.filter(t => t.status === 'overdue').length;
    
    const byPriority = {
      high: { total: 0, completed: 0 },
      medium: { total: 0, completed: 0 },
      low: { total: 0, completed: 0 }
    };
    
    tasks.forEach(task => {
      const priority = task.priority || 'medium';
      byPriority[priority].total++;
      if (task.completed) byPriority[priority].completed++;
    });

    return {
      total,
      completed,
      pending,
      overdue,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      byPriority
    };
  };

  const calculateTimeTracking = () => {
    const totalTimeSpent = tasks.reduce((sum, task) => sum + (task.timeSpent || 0), 0);
    const totalEstimated = tasks.reduce((sum, task) => sum + (task.estimatedTime || task.duration || 0), 0);
    const accuracy = totalEstimated > 0 ? Math.round((totalTimeSpent / totalEstimated) * 100) : 0;
    
    const dailyTime = {};
    const last7Days = Array.from({length: 7}, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toDateString();
    });

    last7Days.forEach(date => {
      dailyTime[date] = tasks
        .filter(task => task.completedAt && new Date(task.completedAt.toDate()).toDateString() === date)
        .reduce((sum, task) => sum + (task.timeSpent || 0), 0);
    });

    return {
      totalTimeSpent,
      totalEstimated,
      accuracy,
      dailyTime,
      averageTaskTime: tasks.length > 0 ? Math.round(totalTimeSpent / tasks.length) : 0
    };
  };

  const calculateStreaks = () => {
    const completedTasks = tasks
      .filter(task => task.completed && task.completedAt)
      .sort((a, b) => new Date(b.completedAt.toDate()) - new Date(a.completedAt.toDate()));

    let currentStreak = 0;
    let longestStreak = 0;
    let lastDate = null;

    const dailyCompletions = {};
    completedTasks.forEach(task => {
      const date = new Date(task.completedAt.toDate()).toDateString();
      dailyCompletions[date] = (dailyCompletions[date] || 0) + 1;
    });

    const sortedDates = Object.keys(dailyCompletions).sort((a, b) => new Date(b) - new Date(a));
    
    for (let i = 0; i < sortedDates.length; i++) {
      const currentDate = new Date(sortedDates[i]);
      
      if (i === 0) {
        currentStreak = 1;
        longestStreak = 1;
      } else {
        const prevDate = new Date(sortedDates[i - 1]);
        const dayDiff = Math.floor((prevDate - currentDate) / (1000 * 60 * 60 * 24));
        
        if (dayDiff === 1) {
          currentStreak++;
          longestStreak = Math.max(longestStreak, currentStreak);
        } else {
          currentStreak = 1;
        }
      }
    }

    return {
      currentStreak,
      longestStreak,
      dailyCompletions: Object.keys(dailyCompletions).length,
      totalCompletedTasks: completedTasks.length
    };
  };

  const generateWeeklyReport = () => {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    
    const weekTasks = tasks.filter(task => {
      if (!task.createdAt) return false;
      const taskDate = new Date(task.createdAt.toDate());
      return taskDate >= weekStart;
    });

    const weekCompleted = weekTasks.filter(t => t.completed).length;
    const weekTimeSpent = weekTasks.reduce((sum, task) => sum + (task.timeSpent || 0), 0);
    
    return {
      tasksCreated: weekTasks.length,
      tasksCompleted: weekCompleted,
      timeSpent: weekTimeSpent,
      completionRate: weekTasks.length > 0 ? Math.round((weekCompleted / weekTasks.length) * 100) : 0,
      mostProductiveDay: getMostProductiveDay(weekTasks)
    };
  };

  const getMostProductiveDay = (weekTasks) => {
    const dayCompletions = {};
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    weekTasks.filter(t => t.completed && t.completedAt).forEach(task => {
      const day = new Date(task.completedAt.toDate()).getDay();
      const dayName = days[day];
      dayCompletions[dayName] = (dayCompletions[dayName] || 0) + 1;
    });

    return Object.entries(dayCompletions).reduce((max, [day, count]) => 
      count > (max.count || 0) ? { day, count } : max, {}
    );
  };

  const calculateGoals = () => {
    const goalTasks = tasks.filter(task => task.tags?.includes('goal'));
    const habitTasks = tasks.filter(task => task.recurring !== 'none');
    
    return {
      goalTasks: goalTasks.length,
      goalCompleted: goalTasks.filter(t => t.completed).length,
      habitTasks: habitTasks.length,
      habitCompleted: habitTasks.filter(t => t.completed).length
    };
  };

  return analytics;
};