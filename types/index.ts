export type UserRole = "employee" | "admin";

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  homeAddress?: Address;
  hasCompletedOnboarding: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  formattedAddress: string;
}

export type ScheduleStatus = "pending" | "approved" | "rejected";
export type LocationType = "home" | "office";
export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface ScheduleSlot {
  day: DayOfWeek;
  pickupTime: string;
  dropTime: string;
  pickupLocation: LocationType;
  dropLocation: LocationType;
}

export interface WeeklySchedule {
  id: string;
  userId: string;
  weekStart: Date;
  weekEnd: Date;
  slots: ScheduleSlot[];
  status: ScheduleStatus;
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface ChangeRequest {
  id: string;
  userId: string;
  scheduleId: string;
  requestedDate: Date;
  changes: {
    field: "address" | "time";
    oldValue: string;
    newValue: string;
  }[];
  status: ScheduleStatus;
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
}

export interface Trip {
  id: string;
  userId: string;
  scheduleId: string;
  date: Date;
  driverName: string;
  driverPhone: string;
  vehicleNumber: string;
  pickupLocation: Address;
  dropLocation: Address;
  estimatedPickupTime: Date;
  actualPickupTime?: Date;
  actualDropTime?: Date;
  status: "scheduled" | "en_route" | "picked_up" | "completed" | "cancelled";
  qrCode?: string;
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
  rating?: number;
  feedback?: string;
}

export interface DashboardStats {
  totalScheduledTrips: number;
  completedTrips: number;
  missedPickups: number;
  averageRating: number;
  pendingApprovals: number;
}
