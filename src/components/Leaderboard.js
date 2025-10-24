import { useState } from 'react';
import { Trophy, Star, Zap, Target, Crown, ArrowUp, Flame, TrendingUp } from 'lucide-react';
import { mockQuery } from './leaderboard/leaderboardMockData.ts';
import { 
  formatPoints, 
  formatCompletionSpeed, 
  formatSuccessRate, 
  getBadgeDisplay,
  getNextBadge 
} from '../utils/leaderboardFormatters.ts';

const Leaderboard = ({ userId }) => {
  const [sortBy, setSortBy] = useState('rank');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // Using mock data - in production this would come from API
  const { userStats, leaderboard, pointsBreakdown, badgeProgress } = mockQuery;

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const sortedLeaderboard = [...leaderboard].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    
    if (sortBy === 'rank') {
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    }
    
    return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
  });

  const getRankColor = (rank) => {
    if (rank === 1) return 'var(--warning)';
    if (rank === 2) return '#C0C0C0';
    if (rank === 3) return '#CD7F32';
    return 'var(--textSecondary)';
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown size={20} style={{ color: 'var(--warning)' }} />;
    if (rank === 2) return <Trophy size={20} style={{ color: '#C0C0C0' }} />;
    if (rank === 3) return <Trophy size={20} style={{ color: '#CD7F32' }} />;
    return null;
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: 'var(--textPrimary)', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Trophy size={32} style={{ color: 'var(--accent)' }} />
        Leaderboard & Achievements
      </h2>

      {/* User Stats Card */}
      <div style={{
        background: 'linear-gradient(135deg, var(--accent) 0%, var(--warning) 100%)',
        border: '2px solid var(--border)',
        borderRadius: '12px',
        padding: '25px',
        marginBottom: '25px',
        color: 'white'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
          <div>
            <h3 style={{ margin: '0 0 5px 0', fontSize: '24px' }}>Your Stats</h3>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>Keep completing tasks to climb the leaderboard!</p>
          </div>
          <div style={{ 
            background: 'rgba(255,255,255,0.2)', 
            padding: '8px 16px', 
            borderRadius: '20px',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            {getBadgeDisplay(userStats.badge)}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '15px' }}>
          <div style={{ background: 'rgba(255,255,255,0.15)', padding: '15px', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Trophy size={18} />
              <span style={{ fontSize: '12px', opacity: 0.9 }}>Global Rank</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>#{userStats.rank}</div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.15)', padding: '15px', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Star size={18} />
              <span style={{ fontSize: '12px', opacity: 0.9 }}>Total Points</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{formatPoints(userStats.totalPoints)}</div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.15)', padding: '15px', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Zap size={18} />
              <span style={{ fontSize: '12px', opacity: 0.9 }}>Speed Score</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{userStats.speedScore}</div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.15)', padding: '15px', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Target size={18} />
              <span style={{ fontSize: '12px', opacity: 0.9 }}>Productivity</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{userStats.productivityScore}</div>
          </div>
        </div>
      </div>

      {/* Points Breakdown & Badge Progress */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '25px' }}>
        {/* Points Breakdown */}
        <div style={{
          background: 'var(--cardBg)',
          border: '2px solid var(--border)',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <h3 style={{ color: 'var(--textPrimary)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Star size={20} style={{ color: 'var(--accent)' }} />
            Points Breakdown
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'var(--border)', borderRadius: '6px' }}>
              <span style={{ color: 'var(--textPrimary)' }}>✅ Task Completion</span>
              <span style={{ fontWeight: 'bold', color: 'var(--accent)' }}>{formatPoints(pointsBreakdown.completionPoints)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'var(--border)', borderRadius: '6px' }}>
              <span style={{ color: 'var(--textPrimary)' }}>⚡ Speed Bonus</span>
              <span style={{ fontWeight: 'bold', color: 'var(--warning)' }}>{formatPoints(pointsBreakdown.speedBonusPoints)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'var(--border)', borderRadius: '6px' }}>
              <span style={{ color: 'var(--textPrimary)' }}>🏆 Challenges</span>
              <span style={{ fontWeight: 'bold', color: 'var(--success)' }}>{formatPoints(pointsBreakdown.challengePoints)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'var(--border)', borderRadius: '6px' }}>
              <span style={{ color: 'var(--textPrimary)' }}>🔥 Streak Bonus</span>
              <span style={{ fontWeight: 'bold', color: 'var(--error)' }}>{formatPoints(pointsBreakdown.streakBonusPoints)}</span>
            </div>
          </div>
        </div>

        {/* Badge Progress */}
        <div style={{
          background: 'var(--cardBg)',
          border: '2px solid var(--border)',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <h3 style={{ color: 'var(--textPrimary)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Flame size={20} style={{ color: 'var(--warning)' }} />
            Badge Progress
          </h3>
          
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>
              {getBadgeDisplay(badgeProgress.currentBadge)}
            </div>
            {badgeProgress.nextBadge && (
              <>
                <div style={{ fontSize: '14px', color: 'var(--textSecondary)', marginBottom: '10px' }}>
                  Next: {getBadgeDisplay(badgeProgress.nextBadge)}
                </div>
                <div style={{
                  width: '100%',
                  height: '12px',
                  background: 'var(--border)',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  marginBottom: '8px'
                }}>
                  <div style={{
                    width: `${(badgeProgress.currentStreak / badgeProgress.streakNeeded) * 100}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, var(--accent), var(--warning))',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
                <div style={{ fontSize: '12px', color: 'var(--textSecondary)' }}>
                  {badgeProgress.tasksUntilNextBadge} more days to {getBadgeDisplay(badgeProgress.nextBadge)}
                </div>
              </>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-around', padding: '15px 0', borderTop: '1px solid var(--border)' }}>
            <div style={{ textAlign: 'center' }}>
              <Flame size={24} style={{ color: 'var(--warning)', marginBottom: '5px' }} />
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--textPrimary)' }}>
                {badgeProgress.currentStreak}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--textSecondary)' }}>Current Streak</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <TrendingUp size={24} style={{ color: 'var(--success)', marginBottom: '5px' }} />
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--textPrimary)' }}>
                {userStats.longestStreak}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--textSecondary)' }}>Best Streak</div>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div style={{
        background: 'var(--cardBg)',
        border: '2px solid var(--border)',
        borderRadius: '12px',
        padding: '20px',
        overflowX: 'auto'
      }}>
        <h3 style={{ color: 'var(--textPrimary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Crown size={20} style={{ color: 'var(--warning)' }} />
          Top Performers
        </h3>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)' }}>
              <th 
                onClick={() => handleSort('rank')}
                style={{ 
                  padding: '12px', 
                  textAlign: 'left', 
                  color: 'var(--textSecondary)', 
                  fontSize: '14px',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                Rank {sortBy === 'rank' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th style={{ padding: '12px', textAlign: 'left', color: 'var(--textSecondary)', fontSize: '14px' }}>
                User
              </th>
              <th 
                onClick={() => handleSort('tasksCompleted')}
                style={{ 
                  padding: '12px', 
                  textAlign: 'center', 
                  color: 'var(--textSecondary)', 
                  fontSize: '14px',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                Tasks {sortBy === 'tasksCompleted' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                onClick={() => handleSort('completionSpeed')}
                style={{ 
                  padding: '12px', 
                  textAlign: 'center', 
                  color: 'var(--textSecondary)', 
                  fontSize: '14px',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                Speed {sortBy === 'completionSpeed' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                onClick={() => handleSort('challengeSuccessRate')}
                style={{ 
                  padding: '12px', 
                  textAlign: 'center', 
                  color: 'var(--textSecondary)', 
                  fontSize: '14px',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                Success {sortBy === 'challengeSuccessRate' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                onClick={() => handleSort('totalPoints')}
                style={{ 
                  padding: '12px', 
                  textAlign: 'right', 
                  color: 'var(--textSecondary)', 
                  fontSize: '14px',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                Points {sortBy === 'totalPoints' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedLeaderboard.map((entry) => (
              <tr 
                key={entry.userId}
                style={{ 
                  borderBottom: '1px solid var(--border)',
                  background: entry.userId === userId ? 'rgba(255, 138, 101, 0.1)' : 'transparent'
                }}
              >
                <td style={{ padding: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {getRankIcon(entry.rank)}
                    <span style={{ 
                      fontWeight: 'bold', 
                      fontSize: '18px',
                      color: getRankColor(entry.rank)
                    }}>
                      #{entry.rank}
                    </span>
                  </div>
                </td>
                <td style={{ padding: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'var(--accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}>
                      {entry.userName.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: '500', color: 'var(--textPrimary)' }}>
                        {entry.userName}
                        {entry.userId === userId && (
                          <span style={{ 
                            marginLeft: '8px', 
                            fontSize: '11px', 
                            color: 'var(--accent)',
                            background: 'rgba(255, 138, 101, 0.2)',
                            padding: '2px 6px',
                            borderRadius: '4px'
                          }}>
                            You
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--textSecondary)' }}>
                        {getBadgeDisplay(entry.badge)}
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '15px', textAlign: 'center', color: 'var(--textPrimary)', fontWeight: '500' }}>
                  {entry.tasksCompleted}
                </td>
                <td style={{ padding: '15px', textAlign: 'center', color: 'var(--textPrimary)' }}>
                  {formatCompletionSpeed(entry.completionSpeed)}
                </td>
                <td style={{ padding: '15px', textAlign: 'center' }}>
                  <span style={{
                    background: entry.challengeSuccessRate >= 90 ? 'var(--success)' : entry.challengeSuccessRate >= 70 ? 'var(--warning)' : 'var(--error)',
                    color: 'white',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}>
                    {formatSuccessRate(entry.challengeSuccessRate)}
                  </span>
                </td>
                <td style={{ padding: '15px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '5px' }}>
                    <Star size={16} style={{ color: 'var(--warning)' }} />
                    <span style={{ fontWeight: 'bold', color: 'var(--textPrimary)', fontSize: '16px' }}>
                      {formatPoints(entry.totalPoints)}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Info Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginTop: '20px' }}>
        <div style={{
          background: 'var(--cardBg)',
          border: '2px solid var(--border)',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <Zap size={32} style={{ color: 'var(--warning)', marginBottom: '10px' }} />
          <h4 style={{ margin: '0 0 8px 0', color: 'var(--textPrimary)' }}>Speed Matters</h4>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--textSecondary)' }}>
            Complete tasks faster to earn more points
          </p>
        </div>

        <div style={{
          background: 'var(--cardBg)',
          border: '2px solid var(--border)',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <Flame size={32} style={{ color: 'var(--error)', marginBottom: '10px' }} />
          <h4 style={{ margin: '0 0 8px 0', color: 'var(--textPrimary)' }}>Build Streaks</h4>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--textSecondary)' }}>
            Earn badges by maintaining daily streaks
          </p>
        </div>

        <div style={{
          background: 'var(--cardBg)',
          border: '2px solid var(--border)',
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <Trophy size={32} style={{ color: 'var(--success)', marginBottom: '10px' }} />
          <h4 style={{ margin: '0 0 8px 0', color: 'var(--textPrimary)' }}>Climb the Ranks</h4>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--textSecondary)' }}>
            More tasks completed = higher ranking
          </p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;