import React, { useState } from 'react';
import type { Booking, User } from '../types';
import { CheckCircleIcon, HistoryIcon, QrCodeIcon, DownloadIcon } from '../components/icons/Icons';

interface BookingTicketPageProps {
  booking: Booking;
  user: User;
  navigate: (page: 'bookings' | 'booking') => void;
}

const BookingTicketPage: React.FC<BookingTicketPageProps> = ({ booking, user, navigate }) => {
  const [downloadStatus, setDownloadStatus] = useState<string>('Download Ticket');

  const handleDownload = () => {
    setDownloadStatus('Downloading...');
    setTimeout(() => {
      setDownloadStatus('Downloaded!');
      setTimeout(() => {
        setDownloadStatus('Download Ticket');
      }, 2000);
    }, 1500);
  };
  
  const buttonClass = `action-btn download-btn ${
    downloadStatus === 'Downloaded!' ? 'downloaded' : ''
  }`;

  return (
    <div className="booking-ticket-page">
        <div className="ticket-header">
            <div className="success-icon">
                <CheckCircleIcon />
            </div>
            <h2>Booking Confirmed!</h2>
            <p>Your e-ticket has been generated for {user.name.split(' ')[0]}.</p>
        </div>

        <div className="ticket-qr-code">
            <QrCodeIcon />
            <p>Show this code to the driver or staff.</p>
        </div>

        <div className="ticket-details">
            <h3>Ride Summary</h3>
            <p><strong>Booking ID:</strong> <span>{booking.id}</span></p>
            <p><strong>Passenger:</strong> <span>{user.name}</span></p>
            <p><strong>From:</strong> <span>{booking.origin}</span></p>
            <p><strong>To:</strong> <span>{booking.destination}</span></p>
            <p><strong>Date:</strong> <span>{booking.date}</span></p>
            <p><strong>Details:</strong> <span>{booking.details}</span></p>
            <p><strong>Total Fare:</strong> <span>₹{booking.fare.toFixed(0)}</span></p>
        </div>

        <div className="ticket-actions profile-actions">
            <button onClick={() => navigate('bookings')} className="action-btn">
                <HistoryIcon />
                Go to My Bookings
            </button>
            <button 
                onClick={handleDownload} 
                className={buttonClass}
                disabled={downloadStatus !== 'Download Ticket'}
            >
                <DownloadIcon />
                {downloadStatus}
            </button>
            <button onClick={() => navigate('booking')} className="form-btn">
                Book Another Ride
            </button>
        </div>
    </div>
  );
};

export default BookingTicketPage;
