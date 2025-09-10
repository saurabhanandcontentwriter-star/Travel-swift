import React, { useState } from 'react';
import { PasswordIcon } from '../components/icons/Icons';

interface OtpPageProps {
  userEmail: string;
  onVerify: (otp: string) => void;
}

const OtpPage: React.FC<OtpPageProps> = ({ userEmail, onVerify }) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (otp.length !== 6) {
      setError('OTP must be 6 digits.');
      return;
    }

    // In a real app, the parent would handle verification and return success/failure.
    // For this demo, we'll check the mock OTP here to display the error locally.
    if (otp === '123456') {
      onVerify(otp);
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Verify Your Account</h2>
      <p className="otp-info">
        Enter the 6-digit code sent to <strong>{userEmail}</strong>.
        <br />
        (Hint: the code is 123456)
      </p>
      <form onSubmit={handleSubmit}>
        {error && <div className="error-message" role="alert">{error}</div>}
        <div className="form-group">
          <label htmlFor="otp">Verification Code</label>
          <div className="input-wrapper">
            <span className="icon"><PasswordIcon /></span>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={e => {
                // Allow only numbers and limit to 6 digits
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 6) {
                  setOtp(value);
                }
              }}
              placeholder="Enter 6-digit OTP"
              required
              pattern="\d{6}"
              title="OTP must be 6 digits"
            />
          </div>
        </div>
        <button type="submit" className="form-btn">Verify & Create Account</button>
      </form>
    </div>
  );
};

export default OtpPage;
