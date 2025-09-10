export type ServiceType = 'cab' | 'bus';

export interface CabResult {
  id: string;
  driverName: string;
  carModel: string;
  vehicleNumber: string;
  eta: number; // in minutes
  fare: number;
  rating: number;
}

export interface BusResult {
  id: string;
  operator: string;
  busType: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  seatsAvailable: number;
}

export interface User {
  name: string;
  email: string;
  phone?: string;
  profilePic?: string;
}

export interface Booking {
  id:string;
  serviceType: ServiceType;
  origin: string;
  destination: string;
  date: string;
  fare: number;
  details: string; // e.g., 'Maruti Dzire' or 'City Transit'
  status: 'upcoming' | 'completed';
}