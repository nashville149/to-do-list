import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useTasks } from './hooks/useTasks';
import { usePomodoro } from './hooks/usePomodoro';
import { useProjects } from './hooks/useProjects';
import { useNotifications } from './hooks/useNotifications';
import { useTheme } from './hooks/useTheme';
import Auth from './components/Auth';
import TaskList from './components/TaskList';
import PomodoroTimer from './components/PomodoroTimer';
import Dashboard from './components/Dashboard';
import CalendarView from './components/CalendarView';
import ProjectSelector from './components/ProjectSelector';
import ProgressStats from './components/ProgressStats';
import ThemeSelector from './components/ThemeSelector';
import DragDropTaskList from './components/DragDropTaskList';

function App() {
  const { user, loading, login, register, logout, sendVerification } = useAuth();
  const { tasks, addTask, updateTask, deleteTask, updateTaskStatus } = useTasks(user?.uid);
  const { projects, addProject, updateProject, deleteProject } = useProjects(user?.uid);
  const pomodoroHook = usePomodoro(user?.uid, updateTask);
  const { sendNotification } = useNotifications(tasks, user);
  const { getTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('tasks');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'kanban'

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
  }

  if (!user) {
    return <Auth login={login} register={register} sendVerification={sendVerification} user={user} />;
  }

  if (user && !user.emailVerified) {
    return (
      <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', textAlign: 'center' }}>
        <h2>📧 Email Verification Required</h2>
        <p style={{ margin: '20px 0' }}>Please check your email and click the verification link to continue.</p>
        <button 
          onClick={sendVerification}
          style={{ 
            padding: '10px 20px', 
            background: '#FF8A65', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Resend Verification
        </button>
        <button 
          onClick={logout}
          style={{ 
            padding: '10px 20px', 
            background: '#ccc', 
            color: 'black', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
    );
  }

  const handleSelectTask = (taskId, task) => {
    pomodoroHook.resetTimer();
    pomodoroHook.startTimer(taskId, task);
    setActiveTab('timer');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '20px', 
        borderBottom: '2px solid #FFCCBC',
        background: '#FFF8F5'
      }}>
        <h1>Productivity App</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={() => setShowThemeSelector(true)} style={{ padding: '8px 12px', fontSize: '12px' }}>🎨 Theme</button>
          <span style={{ marginRight: '20px', color: 'var(--textPrimary)' }}>Welcome, {user.email}</span>
          <button onClick={logout} style={{ padding: '10px 20px' }}>Logout</button>
        </div>
      </header>

      <nav style={{ display: 'flex', borderBottom: '2px solid var(--border)', background: 'var(--cardBg)' }}>
        {['tasks', 'calendar', 'timer', 'progress', 'dashboard'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '15px 30px',
              border: 'none',
              backgroundColor: activeTab === tab ? 'var(--accent)' : 'transparent',
              color: activeTab === tab ? 'white' : 'var(--textSecondary)',
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
          <div>
            <ProjectSelector 
              projects={projects}
              selectedProject={selectedProject}
              onSelectProject={setSelectedProject}
              onAddProject={addProject}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', marginBottom: '10px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => setViewMode('list')}
                  style={{ 
                    padding: '8px 16px',
                    background: viewMode === 'list' ? 'var(--accent)' : 'transparent',
                    color: viewMode === 'list' ? 'white' : 'var(--textPrimary)',
                    border: '1px solid var(--border)'
                  }}
                >
                  📋 List View
                </button>
                <button 
                  onClick={() => setViewMode('kanban')}
                  style={{ 
                    padding: '8px 16px',
                    background: viewMode === 'kanban' ? 'var(--accent)' : 'transparent',
                    color: viewMode === 'kanban' ? 'white' : 'var(--textPrimary)',
                    border: '1px solid var(--border)'
                  }}
                >
                  📊 Kanban View
                </button>
              </div>
            </div>
            {viewMode === 'list' ? (
              <TaskList
                tasks={selectedProject ? tasks.filter(task => task.projectId === selectedProject) : tasks}
                addTask={addTask}
                updateTask={updateTask}
                deleteTask={deleteTask}
                updateTaskStatus={updateTaskStatus}
                onSelectTask={handleSelectTask}
                projects={projects}
                selectedProject={selectedProject}
              />
            ) : (
              <DragDropTaskList
                tasks={selectedProject ? tasks.filter(task => task.projectId === selectedProject) : tasks}
                updateTask={updateTask}
                updateTaskStatus={updateTaskStatus}
                onSelectTask={handleSelectTask}
                deleteTask={deleteTask}
              />
            )}
          </div>
        )}
        
        {activeTab === 'calendar' && (
          <CalendarView
            tasks={tasks}
            onSelectTask={handleSelectTask}
          />
        )}
        
        {activeTab === 'timer' && (
          <PomodoroTimer
            {...pomodoroHook}
            tasks={tasks}
          />
        )}
        
        {activeTab === 'progress' && (
          <ProgressStats 
            tasks={tasks} 
            projects={projects} 
            selectedProject={selectedProject} 
          />
        )}
        
        {activeTab === 'dashboard' && (
          <Dashboard userId={user.uid} tasks={tasks} />
        )}
      </main>
      
      {showThemeSelector && (
        <ThemeSelector onClose={() => setShowThemeSelector(false)} />
      )}
    </div>
  );
}

export default App;