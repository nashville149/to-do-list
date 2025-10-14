import React, { useState } from 'react';

const GoalsTracker = ({ tasks, addTask, updateTask }) => {
  const [newGoal, setNewGoal] = useState('');
  const [goalType, setGoalType] = useState('daily');

  const getGoalTasks = () => {
    return tasks.filter(task => task.tags?.includes('goal'));
  };

  const getHabitTasks = () => {
    return tasks.filter(task => task.recurring !== 'none');
  };

  const createGoalTask = () => {
    if (!newGoal.trim()) return;
    
    const goalTask = {
      title: newGoal,
      tags: ['goal'],
      priority: 'high',
      recurring: goalType,
      estimatedTime: 30,
      notes: `Goal task - ${goalType} habit`
    };
    
    addTask(goalTask);
    setNewGoal('');
  };

  const calculateGoalProgress = (goalTasks) => {
    const total = goalTasks.length;
    const completed = goalTasks.filter(t => t.completed).length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const goalTasks = getGoalTasks();
  const habitTasks = getHabitTasks();
  const goalProgress = calculateGoalProgress(goalTasks);
  const habitProgress = calculateGoalProgress(habitTasks);

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: 'var(--textPrimary)', marginBottom: '30px' }}>🎯 Goals & Habits Tracker</h2>
      
      {/* Create New Goal */}
      <div style={{
        background: 'var(--cardBg)',
        border: '2px solid var(--border)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h3 style={{ color: 'var(--textPrimary)', marginBottom: '15px' }}>Create New Goal</h3>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="Enter your goal or habit..."
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            style={{ flex: 1, padding: '10px' }}
          />
          <select
            value={goalType}
            onChange={(e) => setGoalType(e.target.value)}
            style={{ padding: '10px' }}
          >
            <option value="daily">Daily Habit</option>
            <option value="weekly">Weekly Goal</option>
            <option value="monthly">Monthly Goal</option>
            <option value="none">One-time Goal</option>
          </select>
          <button
            onClick={createGoalTask}
            style={{
              padding: '10px 20px',
              background: 'var(--accent)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Add Goal
          </button>
        </div>
      </div>

      {/* Progress Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{
          background: 'var(--cardBg)',
          border: '2px solid var(--border)',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>🎯</div>
          <h3 style={{ color: 'var(--textPrimary)' }}>Goals Progress</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--accent)', marginBottom: '10px' }}>
            {goalProgress}%
          </div>
          <div style={{ fontSize: '14px', color: 'var(--textSecondary)' }}>
            {goalTasks.filter(t => t.completed).length} of {goalTasks.length} completed
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            background: 'var(--border)',
            borderRadius: '4px',
            marginTop: '15px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${goalProgress}%`,
              height: '100%',
              background: 'var(--accent)',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        <div style={{
          background: 'var(--cardBg)',
          border: '2px solid var(--border)',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>🔄</div>
          <h3 style={{ color: 'var(--textPrimary)' }}>Habits Progress</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--success)', marginBottom: '10px' }}>
            {habitProgress}%
          </div>
          <div style={{ fontSize: '14px', color: 'var(--textSecondary)' }}>
            {habitTasks.filter(t => t.completed).length} of {habitTasks.length} completed
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            background: 'var(--border)',
            borderRadius: '4px',
            marginTop: '15px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${habitProgress}%`,
              height: '100%',
              background: 'var(--success)',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      </div>

      {/* Goals List */}
      <div style={{
        background: 'var(--cardBg)',
        border: '2px solid var(--border)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h3 style={{ color: 'var(--textPrimary)', marginBottom: '15px' }}>🎯 Active Goals</h3>
        {goalTasks.length === 0 ? (
          <p style={{ color: 'var(--textSecondary)', textAlign: 'center', padding: '20px' }}>
            No goals set yet. Create your first goal above!
          </p>
        ) : (
          goalTasks.map(task => (
            <div key={task.id} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              marginBottom: '8px',
              background: task.completed ? 'var(--success)' : 'transparent'
            }}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={(e) => updateTask(task.id, { completed: e.target.checked })}
                style={{ marginRight: '10px' }}
              />
              <span style={{ 
                flex: 1, 
                color: 'var(--textPrimary)',
                textDecoration: task.completed ? 'line-through' : 'none'
              }}>
                {task.title}
              </span>
              {task.recurring !== 'none' && (
                <span style={{ 
                  background: 'var(--warning)', 
                  color: 'white', 
                  padding: '2px 6px', 
                  borderRadius: '4px', 
                  fontSize: '10px' 
                }}>
                  {task.recurring.toUpperCase()}
                </span>
              )}
            </div>
          ))
        )}
      </div>

      {/* Habits List */}
      <div style={{
        background: 'var(--cardBg)',
        border: '2px solid var(--border)',
        borderRadius: '12px',
        padding: '20px'
      }}>
        <h3 style={{ color: 'var(--textPrimary)', marginBottom: '15px' }}>🔄 Daily Habits</h3>
        {habitTasks.length === 0 ? (
          <p style={{ color: 'var(--textSecondary)', textAlign: 'center', padding: '20px' }}>
            No recurring habits yet. Create daily/weekly habits above!
          </p>
        ) : (
          habitTasks.map(task => (
            <div key={task.id} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              marginBottom: '8px',
              background: task.completed ? 'var(--success)' : 'transparent'
            }}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={(e) => updateTask(task.id, { completed: e.target.checked })}
                style={{ marginRight: '10px' }}
              />
              <span style={{ 
                flex: 1, 
                color: 'var(--textPrimary)',
                textDecoration: task.completed ? 'line-through' : 'none'
              }}>
                {task.title}
              </span>
              <span style={{ 
                background: 'var(--accent)', 
                color: 'white', 
                padding: '2px 6px', 
                borderRadius: '4px', 
                fontSize: '10px' 
              }}>
                {task.recurring.toUpperCase()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GoalsTracker;