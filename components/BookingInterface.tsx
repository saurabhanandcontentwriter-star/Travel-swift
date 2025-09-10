import React, { useState, useEffect } from 'react';
import type { ServiceType, CabResult, BusResult, Booking, User } from '../types';
import { CabIcon, BusIcon, CalendarIcon, ClockIcon, LocationIcon, StarIcon, CheckCircleIcon } from './icons/Icons';
import BiharMap from './icons/BiharMap';

interface BookingInterfaceProps {
    initialBookingData?: Booking | null;
    clearInitialBookingData?: () => void;
    initialServiceType?: ServiceType | null;
    clearInitialServiceType?: () => void;
    onBookNow: (ride: CabResult | BusResult) => void;
    currentUser: User | null;
    showSuccessMessage?: boolean;
    clearSuccessMessage?: () => void;
}

const BookingInterface: React.FC<BookingInterfaceProps> = ({ 
    initialBookingData, 
    clearInitialBookingData, 
    initialServiceType,
    clearInitialServiceType,
    onBookNow, 
    currentUser,
    showSuccessMessage,
    clearSuccessMessage
}) => {
  const [serviceType, setServiceType] = useState<ServiceType>('cab');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('10:00');
  const [busType, setBusType] = useState('any');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<(CabResult | BusResult)[]>([]);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialBookingData && clearInitialBookingData) {
      setServiceType(initialBookingData.serviceType);
      setOrigin(initialBookingData.origin);
      setDestination(initialBookingData.destination);
      setDate(new Date().toISOString().split('T')[0]); // Reset date to today
      setSearched(false);
      setResults([]);
      setError(null);
      document.querySelector('.app')?.scrollIntoView({ behavior: 'smooth' });
      clearInitialBookingData();
    } else if (initialServiceType && clearInitialServiceType) {
        setServiceType(initialServiceType);
        document.querySelector('.app')?.scrollIntoView({ behavior: 'smooth' });
        clearInitialServiceType();
    }
  }, [initialBookingData, clearInitialBookingData, initialServiceType, clearInitialServiceType]);

  useEffect(() => {
    if (showSuccessMessage && clearSuccessMessage) {
        const timer = setTimeout(() => {
            clearSuccessMessage();
        }, 5000); // Auto-dismiss after 5 seconds

        return () => clearTimeout(timer);
    }
  }, [showSuccessMessage, clearSuccessMessage]);


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin || !destination || !date) return;

    setLoading(true);
    setSearched(true);
    setResults([]);
    setError(null);

    // Simulate API call
    setTimeout(() => {
      try {
        // To test, type "fail" as the origin to trigger an error.
        if (origin.toLowerCase() === 'fail') {
          throw new Error('Could not connect to the server. Please try again later.');
        }

        if (serviceType === 'cab') {
          const mockCabResults: CabResult[] = [
            { id: 'c1', driverName: 'Rajesh Kumar', carModel: 'Maruti Dzire', vehicleNumber: 'BR01AB1234', eta: 5, fare: 450, rating: 4.8 },
            { id: 'c2', driverName: 'Priya Sharma', carModel: 'Honda Amaze', vehicleNumber: 'DL02CD5678', eta: 8, fare: 550, rating: 4.9 },
            { id: 'c3', driverName: 'Amit Singh', carModel: 'Hyundai Verna', vehicleNumber: 'MH03EF9012', eta: 3, fare: 700, rating: 5.0 },
          ];
          setResults(mockCabResults);
        } else {
          const mockBusResults: BusResult[] = [
            { id: 'b1', operator: 'City Transit', busType: 'AC Seater', departureTime: '09:00 AM', arrivalTime: '10:30 AM', price: 550, seatsAvailable: 12 },
            { id: 'b2', operator: 'Metro Connect', busType: 'Non-AC Seater', departureTime: '09:30 AM', arrivalTime: '11:00 AM', price: 400, seatsAvailable: 5 },
            { id: 'b3', operator: 'Swift Travels', busType: 'AC Sleeper', departureTime: '10:00 PM', arrivalTime: '05:30 AM', price: 850, seatsAvailable: 20 },
          ];
          
          let filteredBuses = mockBusResults;
          if (busType !== 'any') {
              if (busType === 'non-ac') {
                   filteredBuses = mockBusResults.filter(bus => 
                      !bus.busType.toLowerCase().includes('ac')
                  );
              } else {
                   filteredBuses = mockBusResults.filter(bus => 
                      bus.busType.toLowerCase().includes(busType)
                  );
              }
          }
          setResults(filteredBuses);
        }
      } catch (e: any) {
        setError(e.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    }, 1500);
  };

  const handleBookClick = (result: CabResult | BusResult) => {
    if (!currentUser) {
      // The parent component will handle navigation to login
    }
    onBookNow(result);
  };

  const renderResults = () => {
    if (error) {
      return <div className="results-placeholder error-message">{error}</div>;
    }

    if (loading) {
      return <div className="loader">Searching for rides...</div>;
    }

    if (!searched) {
        return (
            <div className="results-placeholder">
                <BiharMap />
                Find your perfect ride across Bihar.
            </div>
        );
    }

    if (results.length === 0) {
      return <div className="results-placeholder">No rides found for your search.</div>;
    }

    return (
      <div className="results-list">
        {results.map(result => {
          if ('fare' in result) { // It's a CabResult
            return (
              <div key={result.id} className="result-card" role="listitem">
                <div className="result-info">
                   <div className="icon"><CabIcon /></div>
                   <div className="result-details">
                       <p className="name">{result.carModel}</p>
                       <div className="meta">
                         <span>{result.driverName}</span>
                         <span className="rating">
                           <StarIcon /> {result.rating.toFixed(1)}
                         </span>
                         <span>&bull;</span>
                         <span>{result.eta} mins away</span>
                       </div>
                   </div>
                </div>
                <div className="result-booking">
                    <p className="price">₹{result.fare.toFixed(0)}</p>
                    <button className="book-btn" onClick={() => handleBookClick(result)}>Book Now</button>
                </div>
              </div>
            );
          } else { // It's a BusResult
            return (
              <div key={result.id} className="result-card" role="listitem">
                <div className="result-info">
                   <div className="icon"><BusIcon /></div>
                   <div className="result-details">
                       <p className="name">{result.operator}</p>
                       <div className="meta">
                          <span>{result.busType}</span>
                          <span>&bull;</span>
                          <span>{result.departureTime} - {result.arrivalTime}</span>
                         <span>&bull;</span>
                          <span>{result.seatsAvailable} seats left</span>
                       </div>
                   </div>
                </div>
                <div className="result-booking">
                    <p className="price">₹{result.price.toFixed(0)}</p>
                    <button className="book-btn" onClick={() => handleBookClick(result)}>Book Seat</button>
                </div>
              </div>
            );
          }
        })}
      </div>
    );
  };

  return (
    <>
      <div className="booking-interface">
        <div className="tabs" role="tablist">
          <button 
            id="cab-tab"
            className={`tab ${serviceType === 'cab' ? 'active' : ''}`}
            onClick={() => setServiceType('cab')}
            role="tab"
            aria-selected={serviceType === 'cab'}
            aria-controls="booking-form"
          >
            <CabIcon /> Book a Cab
          </button>
          <button
            id="bus-tab"
            className={`tab ${serviceType === 'bus' ? 'active' : ''}`}
            onClick={() => setServiceType('bus')}
            role="tab"
            aria-selected={serviceType === 'bus'}
            aria-controls="booking-form"
          >
            <BusIcon /> Book a Bus
          </button>
        </div>

        {showSuccessMessage && clearSuccessMessage && (
            <div className="success-message" role="alert">
                <div className="success-message-icon">
                    <CheckCircleIcon />
                </div>
                <span>Booking successful! Your e-ticket has been generated.</span>
                <button onClick={clearSuccessMessage} className="close-btn" aria-label="Dismiss">&times;</button>
            </div>
        )}

        <form id="booking-form" onSubmit={handleSearch} role="tabpanel" aria-labelledby={`${serviceType}-tab`}>
          <div className="form-group">
            <label htmlFor="origin">From</label>
            <div className="input-wrapper">
                <span className="icon"><LocationIcon /></span>
                <input
                  type="text"
                  id="origin"
                  value={origin}
                  onChange={e => setOrigin(e.target.value)}
                  placeholder="Enter origin (or 'fail' to test error)"
                  required
                />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="destination">To</label>
             <div className="input-wrapper">
                <span className="icon"><LocationIcon /></span>
                <input
                  type="text"
                  id="destination"
                  value={destination}
                  onChange={e => setDestination(e.target.value)}
                  placeholder="Enter destination"
                  required
                />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="date">Date</label>
             <div className="input-wrapper">
                <span className="icon"><CalendarIcon /></span>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  required
                />
            </div>
          </div>
          {serviceType === 'cab' && (
            <div className="form-group">
              <label htmlFor="time">Time</label>
               <div className="input-wrapper">
                    <span className="icon"><ClockIcon /></span>
                    <input
                      type="time"
                      id="time"
                      value={time}
                      onChange={e => setTime(e.target.value)}
                      required
                    />
                </div>
            </div>
          )}
          {serviceType === 'bus' && (
            <div className="form-group">
                <label htmlFor="bus-type">Bus Type</label>
                <div className="input-wrapper">
                    <span className="icon"><BusIcon /></span>
                    <select id="bus-type" value={busType} onChange={e => setBusType(e.target.value)}>
                        <option value="any">Any</option>
                        <option value="seater">Seater</option>
                        <option value="sleeper">Sleeper</option>
                        <option value="ac">AC</option>
                        <option value="non-ac">Non-AC</option>
                    </select>
                </div>
            </div>
          )}
          <button type="submit" className="search-btn" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      <div className="results-container" aria-live="polite">
        {renderResults()}
      </div>
    </>
  );
};

export default BookingInterface;
