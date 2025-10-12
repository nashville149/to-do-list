import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useTasks } from './hooks/useTasks';
import { usePomodoro } from './hooks/usePomodoro';
import Auth from './components/Auth';
import TaskList from './components/TaskList';
import PomodoroTimer from './components/PomodoroTimer';
import Dashboard from './components/Dashboard';

function App() {
  const { user, loading, login, register, logout } = useAuth();
  const { tasks, addTask, updateTask, deleteTask } = useTasks(user?.uid);
  const pomodoroHook = usePomodoro(user?.uid);
  const [activeTab, setActiveTab] = useState('tasks');

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
  }

  if (!user) {
    return <Auth login={login} register={register} />;
  }

  const handleSelectTask = (taskId) => {
    pomodoroHook.resetTimer();
    pomodoroHook.startTimer(taskId);
    setActiveTab('timer');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '20px', 
        borderBottom: '1px solid #ddd' 
      }}>
        <h1>Productivity App</h1>
        <div>
          <span style={{ marginRight: '20px' }}>Welcome, {user.email}</span>
          <button onClick={logout} style={{ padding: '10px 20px' }}>Logout</button>
        </div>
      </header>

      <nav style={{ display: 'flex', borderBottom: '1px solid #ddd' }}>
        {['tasks', 'timer', 'dashboard'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '15px 30px',
              border: 'none',
              backgroundColor: activeTab === tab ? '#007bff' : 'transparent',
              color: activeTab === tab ? 'white' : 'black',
              cursor: 'pointer',
              textTransform: 'capitalize'
            }}
          >
            {tab}
          </button>
        ))}
      </nav>

      <main>
        {activeTab === 'tasks' && (
          <TaskList
            tasks={tasks}
            addTask={addTask}
            updateTask={updateTask}
            deleteTask={deleteTask}
            onSelectTask={handleSelectTask}
          />
        )}
        
        {activeTab === 'timer' && (
          <PomodoroTimer
            {...pomodoroHook}
            tasks={tasks}
          />
        )}
        
        {activeTab === 'dashboard' && (
          <Dashboard userId={user.uid} tasks={tasks} />
        )}
      </main>
    </div>
  );
}

export default App;