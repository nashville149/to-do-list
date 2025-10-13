import React from 'react';

const PomodoroTimer = ({ 
  timeLeft, 
  isActive, 
  isBreak, 
  currentTaskId, 
  breakTime,
  startTimer, 
  pauseTimer, 
  resumeTimer,
  resetTimer, 
  formatTime,
  formatBreakTime,
  tasks 
}) => {
  const currentTask = tasks.find(task => task.id === currentTaskId);

  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '30px', 
      border: '2px solid #ddd', 
      borderRadius: '10px',
      margin: '20px'
    }}>
      <h2>{isBreak ? '☕ Break Time' : '🎯 Focus Time'}</h2>
      <div style={{ fontSize: '48px', fontWeight: 'bold', margin: '20px 0' }}>
        {formatTime(timeLeft)}
      </div>
      
      {isBreak && (
        <div style={{ fontSize: '18px', color: '#FF9800', margin: '10px 0' }}>
          Break duration: {formatBreakTime()}
        </div>
      )}
      
      {currentTask && (
        <div style={{ margin: '20px 0' }}>
          <p style={{ fontSize: '18px', margin: '10px 0' }}>
            Working on: <strong>{currentTask.title}</strong>
          </p>
          <p style={{ fontSize: '14px', color: '#666' }}>
            Duration: {currentTask.duration || 25} minutes | 
            Time spent: {currentTask.timeSpent || 0} minutes
          </p>
          <div style={{ 
            width: '100%', 
            height: '8px', 
            background: '#eee', 
            borderRadius: '4px', 
            margin: '10px 0',
            overflow: 'hidden'
          }}>
            <div style={{ 
              width: `${Math.min(((currentTask.timeSpent || 0) / (currentTask.duration || 25)) * 100, 100)}%`, 
              height: '100%', 
              background: '#FF8A65',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      )}
      
      <div style={{ margin: '20px 0' }}>
        {!isActive ? (
          <button 
            onClick={isBreak ? resumeTimer : () => startTimer(currentTaskId)}
            style={{ 
              padding: '15px 30px', 
              fontSize: '18px', 
              backgroundColor: isBreak ? '#4CAF50' : '#4CAF50', 
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            {isBreak ? 'Resume' : 'Start'}
          </button>
        ) : (
          <button 
            onClick={pauseTimer}
            style={{ 
              padding: '15px 30px', 
              fontSize: '18px', 
              backgroundColor: '#ff9800', 
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Take Break
          </button>
        )}
        
        <button 
          onClick={resetTimer}
          style={{ 
            padding: '15px 30px', 
            fontSize: '18px', 
            backgroundColor: '#f44336', 
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default PomodoroTimer;