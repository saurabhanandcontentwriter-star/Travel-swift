import React, { useState } from 'react';
import { UserIcon, EmailIcon, PasswordIcon, PhoneIcon } from '../components/icons/Icons';
import type { User } from '../types';

interface SignupPageProps {
  onProceedToOtp: (user: User) => void;
  navigate: (page: 'login') => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onProceedToOtp, navigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Simulate a network call
    setTimeout(() => {
       if (!name || !email || !password || !phone) {
          setError('Please fill in all fields.');
          setIsLoading(false);
          return;
       }

      // Simulate a "user already exists" error
      if (email.toLowerCase() === 'taken@example.com') {
          setError('An account with this email address already exists.');
          setIsLoading(false);
          return;
      }
       
      // Proceed to OTP verification step on success
      onProceedToOtp({ name, email, phone });
      // No need to set isLoading to false here, as the component will unmount.

    }, 1000); // 1-second simulated delay
  };

  return (
    <div className="auth-form-container">
      <h2>Create an Account</h2>
      <form onSubmit={handleSubmit}>
        {error && <div className="error-message" role="alert">{error}</div>}
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <div className="input-wrapper">
            <span className="icon"><UserIcon /></span>
            <input
              type="text"
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your name"
              required
              disabled={isLoading}
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <div className="input-wrapper">
            <span className="icon"><EmailIcon /></span>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter email (or 'taken@example.com')"
              required
              disabled={isLoading}
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <div className="input-wrapper">
            <span className="icon"><PhoneIcon /></span>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="Enter your phone number"
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
              placeholder="Create a password"
              required
              disabled={isLoading}
            />
          </div>
        </div>
        <button type="submit" className="form-btn" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="spinner"></span>
              <span>Signing Up...</span>
            </>
          ) : (
            'Sign Up'
          )}
        </button>
      </form>
      <div className="form-switch">
        Already have an account?
        <button onClick={() => navigate('login')}>Login</button>
      </div>
    </div>
  );
};

export default SignupPage;