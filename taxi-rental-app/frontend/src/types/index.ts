// src/types/index.ts
export type User = {
  name: string;
  email?: string;
  userType: 'client' | 'manager' | 'driver';
  ssn?: string;
};

export type Car = {
  car_id: number;
  brand: string;
};

export type Model = {
  model_id: number;
  car_id: number;
  color: string;
  construction_year: number;
  transmission_type: 'manual' | 'automatic';
};

export type Driver = {
  driver_id: number;
  name: string;
  address_id: number;
};

export type Client = {
  client_id: number;
  name: string;
  email: string;
};

export type ClientAddress = {
  client_id: number;
  address_id: number;
};

export type DriverModel = {
  driver_id: number;
  model_id: number;
};

export type Rent = {
  rent_id: number;
  date: string;
  client_id: number;
  driver_id: number;
  model_id: number;
};

export type Address = {
  address_id: number;
  road_name: string;
  number: number;
  city: string;
};

export type CreditCard = {
  card_number: string;
  client_id: number;
  payment_address_id: number;
};

export type Review = {
  review_id: number;
  driver_id: number;
  client_id: number;
  rating: number;
  message: string;
};