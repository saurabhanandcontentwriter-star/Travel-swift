import React from 'react';
import type { User } from '../types';
import { HomeIcon, HistoryIcon, UserIcon, LoginIcon, SignupIcon } from './icons/Icons';

type Page = 'home' | 'booking' | 'login' | 'signup' | 'profile' | 'otp' | 'verification-success' | 'bookings' | 'ticket';

interface BottomNavBarProps {
  currentPage: Page;
  navigate: (page: Page) => void;
  currentUser: User | null;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentPage, navigate, currentUser }) => {
  const loggedInItems = [
    { page: 'home', label: 'Home', icon: <HomeIcon /> },
    { page: 'bookings', label: 'My Bookings', icon: <HistoryIcon /> },
    { page: 'profile', label: 'Profile', icon: <UserIcon /> },
  ];

  const loggedOutItems = [
    { page: 'home', label: 'Home', icon: <HomeIcon /> },
    { page: 'login', label: 'Login', icon: <LoginIcon /> },
    { page: 'signup', label: 'Sign Up', icon: <SignupIcon /> },
  ];
  
  const navItems = currentUser ? loggedInItems : loggedOutItems;


  return (
    <nav className="bottom-nav-bar">
      {navItems.map(item => {
        const isActive = currentPage === item.page || (item.page === 'home' && currentPage === 'booking');

        return (
          <button 
            key={item.page} 
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => navigate(item.page as Page)}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className="icon">{item.icon}</span>
            <span className="label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNavBar;