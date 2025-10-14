import React, { useState } from 'react';
import { validatePassword, generateSecurePassword } from '../utils/passwordValidator';

const Auth = ({ login, register, sendVerification, user }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [passwordValidation, setPasswordValidation] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordChange = (newPassword) => {
    setPassword(newPassword);
    if (!isLogin) {
      setPasswordValidation(validatePassword(newPassword));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (!isLogin) {
      if (!passwordValidation?.isValid) {
        setError('Password does not meet security requirements');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }
    
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password);
        setMessage('Registration successful! Please check your email to verify your account.');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGeneratePassword = () => {
    const newPassword = generateSecurePassword();
    handlePasswordChange(newPassword);
    setConfirmPassword(newPassword);
  };

  const handleResendVerification = async () => {
    setError('');
    setMessage('');
    try {
      await sendVerification();
      setMessage('Verification email sent! Please check your inbox.');
    } catch (err) {
      if (err.code === 'auth/too-many-requests') {
        setError('Too many requests. Please wait a few minutes before trying again.');
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '10px', margin: '10px 0' }}
          required
        />
        <div style={{ position: 'relative' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            style={{ width: '100%', padding: '10px', margin: '10px 0', paddingRight: '40px' }}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>
        
        {!isLogin && (
          <>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ width: '100%', padding: '10px', margin: '10px 0' }}
              required
            />
            
            <button
              type="button"
              onClick={handleGeneratePassword}
              style={{
                width: '100%',
                padding: '8px',
                margin: '5px 0',
                background: 'var(--success)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              🔐 Generate Secure Password
            </button>
            
            {passwordValidation && (
              <div style={{
                margin: '10px 0',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '12px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px'
                }}>
                  <span>Password Strength:</span>
                  <span style={{
                    color: passwordValidation.strength.color,
                    fontWeight: 'bold'
                  }}>
                    {passwordValidation.strength.text}
                  </span>
                </div>
                
                <div style={{ fontSize: '11px' }}>
                  <div style={{ color: passwordValidation.requirements.minLength ? 'green' : 'red' }}>
                    {passwordValidation.requirements.minLength ? '✓' : '✗'} At least 8 characters
                  </div>
                  <div style={{ color: passwordValidation.requirements.hasUppercase ? 'green' : 'red' }}>
                    {passwordValidation.requirements.hasUppercase ? '✓' : '✗'} Uppercase letter
                  </div>
                  <div style={{ color: passwordValidation.requirements.hasLowercase ? 'green' : 'red' }}>
                    {passwordValidation.requirements.hasLowercase ? '✓' : '✗'} Lowercase letter
                  </div>
                  <div style={{ color: passwordValidation.requirements.hasNumber ? 'green' : 'red' }}>
                    {passwordValidation.requirements.hasNumber ? '✓' : '✗'} Number
                  </div>
                  <div style={{ color: passwordValidation.requirements.hasSpecialChar ? 'green' : 'red' }}>
                    {passwordValidation.requirements.hasSpecialChar ? '✓' : '✗'} Special character
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <button type="submit" style={{ width: '100%', padding: '10px', margin: '10px 0' }}>
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      
      {user && !user.emailVerified && (
        <div style={{ 
          padding: '15px', 
          background: '#fff3cd', 
          border: '1px solid #ffeaa7', 
          borderRadius: '5px', 
          margin: '15px 0' 
        }}>
          <p style={{ color: '#856404', margin: '0 0 10px 0' }}>⚠️ Please verify your email address</p>
          <button 
            onClick={handleResendVerification}
            style={{ 
              padding: '8px 16px', 
              background: '#ffc107', 
              color: 'black', 
              border: 'none', 
              borderRadius: '3px', 
              cursor: 'pointer' 
            }}
          >
            Resend Verification Email
          </button>
        </div>
      )}
      
      <p>
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}>
          {isLogin ? 'Register' : 'Login'}
        </button>
      </p>
    </div>
  );
};

export default Auth;