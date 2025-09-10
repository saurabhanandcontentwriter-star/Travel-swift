import React, { useEffect } from 'react';
import { CheckCircleIcon } from '../components/icons/Icons';

interface VerificationSuccessPageProps {
  navigate: (page: 'home') => void;
}

const VerificationSuccessPage: React.FC<VerificationSuccessPageProps> = ({ navigate }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('home');
    }, 2000); // 2-second delay before redirecting

    return () => clearTimeout(timer); // Cleanup the timer if the component unmounts
  }, [navigate]);

  return (
    <div className="verification-success-container">
      <div className="success-icon">
        <CheckCircleIcon />
      </div>
      <h2>Verification Successful!</h2>
      <p>Welcome! You will be redirected shortly.</p>
    </div>
  );
};

export default VerificationSuccessPage;
