import React from 'react';
import { useTheme } from '../hooks/useTheme';

const ThemeSelector = ({ onClose }) => {
  const { currentTheme, isDarkMode, themes, changeTheme, toggleDarkMode } = useTheme();

  return (
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
        width: '400px',
        border: '2px solid var(--border)',
        color: 'var(--textPrimary)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0 }}>🎨 Customize Theme</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--textPrimary)' }}>×</button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={isDarkMode}
              onChange={toggleDarkMode}
              style={{ width: '18px', height: '18px' }}
            />
            <span>🌙 Dark Mode</span>
          </label>
        </div>

        <div>
          <h4 style={{ marginBottom: '15px' }}>Choose Theme:</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {Object.entries(themes).map(([key, theme]) => (
              <button
                key={key}
                onClick={() => changeTheme(key)}
                style={{
                  padding: '15px',
                  border: currentTheme === key ? '3px solid var(--accent)' : '2px solid var(--border)',
                  borderRadius: '8px',
                  background: theme.cardBg,
                  color: theme.textPrimary,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <div style={{ 
                  width: '40px', 
                  height: '20px', 
                  background: theme.accent, 
                  borderRadius: '4px' 
                }} />
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{theme.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;