import React from 'react';

const PomodoroTimer = ({ 
  timeLeft, 
  isActive, 
  isBreak, 
  currentTaskId, 
  startTimer, 
  pauseTimer, 
  resetTimer, 
  formatTime,
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
      <h2>{isBreak ? 'Break Time' : 'Focus Time'}</h2>
      <div style={{ fontSize: '48px', fontWeight: 'bold', margin: '20px 0' }}>
        {formatTime(timeLeft)}
      </div>
      
      {currentTask && (
        <p style={{ fontSize: '18px', margin: '10px 0' }}>
          Working on: <strong>{currentTask.title}</strong>
        </p>
      )}
      
      <div style={{ margin: '20px 0' }}>
        {!isActive ? (
          <button 
            onClick={() => startTimer(currentTaskId)}
            style={{ 
              padding: '15px 30px', 
              fontSize: '18px', 
              backgroundColor: '#4CAF50', 
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Start
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
            Pause
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