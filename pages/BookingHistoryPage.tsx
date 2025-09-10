import React from 'react';
import type { Booking } from '../types';
import { HistoryIcon, CabIcon, BusIcon } from '../components/icons/Icons';

interface BookingHistoryPageProps {
  bookings: Booking[];
  onRebook: (booking: Booking) => void;
  navigate: (page: 'profile' | 'booking') => void;
}

const BookingCard: React.FC<{ booking: Booking; onRebook: (booking: Booking) => void }> = ({ booking, onRebook }) => (
    <div className="history-card">
        <div className="history-card-header">
            <span className="icon">
                {booking.serviceType === 'cab' ? <CabIcon /> : <BusIcon />}
            </span>
            <h3>{booking.origin} &rarr; {booking.destination}</h3>
            <div className="header-meta">
              <span className="date">{booking.date}</span>
              <span className={`status-badge status-${booking.status}`}>
                {booking.status}
              </span>
            </div>
        </div>
      <div className="history-card-body">
        <p><strong>Service:</strong> {booking.serviceType === 'cab' ? 'Cab' : 'Bus'}</p>
        <p><strong>Details:</strong> {booking.details}</p>
        <p><strong>Fare:</strong> ₹{booking.fare.toFixed(0)}</p>
      </div>
      <div className="history-card-footer">
        <button onClick={() => onRebook(booking)} className="rebook-btn">
          Book Again
        </button>
      </div>
    </div>
);


const BookingHistoryPage: React.FC<BookingHistoryPageProps> = ({ bookings, onRebook, navigate }) => {
  const upcomingBookings = bookings
    .filter(b => b.status === 'upcoming')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const completedBookings = bookings
    .filter(b => b.status === 'completed')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="booking-history-page">
      <a onClick={() => navigate('profile')} className="back-link" role="button">&larr; Back to Profile</a>
      <h2>
        <HistoryIcon />
        My Bookings
      </h2>
      
      {bookings.length === 0 ? (
        <div className="results-placeholder">You have no past bookings.</div>
      ) : (
        <div className="history-list-container">
          {upcomingBookings.length > 0 && (
            <section className="booking-group">
              <h3 className="booking-group-header">Upcoming</h3>
              {upcomingBookings.map(booking => (
                <BookingCard key={booking.id} booking={booking} onRebook={onRebook} />
              ))}
            </section>
          )}
          {completedBookings.length > 0 && (
             <section className="booking-group">
                <h3 className="booking-group-header">Completed</h3>
                {completedBookings.map(booking => (
                  <BookingCard key={booking.id} booking={booking} onRebook={onRebook} />
                ))}
             </section>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingHistoryPage;