import { ObjectId } from "mongodb";

export interface Receipt {
  _id?: ObjectId;
  licensePlate: string;
  date: string;
  time: string;
  fuelType: string;
  amount: number;
  price: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
} 