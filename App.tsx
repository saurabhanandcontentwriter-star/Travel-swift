import React, { useState, useEffect } from 'react';
import BookingInterface from './components/BookingInterface';
import ThemeSwitcher from './components/ThemeSwitcher';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import OtpPage from './pages/OtpPage';
import VerificationSuccessPage from './pages/VerificationSuccessPage';
import BookingHistoryPage from './pages/BookingHistoryPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import BookingTicketPage from './pages/BookingTicketPage';
import { UserIcon } from './components/icons/Icons';
import type { User, Booking, CabResult, BusResult } from './types';

type Page = 'booking' | 'login' | 'signup' | 'profile' | 'otp' | 'verification-success' | 'bookings' | 'ticket';

const App: React.FC = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [currentPage, setCurrentPage] = useState<Page>('booking');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  const [bookingHistory, setBookingHistory] = useState<Booking[]>([]);
  const [rebookData, setRebookData] = useState<Booking | null>(null);
  const [bookingToConfirm, setBookingToConfirm] = useState<CabResult | BusResult | null>(null);
  const [lastBooking, setLastBooking] = useState<Booking | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);


  const getMockBookings = (): Booking[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to beginning of the day

    const bookings: Omit<Booking, 'status'>[] = [
      { id: 'h1', serviceType: 'cab', origin: 'Patna', destination: 'Delhi', date: '2024-07-15', fare: 450, details: 'Maruti Dzire (BR01AB1234)' },
      { id: 'h4', serviceType: 'bus', origin: 'Patna', destination: 'Gaya', date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], fare: 300, details: 'Bihar Travels' }, // 5 days in the future
      { id: 'h2', serviceType: 'bus', origin: 'Delhi', destination: 'Jaipur', date: '2024-06-20', fare: 850, details: 'Swift Travels' },
      { id: 'h3', serviceType: 'cab', origin: 'Mumbai', destination: 'Pune', date: '2024-05-01', fare: 700, details: 'Hyundai Verna (MH03EF9012)' },
    ];
    
    return bookings.map(b => ({
      ...b,
      status: new Date(b.date) < today ? 'completed' : 'upcoming',
    }));
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    // Check for a logged-in user in local storage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      setBookingHistory(getMockBookings());
    }
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const navigate = (page: Page) => {
    setCurrentPage(page);
  };
  
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    setBookingHistory(getMockBookings());
    navigate('booking');
  };

  const handleProceedToOtp = (user: User) => {
    // In a real app, you'd trigger the backend to send an OTP here.
    console.log('OTP for', user.email, 'is 123456');
    setPendingUser(user);
    navigate('otp');
  };
  
  const handleOtpVerification = (otp: string) => {
    // Mock OTP check - this now only handles the success case.
    // The OtpPage component will handle showing an error for invalid OTPs.
    if (otp === '123456' && pendingUser) {
      setCurrentUser(pendingUser);
      localStorage.setItem('currentUser', JSON.stringify(pendingUser));
      setBookingHistory(getMockBookings());
      setPendingUser(null);
      navigate('verification-success');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setBookingHistory([]);
    localStorage.removeItem('currentUser');
    navigate('booking');
  };
  
  const handleRebook = (booking: Booking) => {
    setRebookData(booking);
    navigate('booking');
  };

  const handleBookNow = (ride: CabResult | BusResult) => {
    if (!currentUser) {
        // We'll let the component handle the alert/redirect logic
        navigate('login');
        return;
    }
    setBookingToConfirm(ride);
  };

  const handleConfirmBooking = () => {
    if (!bookingToConfirm || !currentUser) return;

    const newBooking: Booking = {
      id: `h${bookingHistory.length + 1}-${Date.now()}`,
      serviceType: 'fare' in bookingToConfirm ? 'cab' : 'bus',
      origin: (document.getElementById('origin') as HTMLInputElement)?.value || 'Unknown',
      destination: (document.getElementById('destination') as HTMLInputElement)?.value || 'Unknown',
      date: (document.getElementById('date') as HTMLInputElement)?.value || new Date().toISOString().split('T')[0],
      fare: 'fare' in bookingToConfirm ? bookingToConfirm.fare : bookingToConfirm.price,
      details: 'fare' in bookingToConfirm 
            ? `${bookingToConfirm.carModel} (${bookingToConfirm.vehicleNumber})` 
            : bookingToConfirm.operator,
      status: 'upcoming',
    };

    setBookingHistory(prev => [newBooking, ...prev]);
    setLastBooking(newBooking);
    setBookingToConfirm(null);
    setShowSuccessMessage(true);
    navigate('ticket');
  };

  const handleUpdateProfilePic = (imageDataUrl: string) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, profilePic: imageDataUrl };
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  const handleUpdateProfile = (updatedData: { name: string; phone?: string }) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updatedData };
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage onLogin={handleLogin} navigate={navigate} />;
      case 'signup':
        return <SignupPage onProceedToOtp={handleProceedToOtp} navigate={navigate} />;
      case 'otp':
        return pendingUser && <OtpPage userEmail={pendingUser.email} onVerify={handleOtpVerification} />;
      case 'verification-success':
        return <VerificationSuccessPage navigate={navigate} />;
      case 'profile':
        return currentUser && <ProfilePage user={currentUser} onLogout={handleLogout} navigate={navigate} onUpdateProfilePic={handleUpdateProfilePic} onUpdateProfile={handleUpdateProfile} />;
      case 'bookings':
        return <BookingHistoryPage bookings={bookingHistory} onRebook={handleRebook} navigate={navigate} />;
      case 'ticket':
        return lastBooking && currentUser && <BookingTicketPage booking={lastBooking} user={currentUser} navigate={navigate} />;
      case 'booking':
      default:
        return <BookingInterface 
                  initialBookingData={rebookData} 
                  clearInitialBookingData={() => setRebookData(null)}
                  onBookNow={handleBookNow}
                  currentUser={currentUser}
                  showSuccessMessage={showSuccessMessage}
                  clearSuccessMessage={() => setShowSuccessMessage(false)}
                />;
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1 onClick={() => navigate('booking')} style={{ cursor: 'pointer' }}>TravelSwift</h1>
        <div className="header-actions">
          {currentUser ? (
            <button onClick={() => navigate('profile')} className="profile-btn" aria-label="View Profile">
              {currentUser.profilePic ? (
                <img src={currentUser.profilePic} alt="User profile" className="header-profile-pic" />
              ) : (
                <UserIcon />
              )}
            </button>
          ) : (
            <div className="auth-buttons">
              <button onClick={() => navigate('login')} className="auth-btn login-btn">Login</button>
              <button onClick={() => navigate('signup')} className="auth-btn signup-btn">Sign Up</button>
            </div>
          )}
          <ThemeSwitcher theme={theme} toggleTheme={toggleTheme} />
        </div>
      </header>
      <main>
        {renderPage()}
      </main>
      {bookingToConfirm && currentUser && (
        <BookingConfirmationPage 
            user={currentUser}
            bookingDetails={bookingToConfirm}
            onConfirm={handleConfirmBooking}
            onCancel={() => setBookingToConfirm(null)}
        />
      )}
    </div>
  );
};

export default App;