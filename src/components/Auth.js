import React, { useState } from 'react';

const Auth = ({ login, register, sendVerification, user }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
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
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '10px', margin: '10px 0' }}
          required
        />
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