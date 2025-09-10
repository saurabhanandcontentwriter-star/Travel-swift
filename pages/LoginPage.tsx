import React, { useState } from 'react';
import { EmailIcon, PasswordIcon } from '../components/icons/Icons';
import type { User } from '../types';

interface LoginPageProps {
  onLogin: (user: User) => void;
  navigate: (page: 'signup') => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, navigate }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Simulate a network call
    setTimeout(() => {
      if (!identifier || !password) {
        // This case is unlikely due to 'required' but good for robustness
        setError('Please fill in all fields.');
        setIsLoading(false);
        return;
      }
      
      // Simulate login failure for demonstration purposes
      if (password.toLowerCase() === 'fail') {
        setError('Invalid credentials. Please check your email/phone and password.');
        setIsLoading(false);
        return;
      }
      
      // On success, mock a user and proceed
      const isEmail = identifier.includes('@');
      onLogin({ 
        name: 'Demo User', 
        email: isEmail ? identifier : `user-${identifier.slice(0,4)}@example.com`,
        phone: isEmail ? '9876543210' : identifier
      });
      // No need to set isLoading to false here, as the component will unmount on success.

    }, 1000); // 1-second simulated delay
  };

  return (
    <div className="auth-form-container">
      <h2>Welcome Back!</h2>
      <form onSubmit={handleSubmit}>
        {error && <div className="error-message" role="alert">{error}</div>}
        <div className="form-group">
          <label htmlFor="identifier">Email or Phone Number</label>
          <div className="input-wrapper">
            <span className="icon"><EmailIcon /></span>
            <input
              type="text"
              id="identifier"
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              placeholder="Enter your email or phone"
              required
              disabled={isLoading}
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="input-wrapper">
            <span className="icon"><PasswordIcon /></span>
            <input
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password (or 'fail' to test)"
              required
              disabled={isLoading}
            />
          </div>
        </div>
        <button type="submit" className="form-btn" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="spinner"></span>
              <span>Logging in...</span>
            </>
          ) : (
            'Login'
          )}
        </button>
      </form>
      <div className="form-switch">
        Don't have an account?
        <button onClick={() => navigate('signup')}>Sign Up</button>
      </div>
    </div>
  );
};

export default LoginPage;