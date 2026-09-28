export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export type SupplyShortageStatus = 'normal' | 'regional_shortage' | 'critical_shortage';

export interface GenericAlternative {
  id: string;
  name: string;
  genericName: string;
  manufacturer: string;
  strength: string;
  averagePrice: number;
  savingsPercentage: number;
  fdaEquivalentCode: string; // e.g., 'AB' rated bioequivalent
  inStockCount: number;
}

export interface Medicine {
  id: string;
  brandName: string;
  genericName: string;
  category: 'Antibiotics' | 'Respiratory' | 'Diabetes' | 'Cardiovascular' | 'Pain Relief' | 'Mental Health' | 'Gastrointestinal';
  availableStrengths: string[];
  defaultStrength: string;
  forms: string[];
  defaultForm: string;
  requiresPrescription: boolean;
  controlledSubstanceSchedule?: string; // e.g. "Schedule IV"
  description: string;
  primaryIndications: string[];
  shortageStatus: SupplyShortageStatus;
  shortageNotes?: string;
  storageInstructions: string;
  genericAlternatives: GenericAlternative[];
  interactionWarnings: string[];
}

export interface Pharmacy {
  id: string;
  name: string;
  chainOrIndependent: 'independent' | 'chain' | 'hospital';
  address: string;
  city: string;
  postalCode: string;
  distanceMiles: number;
  phone: string;
  hoursDescription: string;
  isOpen24Hours: boolean;
  isOpenNow: boolean;
  closesAt: string;
  hasDriveThru: boolean;
  hasHomeDelivery: boolean;
  deliveryEstimatedMins?: number;
  hasColdStorageCert: boolean; // insulin / biologics
  wheelchairAccessible: boolean;
  rating: number;
  reviewCount: number;
  coordinates: {
    lat: number;
    lng: number;
    mapXPercent: number; // For clean interactive SVG map representation (0 to 100)
    mapYPercent: number;
  };
}

export interface PharmacyStockItem {
  pharmacyId: string;
  medicineId: string;
  strength: string;
  form: string;
  status: StockStatus;
  unitsAvailable: number;
  price: number;
  insuranceCopayEstimate?: number;
  genericEquivalentPrice?: number;
  lastVerifiedMinutesAgo: number;
  batchExpiryMonthYear: string;
}

export interface ReservationHold {
  id: string;
  voucherCode: string;
  medicineId: string;
  medicineName: string;
  strength: string;
  quantity: number;
  pharmacyId: string;
  pharmacyName: string;
  pharmacyAddress: string;
  patientName: string;
  patientPhone: string;
  reservedAt: string; // ISO
  expiresAt: string; // ISO (typically 3 hours later)
  status: 'active' | 'picked_up' | 'cancelled' | 'expired';
  requiresPrescription: boolean;
  totalPrice: number;
}

export interface StockAlertSubscription {
  id: string;
  medicineId: string;
  medicineName: string;
  strength: string;
  contactMethod: 'sms' | 'email';
  contactValue: string;
  maxDistanceMiles: number;
  createdAt: string;
}

export interface ScannedMedicineItem {
  detectedName: string;
  matchedMedicineId: string | null;
  detectedStrength: string;
  instructions: string;
  quantityPrescribed: string;
  isAvailableNearby: boolean;
}
