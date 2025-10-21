import { useState, useEffect } from 'react';
import { Clock, BadgeDollarSign, Trophy, CircleX, CircleCheck, TriangleAlert, Tag } from 'lucide-react';

const GoalsTracker = ({ tasks, addTask, updateTask }) => {
  const [newGoal, setNewGoal] = useState('');
  const [goalType, setGoalType] = useState('daily');
  
  // Challenge states
  const [challenges, setChallenges] = useState([]);
  const [showChallengeForm, setShowChallengeForm] = useState(false);
  const [showAbandonDialog, setShowAbandonDialog] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [challengeForm, setChallengeForm] = useState({
    title: '',
    timePeriod: '',
    timeUnit: 'hours',
    stakeAmount: '',
    category: 'Study'
  });

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

  // Challenge functions
  const formatTimeRemaining = (endDate) => {
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();
    
    if (diff <= 0) return "Expired";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    
    if (days > 0) {
      return `${days}d ${remainingHours}h`;
    }
    return `${hours}h`;
  };

  const createChallenge = () => {
    if (!challengeForm.title.trim() || !challengeForm.timePeriod || !challengeForm.stakeAmount) {
      return;
    }

    const now = new Date();
    const timeInMs = challengeForm.timeUnit === 'hours' 
      ? parseInt(challengeForm.timePeriod) * 60 * 60 * 1000
      : parseInt(challengeForm.timePeriod) * 24 * 60 * 60 * 1000;
    
    const newChallenge = {
      id: Date.now().toString(),
      title: challengeForm.title,
      category: challengeForm.category,
      timePeriod: parseInt(challengeForm.timePeriod),
      timeUnit: challengeForm.timeUnit,
      stakeAmount: parseInt(challengeForm.stakeAmount),
      status: 'active',
      startDate: now,
      endDate: new Date(now.getTime() + timeInMs),
      createdAt: now
    };

    setChallenges([...challenges, newChallenge]);
    setChallengeForm({
      title: '',
      timePeriod: '',
      timeUnit: 'hours',
      stakeAmount: '',
      category: 'Study'
    });
    setShowChallengeForm(false);
  };

  const completeChallenge = (challengeId) => {
    setChallenges(challenges.map(c => 
      c.id === challengeId 
        ? { ...c, status: 'completed', completedAt: new Date() }
        : c
    ));
  };

  const abandonChallenge = () => {
    if (selectedChallenge) {
      setChallenges(challenges.map(c => 
        c.id === selectedChallenge.id 
          ? { ...c, status: 'abandoned', abandonedAt: new Date() }
          : c
      ));
      setShowAbandonDialog(false);
      setSelectedChallenge(null);
    }
  };

  const getChallengeStats = () => {
    const completed = challenges.filter(c => c.status === 'completed');
    const abandoned = challenges.filter(c => c.status === 'abandoned');
    
    return {
      totalStakesWon: completed.reduce((sum, c) => sum + c.stakeAmount, 0),
      totalStakesLost: abandoned.reduce((sum, c) => sum + c.stakeAmount, 0),
      totalChallenges: challenges.length,
      completedChallenges: completed.length,
      successRate: challenges.length > 0 
        ? Math.round((completed.length / challenges.length) * 100) 
        : 0
    };
  };

  // Auto-expire challenges
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setChallenges(prev => prev.map(c => {
        if (c.status === 'active' && c.endDate <= now) {
          return { ...c, status: 'expired' };
        }
        return c;
      }));
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const goalTasks = getGoalTasks();
  const habitTasks = getHabitTasks();
  const goalProgress = calculateGoalProgress(goalTasks);
  const habitProgress = calculateGoalProgress(habitTasks);
  const activeChallenges = challenges.filter(c => c.status === 'active');
  const completedChallenges = challenges.filter(c => c.status === 'completed');
  const stats = getChallengeStats();

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: 'var(--textPrimary)', marginBottom: '30px' }}>🎯 Goals, Habits & Challenges</h2>
      
      {/* Create Challenge Section */}
      <div style={{
        background: 'var(--cardBg)',
        border: '2px solid var(--border)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ color: 'var(--textPrimary)', margin: 0 }}>🏆 Create a Challenge</h3>
          {!showChallengeForm && (
            <button
              onClick={() => setShowChallengeForm(true)}
              style={{
                padding: '8px 16px',
                background: 'var(--accent)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <span style={{ fontSize: '18px' }}>+</span> New Challenge
            </button>
          )}
        </div>

        {showChallengeForm && (
          <div style={{ marginTop: '15px' }}>
            <input
              type="text"
              placeholder="Challenge title (e.g., Complete JavaScript in 3 days)"
              value={challengeForm.title}
              onChange={(e) => setChallengeForm({...challengeForm, title: e.target.value})}
              style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
            />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
              <div style={{ display: 'flex', gap: '5px' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <Clock size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--textSecondary)' }} />
                  <input
                    type="number"
                    placeholder="Time period"
                    value={challengeForm.timePeriod}
                    onChange={(e) => setChallengeForm({...challengeForm, timePeriod: e.target.value})}
                    style={{ width: '100%', padding: '10px 10px 10px 35px' }}
                    min="1"
                  />
                </div>
                <select
                  value={challengeForm.timeUnit}
                  onChange={(e) => setChallengeForm({...challengeForm, timeUnit: e.target.value})}
                  style={{ padding: '10px' }}
                >
                  <option value="hours">hours</option>
                  <option value="days">days</option>
                </select>
              </div>

              <div style={{ position: 'relative' }}>
                <BadgeDollarSign size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--textSecondary)' }} />
                <input
                  type="number"
                  placeholder="Stake amount"
                  value={challengeForm.stakeAmount}
                  onChange={(e) => setChallengeForm({...challengeForm, stakeAmount: e.target.value})}
                  style={{ width: '100%', padding: '10px 10px 10px 35px' }}
                  min="1"
                />
              </div>
            </div>

            <div style={{ position: 'relative', marginBottom: '15px' }}>
              <Tag size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--textSecondary)' }} />
              <select
                value={challengeForm.category}
                onChange={(e) => setChallengeForm({...challengeForm, category: e.target.value})}
                style={{ width: '100%', padding: '10px 10px 10px 35px' }}
              >
                <option value="Study">📚 Study</option>
                <option value="Health">🏥 Health</option>
                <option value="Work">💼 Work</option>
                <option value="Personal">👤 Personal</option>
                <option value="Fitness">💪 Fitness</option>
                <option value="Learning">🎓 Learning</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={createChallenge}
                disabled={!challengeForm.title.trim() || !challengeForm.timePeriod || !challengeForm.stakeAmount}
                style={{
                  flex: 1,
                  padding: '10px 20px',
                  background: (!challengeForm.title.trim() || !challengeForm.timePeriod || !challengeForm.stakeAmount) ? '#ccc' : 'var(--accent)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: (!challengeForm.title.trim() || !challengeForm.timePeriod || !challengeForm.stakeAmount) ? 'not-allowed' : 'pointer'
                }}
              >
                Create Challenge
              </button>
              <button
                onClick={() => {
                  setShowChallengeForm(false);
                  setChallengeForm({
                    title: '',
                    timePeriod: '',
                    timeUnit: 'hours',
                    stakeAmount: '',
                    category: 'Study'
                  });
                }}
                style={{
                  padding: '10px 20px',
                  background: '#ccc',
                  color: 'var(--textPrimary)',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {!showChallengeForm && activeChallenges.length === 0 && (
          <p style={{ color: 'var(--textSecondary)', textAlign: 'center', padding: '20px', margin: 0 }}>
            No active challenges. Create your first challenge to get started!
          </p>
        )}
      </div>

      {/* Challenge Statistics */}
      {challenges.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
          <div style={{
            background: 'var(--cardBg)',
            border: '2px solid var(--border)',
            borderRadius: '12px',
            padding: '15px',
            textAlign: 'center'
          }}>
            <Trophy size={32} style={{ color: 'var(--success)', marginBottom: '8px' }} />
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--success)' }}>
              {stats.totalStakesWon}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--textSecondary)' }}>Stakes Won</div>
          </div>

          <div style={{
            background: 'var(--cardBg)',
            border: '2px solid var(--border)',
            borderRadius: '12px',
            padding: '15px',
            textAlign: 'center'
          }}>
            <BadgeDollarSign size={32} style={{ color: 'var(--error)', marginBottom: '8px' }} />
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--error)' }}>
              {stats.totalStakesLost}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--textSecondary)' }}>Stakes Lost</div>
          </div>

          <div style={{
            background: 'var(--cardBg)',
            border: '2px solid var(--border)',
            borderRadius: '12px',
            padding: '15px',
            textAlign: 'center'
          }}>
            <CircleCheck size={32} style={{ color: 'var(--accent)', marginBottom: '8px' }} />
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--accent)' }}>
              {stats.successRate}%
            </div>
            <div style={{ fontSize: '12px', color: 'var(--textSecondary)' }}>Success Rate</div>
          </div>
        </div>
      )}

      {/* Active Challenges */}
      {activeChallenges.length > 0 && (
        <div style={{
          background: 'var(--cardBg)',
          border: '2px solid var(--border)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: 'var(--textPrimary)', marginBottom: '15px' }}>🏆 Active Challenges</h3>
          {activeChallenges.map(challenge => (
            <div key={challenge.id} style={{
              border: '2px solid var(--border)',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '12px',
              background: 'var(--cardBg)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 8px 0', color: 'var(--textPrimary)' }}>{challenge.title}</h4>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <span style={{
                      background: 'var(--accent)',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Tag size={12} />
                      {challenge.category}
                    </span>
                    <span style={{
                      background: 'var(--warning)',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Clock size={12} />
                      {formatTimeRemaining(challenge.endDate)}
                    </span>
                    <span style={{
                      background: 'var(--success)',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <BadgeDollarSign size={12} />
                      {challenge.stakeAmount} units
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <button
                  onClick={() => completeChallenge(challenge.id)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    background: 'var(--success)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px',
                    fontSize: '14px'
                  }}
                >
                  <CircleCheck size={16} />
                  Complete
                </button>
                <button
                  onClick={() => {
                    setSelectedChallenge(challenge);
                    setShowAbandonDialog(true);
                  }}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    background: 'var(--error)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px',
                    fontSize: '14px'
                  }}
                >
                  <CircleX size={16} />
                  Abandon
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Completed Challenges */}
      {completedChallenges.length > 0 && (
        <div style={{
          background: 'var(--cardBg)',
          border: '2px solid var(--border)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: 'var(--textPrimary)', marginBottom: '15px' }}>✅ Completed Challenges</h3>
          {completedChallenges.map(challenge => (
            <div key={challenge.id} style={{
              border: '2px solid var(--success)',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '8px',
              background: 'rgba(76, 175, 80, 0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--textPrimary)', fontWeight: '500' }}>{challenge.title}</span>
                <span style={{
                  background: 'var(--success)',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Trophy size={12} />
                  +{challenge.stakeAmount} units
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Abandon Confirmation Dialog */}
      {showAbandonDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'var(--cardBg)',
            padding: '30px',
            borderRadius: '12px',
            maxWidth: '400px',
            border: '2px solid var(--border)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <TriangleAlert size={48} style={{ color: 'var(--warning)', marginBottom: '10px' }} />
              <h3 style={{ margin: '0 0 10px 0', color: 'var(--textPrimary)' }}>Abandon Challenge?</h3>
              <p style={{ margin: 0, color: 'var(--textSecondary)' }}>
                Are you sure you want to abandon this challenge?
              </p>
              <p style={{ margin: '10px 0 0 0', color: 'var(--error)', fontWeight: 'bold' }}>
                You will lose {selectedChallenge?.stakeAmount} units.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => {
                  setShowAbandonDialog(false);
                  setSelectedChallenge(null);
                }}
                style={{
                  flex: 1,
                  padding: '10px 20px',
                  background: '#ccc',
                  color: 'var(--textPrimary)',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={abandonChallenge}
                style={{
                  flex: 1,
                  padding: '10px 20px',
                  background: 'var(--error)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      
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