import React from 'react';
import type { User, ServiceType } from '../types';
import { LargeCabIcon, LargeBusIcon } from '../components/icons/Icons';

interface HomePageProps {
  currentUser: User | null;
  onNavigateToBooking: (serviceType: ServiceType) => void;
}

const HomePage: React.FC<HomePageProps> = ({ currentUser, onNavigateToBooking }) => {
  const welcomeMessage = currentUser ? `Where to next, ${currentUser.name.split(' ')[0]}?` : 'Your Journey Starts Here';
  const subMessage = 'Book cabs and buses with ease across Bihar.';

  return (
    <div className="home-page">
      <div className="hero-section">
        <h2>{welcomeMessage}</h2>
        <p>{subMessage}</p>
      </div>

      <div className="home-actions">
        <button className="action-card" onClick={() => onNavigateToBooking('cab')}>
          <div className="action-card-icon">
            <LargeCabIcon />
          </div>
          <div className="action-card-text">
            <h3>Book a Cab</h3>
            <p>Fast, reliable, and at your doorstep.</p>
          </div>
        </button>
        <button className="action-card" onClick={() => onNavigateToBooking('bus')}>
          <div className="action-card-icon">
            <LargeBusIcon />
          </div>
          <div className="action-card-text">
            <h3>Book a Bus</h3>
            <p>Comfortable and affordable travel.</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default HomePage;