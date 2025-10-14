import React from 'react';
import { useAnalytics } from '../hooks/useAnalytics';

const AnalyticsDashboard = ({ userId, tasks }) => {
  const analytics = useAnalytics(userId, tasks);

  const StatCard = ({ title, value, subtitle, color = 'var(--accent)' }) => (
    <div style={{
      background: 'var(--cardBg)',
      border: '2px solid var(--border)',
      borderRadius: '12px',
      padding: '20px',
      textAlign: 'center',
      borderLeft: `6px solid ${color}`
    }}>
      <h4 style={{ margin: '0 0 10px 0', color: 'var(--textSecondary)' }}>{title}</h4>
      <div style={{ fontSize: '32px', fontWeight: 'bold', color, margin: '10px 0' }}>{value}</div>
      {subtitle && <p style={{ margin: 0, fontSize: '14px', color: 'var(--textSecondary)' }}>{subtitle}</p>}
    </div>
  );

  const ProgressBar = ({ label, current, total, color = 'var(--accent)' }) => {
    const percentage = total > 0 ? (current / total) * 100 : 0;
    return (
      <div style={{ marginBottom: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <span style={{ fontSize: '14px', color: 'var(--textPrimary)' }}>{label}</span>
          <span style={{ fontSize: '14px', color: 'var(--textSecondary)' }}>{current}/{total}</span>
        </div>
        <div style={{
          width: '100%',
          height: '8px',
          background: 'var(--border)',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${percentage}%`,
            height: '100%',
            background: color,
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: 'var(--textPrimary)', marginBottom: '30px' }}>📊 Analytics Dashboard</h2>
      
      {/* Completion Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <StatCard 
          title="Completion Rate" 
          value={`${analytics.completionStats.completionRate}%`}
          subtitle={`${analytics.completionStats.completed}/${analytics.completionStats.total} tasks`}
          color="var(--success)"
        />
        <StatCard 
          title="Current Streak" 
          value={`${analytics.streaks.currentStreak}`}
          subtitle="days in a row"
          color="var(--warning)"
        />
        <StatCard 
          title="Time Spent" 
          value={`${Math.floor(analytics.timeTracking.totalTimeSpent / 60)}h`}
          subtitle={`${analytics.timeTracking.totalTimeSpent % 60}m total`}
          color="var(--accent)"
        />
        <StatCard 
          title="Estimate Accuracy" 
          value={`${analytics.timeTracking.accuracy}%`}
          subtitle="time estimation"
          color={analytics.timeTracking.accuracy > 100 ? 'var(--error)' : 'var(--success)'}
        />
      </div>

      {/* Priority Breakdown */}
      <div style={{
        background: 'var(--cardBg)',
        border: '2px solid var(--border)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h3 style={{ color: 'var(--textPrimary)', marginBottom: '20px' }}>📈 Priority Breakdown</h3>
        <ProgressBar 
          label="High Priority" 
          current={analytics.completionStats.byPriority.high.completed}
          total={analytics.completionStats.byPriority.high.total}
          color="var(--error)"
        />
        <ProgressBar 
          label="Medium Priority" 
          current={analytics.completionStats.byPriority.medium.completed}
          total={analytics.completionStats.byPriority.medium.total}
          color="var(--warning)"
        />
        <ProgressBar 
          label="Low Priority" 
          current={analytics.completionStats.byPriority.low.completed}
          total={analytics.completionStats.byPriority.low.total}
          color="var(--success)"
        />
      </div>

      {/* Weekly Report */}
      <div style={{
        background: 'var(--cardBg)',
        border: '2px solid var(--border)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h3 style={{ color: 'var(--textPrimary)', marginBottom: '20px' }}>📅 This Week's Report</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--accent)' }}>
              {analytics.weeklyReport.tasksCompleted}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--textSecondary)' }}>Tasks Completed</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--success)' }}>
              {analytics.weeklyReport.completionRate}%
            </div>
            <div style={{ fontSize: '12px', color: 'var(--textSecondary)' }}>Completion Rate</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--warning)' }}>
              {Math.floor(analytics.weeklyReport.timeSpent / 60)}h
            </div>
            <div style={{ fontSize: '12px', color: 'var(--textSecondary)' }}>Time Invested</div>
          </div>
          {analytics.weeklyReport.mostProductiveDay.day && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--accent)' }}>
                {analytics.weeklyReport.mostProductiveDay.day}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--textSecondary)' }}>Most Productive</div>
            </div>
          )}
        </div>
      </div>

      {/* Streaks & Habits */}
      <div style={{
        background: 'var(--cardBg)',
        border: '2px solid var(--border)',
        borderRadius: '12px',
        padding: '20px'
      }}>
        <h3 style={{ color: 'var(--textPrimary)', marginBottom: '20px' }}>🔥 Streaks & Goals</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '15px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px' }}>🔥</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--warning)' }}>
              {analytics.streaks.longestStreak}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--textSecondary)' }}>Longest Streak</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px' }}>🎯</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--accent)' }}>
              {analytics.goals.goalCompleted}/{analytics.goals.goalTasks}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--textSecondary)' }}>Goals Progress</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px' }}>🔄</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--success)' }}>
              {analytics.goals.habitCompleted}/{analytics.goals.habitTasks}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--textSecondary)' }}>Habits Done</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;