import React, { useState, useEffect, useRef } from 'react';
import type { User, CabResult, BusResult } from '../types';
import { UserIcon, LocationIcon, CreditCardIcon, UpiIcon, QrCodeIcon } from '../components/icons/Icons';

interface BookingConfirmationPageProps {
  user: User;
  bookingDetails: CabResult | BusResult;
  onConfirm: () => void;
  onCancel: () => void;
}

interface QrScannerProps {
    onScanSuccess: () => void;
    onCancel: () => void;
}

const QrScanner: React.FC<QrScannerProps> = ({ onScanSuccess, onCancel }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        let stream: MediaStream | null = null;
        const startCamera = async () => {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                try {
                    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                } catch (err) {
                    console.error("Error accessing camera: ", err);
                    alert("Could not access the camera. Please ensure you have given camera permissions and are using a secure connection (HTTPS).");
                    onCancel();
                }
            } else {
                 alert("Your browser does not support camera access.");
                 onCancel();
            }
        };

        startCamera();

        return () => {
            // Stop the camera stream when component unmounts
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [onCancel]);
    
    // In a real application, a library like 'html5-qrcode' would be used here
    // to continuously scan the video stream for a QR code.
    // For this demo, we'll use a button to simulate a successful scan.
    const handleSimulateScan = () => {
        onScanSuccess();
    };

    return (
        <div className="qr-scanner-container">
            <div className="qr-scanner-viewfinder">
                <video ref={videoRef} className="qr-scanner-video" playsInline autoPlay muted />
                <div className="qr-scanner-overlay">
                    <div className="qr-scanner-box"></div>
                    <p>Position the QR code inside the box</p>
                </div>
            </div>
            <div className="qr-scanner-actions">
                <button onClick={handleSimulateScan} className="simulate-scan-btn">Simulate Scan</button>
                <button onClick={onCancel} className="cancel-scan-btn">Cancel</button>
            </div>
        </div>
    );
};


const BookingConfirmationPage: React.FC<BookingConfirmationPageProps> = ({ user, bookingDetails, onConfirm, onCancel }) => {
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [onlinePaymentSubMethod, setOnlinePaymentSubMethod] = useState('upi');
  const [isScanning, setIsScanning] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const fare = 'fare' in bookingDetails ? bookingDetails.fare : bookingDetails.price;
  const isCab = 'fare' in bookingDetails;
  
  const handleScanSuccess = () => {
    setIsScanning(false);
    onConfirm();
  };
  
  const handleUpiPay = () => {
    setIsProcessingPayment(true);
    setPaymentError(null);

    // In a real app, this would redirect to a UPI app.
    // Here, we'll simulate a network delay and potential failure.
    setTimeout(() => {
      // 20% chance of failure for demonstration
      if (Math.random() < 0.2) {
        setPaymentError('Payment failed due to a network issue. Please try again.');
        setIsProcessingPayment(false);
      } else {
        onConfirm();
      }
    }, 2000);
  };

  return (
    <div className="booking-confirmation-overlay" role="dialog" aria-modal="true" aria-labelledby="confirmation-title">
      <div className="booking-confirmation-modal">
        <h2 id="confirmation-title">Confirm Your Booking</h2>
        
        <div className="summary-section">
          <h3><LocationIcon /> Ride Details</h3>
          {isCab ? (
            <>
              <p><span>Vehicle</span> <span>{bookingDetails.carModel}</span></p>
              <p><span>Vehicle No.</span> <span>{bookingDetails.vehicleNumber}</span></p>
              <p><span>Driver</span> <span>{bookingDetails.driverName}</span></p>
              <p><span>Rating</span> <span>{bookingDetails.rating.toFixed(1)} ★</span></p>
            </>
          ) : (
             <>
              <p><span>Operator</span> <span>{bookingDetails.operator}</span></p>
              <p><span>Bus Type</span> <span>{bookingDetails.busType}</span></p>
              <p><span>Timings</span> <span>{bookingDetails.departureTime} - {bookingDetails.arrivalTime}</span></p>
            </>
          )}
           <p className="total-fare"><span>Total Fare</span> <span>₹{fare.toFixed(0)}</span></p>
        </div>

        <div className="summary-section">
          <h3><UserIcon /> Your Information</h3>
          <p><span>Name</span> <span>{user.name}</span></p>
          <p><span>Email</span> <span>{user.email}</span></p>
          <p><span>Phone</span> <span>{user.phone || 'N/A'}</span></p>
        </div>

        <div className="summary-section">
            <h3><CreditCardIcon /> Payment Method</h3>
            <div className="payment-options">
                <button 
                    className={`payment-method-btn ${paymentMethod === 'online' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('online')}
                    aria-pressed={paymentMethod === 'online'}
                    disabled={isProcessingPayment}
                >
                    Online Payment
                </button>
                 <button 
                    className={`payment-method-btn ${paymentMethod === 'cash' ? 'active' : ''}`}
                    onClick={onConfirm}
                    aria-pressed={paymentMethod === 'cash'}
                    disabled={isProcessingPayment}
                >
                    Cash
                </button>
            </div>
            {paymentMethod === 'online' && (
                <div className="online-payment-details">
                    <h4>Select Method</h4>
                    <div className="payment-options sub-options">
                        <div className="payment-option">
                            <input
                                type="radio"
                                id="payment-upi"
                                name="online-payment-sub"
                                value="upi"
                                checked={onlinePaymentSubMethod === 'upi'}
                                onChange={() => setOnlinePaymentSubMethod('upi')}
                                disabled={isProcessingPayment}
                            />
                            <label htmlFor="payment-upi"><UpiIcon /> UPI</label>
                        </div>
                        <div className="payment-option">
                             <input
                                type="radio"
                                id="payment-qr"
                                name="online-payment-sub"
                                value="qr"
                                checked={onlinePaymentSubMethod === 'qr'}
                                onChange={() => setOnlinePaymentSubMethod('qr')}
                                disabled={isProcessingPayment}
                            />
                            <label htmlFor="payment-qr"><QrCodeIcon /> Scan QR</label>
                        </div>
                    </div>

                    {paymentError && <div className="error-message" style={{marginTop: '1.5rem'}}>{paymentError}</div>}

                    {onlinePaymentSubMethod === 'qr' && (
                        <div className="qr-scan-wrapper">
                            {!isScanning ? (
                                <>
                                    <p className="qr-scan-info">Ready to pay? Scan the QR code provided by your driver to confirm your booking instantly.</p>
                                    <button onClick={() => setIsScanning(true)} className="start-scan-btn" disabled={isProcessingPayment}>
                                        <QrCodeIcon /> Start Camera Scan
                                    </button>
                                </>
                            ) : (
                                <QrScanner onScanSuccess={handleScanSuccess} onCancel={() => setIsScanning(false)} />
                            )}
                        </div>
                    )}
                    
                    {onlinePaymentSubMethod === 'upi' && (
                        <div className="upi-details">
                            <p>You will be redirected to your UPI app to complete the payment.</p>
                            <button className="upi-pay-btn" onClick={handleUpiPay} disabled={isProcessingPayment}>
                                <UpiIcon/> {isProcessingPayment ? 'Processing...' : 'Pay with UPI'}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>

        <div className="confirmation-actions">
          <button onClick={onCancel} className="cancel-btn" disabled={isProcessingPayment}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;
