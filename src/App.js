import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useTasks } from './hooks/useTasks';
import { usePomodoro } from './hooks/usePomodoro';
import { useProjects } from './hooks/useProjects';
import Auth from './components/Auth';
import TaskList from './components/TaskList';
import PomodoroTimer from './components/PomodoroTimer';
import Dashboard from './components/Dashboard';
import CalendarView from './components/CalendarView';
import ProjectSelector from './components/ProjectSelector';
import ProgressStats from './components/ProgressStats';

function App() {
  const { user, loading, login, register, logout } = useAuth();
  const { tasks, addTask, updateTask, deleteTask } = useTasks(user?.uid);
  const { projects, addProject, updateProject, deleteProject } = useProjects(user?.uid);
  const pomodoroHook = usePomodoro(user?.uid);
  const [activeTab, setActiveTab] = useState('tasks');
  const [selectedProject, setSelectedProject] = useState(null);

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
        borderBottom: '2px solid #FFCCBC',
        background: '#FFF8F5'
      }}>
        <h1>Productivity App</h1>
        <div>
          <span style={{ marginRight: '20px' }}>Welcome, {user.email}</span>
          <button onClick={logout} style={{ padding: '10px 20px' }}>Logout</button>
        </div>
      </header>

      <nav style={{ display: 'flex', borderBottom: '2px solid #FFCCBC', background: '#FFF8F5' }}>
        {['tasks', 'calendar', 'timer', 'progress', 'dashboard'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '15px 30px',
              border: 'none',
              backgroundColor: activeTab === tab ? '#FF8A65' : 'transparent',
              color: activeTab === tab ? 'white' : '#8D6E63',
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
            <TaskList
              tasks={selectedProject ? tasks.filter(task => task.projectId === selectedProject) : tasks}
              addTask={addTask}
              updateTask={updateTask}
              deleteTask={deleteTask}
              onSelectTask={handleSelectTask}
              projects={projects}
              selectedProject={selectedProject}
            />
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
    </div>
  );
}

export default App;