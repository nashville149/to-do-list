import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

const Dashboard = ({ userId, tasks }) => {
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState({ totalTime: 0, sessionsToday: 0, taskStats: {} });

  useEffect(() => {
    if (!userId) return;

    const fetchSessions = async () => {
      const q = query(collection(db, 'pomodoroSessions'), where('userId', '==', userId));
      const snapshot = await getDocs(q);
      const sessionsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSessions(sessionsData);
      calculateStats(sessionsData);
    };

    fetchSessions();
  }, [userId]);

  const calculateStats = (sessionsData) => {
    const today = new Date().toDateString();
    const totalTime = sessionsData.reduce((sum, session) => sum + (session.duration || 0), 0);
    const sessionsToday = sessionsData.filter(session => 
      session.createdAt?.toDate?.()?.toDateString() === today
    ).length;

    const taskStats = {};
    sessionsData.forEach(session => {
      if (session.taskId && session.type === 'focus') {
        taskStats[session.taskId] = (taskStats[session.taskId] || 0) + (session.duration || 0);
      }
    });

    setStats({ totalTime, sessionsToday, taskStats });
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3>Dashboard</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', margin: '20px 0' }}>
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '5px', textAlign: 'center' }}>
          <h4>Total Focus Time</h4>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{formatDuration(stats.totalTime)}</p>
        </div>
        
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '5px', textAlign: 'center' }}>
          <h4>Sessions Today</h4>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.sessionsToday}</p>
        </div>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h4>Time per Task</h4>
        {Object.entries(stats.taskStats).map(([taskId, duration]) => {
          const task = tasks.find(t => t.id === taskId);
          return (
            <div key={taskId} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: '10px', 
              border: '1px solid #eee', 
              margin: '5px 0' 
            }}>
              <span>{task?.title || 'Unknown Task'}</span>
              <span>{formatDuration(duration)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;