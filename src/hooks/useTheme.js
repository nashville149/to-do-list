import { useState, useEffect } from 'react';

const themes = {
  light: {
    name: 'Light',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    cardBg: '#ffffff',
    textPrimary: '#333333',
    textSecondary: '#666666',
    border: '#FFCCBC',
    accent: '#FF8A65',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#f44336'
  },
  dark: {
    name: 'Dark',
    background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
    cardBg: '#2c3e50',
    textPrimary: '#ecf0f1',
    textSecondary: '#bdc3c7',
    border: '#34495e',
    accent: '#e74c3c',
    success: '#27ae60',
    warning: '#f39c12',
    error: '#e74c3c'
  },
  ocean: {
    name: 'Ocean',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    cardBg: '#f8fdff',
    textPrimary: '#2c3e50',
    textSecondary: '#34495e',
    border: '#3498db',
    accent: '#2980b9',
    success: '#16a085',
    warning: '#f39c12',
    error: '#e74c3c'
  },
  forest: {
    name: 'Forest',
    background: 'linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)',
    cardBg: '#f8fff8',
    textPrimary: '#2d5016',
    textSecondary: '#4a7c59',
    border: '#a8e6cf',
    accent: '#27ae60',
    success: '#2ecc71',
    warning: '#f39c12',
    error: '#e74c3c'
  },
  sunset: {
    name: 'Sunset',
    background: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)',
    cardBg: '#fff9f5',
    textPrimary: '#8b4513',
    textSecondary: '#cd853f',
    border: '#feb47b',
    accent: '#ff6b35',
    success: '#27ae60',
    warning: '#f39c12',
    error: '#e74c3c'
  }
};

export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState('light');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setCurrentTheme(savedTheme);
    setIsDarkMode(savedDarkMode);
    applyTheme(savedTheme, savedDarkMode);
  }, []);

  const applyTheme = (themeName, darkMode = false) => {
    const theme = darkMode ? themes.dark : themes[themeName];
    const root = document.documentElement;
    
    Object.entries(theme).forEach(([key, value]) => {
      if (key !== 'name') {
        root.style.setProperty(`--${key}`, value);
      }
    });
  };

  const changeTheme = (themeName) => {
    setCurrentTheme(themeName);
    localStorage.setItem('theme', themeName);
    applyTheme(themeName, isDarkMode);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    applyTheme(currentTheme, newDarkMode);
  };

  const getTheme = () => {
    return isDarkMode ? themes.dark : themes[currentTheme];
  };

  return {
    currentTheme,
    isDarkMode,
    themes,
    changeTheme,
    toggleDarkMode,
    getTheme
  };
};