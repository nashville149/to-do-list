export const validatePassword = (password) => {
  const requirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  const isValid = Object.values(requirements).every(req => req);
  
  return {
    isValid,
    requirements,
    strength: calculateStrength(requirements)
  };
};

const calculateStrength = (requirements) => {
  const score = Object.values(requirements).filter(Boolean).length;
  if (score < 3) return { level: 'weak', color: '#f44336', text: 'Weak' };
  if (score < 4) return { level: 'medium', color: '#ff9800', text: 'Medium' };
  if (score < 5) return { level: 'strong', color: '#4caf50', text: 'Strong' };
  return { level: 'very-strong', color: '#2e7d32', text: 'Very Strong' };
};

export const generateSecurePassword = () => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*(),.?":{}|<>';
  
  let password = '';
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  const allChars = uppercase + lowercase + numbers + symbols;
  for (let i = 4; i < 12; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  return password.split('').sort(() => Math.random() - 0.5).join('');
};