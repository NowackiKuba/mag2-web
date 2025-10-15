import { AllegroOffer } from './allegro';
export enum IntegrationPlatform {
  ALLEGRO = 'ALLEGRO',
  ERLI = 'ERLI',
  VINTED = 'VINTED',
  DPD = 'DPD',
  INPOST = 'INPOST',
  FAKTUROWO = 'FAKTUROWO',
  EMPIK = 'EMPIK',
}

export enum AutomationAction {
  SEND_UPSELL_MESSAGE = 'SEND_UPSELL_MESSAGE',
  SEND_PAYMENT_REMINDER_MESSAGE = 'SEND_PAYMENT_REMINDER_MESSAGE',
  GENERATE_INVOICE = 'GENERATE_INVOICE',
  CONNECT_INVOICE = 'CONNECT_INVOICE',
  UPDATE_ORDER_TRACKING_STATUS = 'UPDATE_ORDER_TRACKING_STATUS',
  AUTORESPONDER = 'AUTORESPONDER',
}

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  integrations: Integration[];
  userBusinessData: UserBusinessData[];
  automations: Automation[];
}

export interface Integration {
  id: string;
  name: string;
  slug: string;
  platform: IntegrationPlatform;
  accessToken?: string;
  refreshToken?: string;
  apiKey?: string;
  scope?: string;
  userId: string;
  expiresAt: Date;
  isActive: boolean;
  user: User;
  createdAt: Date;
  updatedAt: Date;
  automations: Automation[];
}

export interface UserBusinessData {
  id: string;
  companyName: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  houseNumber: string;
  street: string;
  nipNumber: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
}

export interface Automation {
  id: string;
  userId: string;
  user: User;
  action: AutomationAction;
  integrationId: string;
  integration: Integration;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  logs: AutomationLog[];
}

export interface AutomationLog {
  id: string;
  automationId: string;
  automation: Automation;
  success: boolean;
  failedAt?: Date;
  errorMessage?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Allegro Types

export interface FakturowoInvoice {
  apiNumber: string;
  docType: string;
  docNumber: string;
  createdAt: string;
  soldAt: string;
  currency: string;
  netValue: number;
  vatValue: number;
  grossValue: number;
  sellerName: string;
  sellerAddress: string;
  sellerNip: string;
  buyerName: string;
  buyerAddress: string;
  buyerNip: string;
  status: string;
  payment: string;
  paymentDue: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  category?: string;
  userId: string;
  ean: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
  primaryImageUrl: string;
  externalErliId: string;
  externalAllegroId: string;
  costHistory: ProductCostHistory[];
  details?: AllegroOffer;
  source: ProductSource;
}

export enum ProductSource {
  ALLEGRO = 'ALLEGRO',
  ERLI = 'ERLI',
  EMPIK = 'EMPIK',
}

export interface ProductCostHistory {
  id: string;
  ean: string;
  name: string;
  quantity: number;
  unitCost: number;
  unitPrice: number;
  purchasedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  currency: string;
  notes?: string;
}

interface Amount {
  amount: string;
  currency: string;
}

interface Address {
  street: string;
  city: string;
  postCode?: string;
  zipCode?: string;
  countryCode: string;
  companyName?: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  company?: {
    name: string;
    ids: Array<{
      type: string;
      value: string;
    }>;
    taxId: string;
  };
}

interface Buyer {
  id: string;
  email: string;
  login: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  guest: boolean;
  phoneNumber?: string;
  address: Address;
}

interface Payment {
  id: string;
  type: string;
  provider: string;
  finishedAt: string;
  paidAmount: Amount;
  reconciliation: Amount;
  features: string[];
}

interface DeliveryMethod {
  name: string;
}

interface PickupPoint {
  name: string;
  description: string;
  address: Address;
}

interface DeliveryTime {
  from: string;
  to: string;
  guaranteed?: {
    from: string;
    to: string;
  };
  dispatch?: {
    from: string;
    to: string;
  };
}

interface Delivery {
  address: Address;
  method: DeliveryMethod;
  pickupPoint?: PickupPoint;
  cost: Amount;
  time: DeliveryTime;
  smart: boolean;
  calculatedNumberOfPackages: number;
}

interface OrdProduct {
  id: string;
  quantity: number;
}

interface Offer {
  id: string;
  name: string;
  external?: {
    id: string;
  };
  productSet?: {
    products: OrdProduct[];
  };
}

export interface Item {
  id: string;
  offer: Offer;
  quantity: number;
  originalPrice: Amount;
  price: Amount;
  reconciliation: {
    value: Amount;
    type: string;
    quantity: number;
  };
  //   selectedAdditionalServices?: AdditionalService[];
  //   vouchers?: Voucher[];
  //   tax?: Tax;
  boughtAt: string;
}

// interface Discount {
//   type: string;
// }

// interface Note {
//   text: string;
// }

// interface Marketplace {
//   id: string;
// }

interface Summary {
  totalToPay: Amount;
}
export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  currency: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  status: OrderStatus;
  paymentStatus?: string;
  paymentProvider: string;
  paymentId: string;
  paymentDate: Date;
  freeDelivery: boolean;
  delivery: {
    isFree: boolean;
    total: number;
    method: string;
  };
  totalAmount: number;
  currency: string;
  invoice: boolean;
  invoiceData?: {
    firstName: string;
    lastName: string;
    companyName: string;
    address: string;
    city: string;
    postalCode: string;
    nip: string;
  };
  buyer: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
  };
}

export enum OrderStatus {
  NEW = 'NEW',
  PROCESSING = 'PROCESSING',
  READY_FOR_SHIPMENT = 'READY_FOR_SHIPMENT',
  READY_FOR_PICKUP = 'READY_FOR_PICKUP',
  SENT = 'SENT',
  PICKED_UP = 'PICKED_UP',
  CANCELLED = 'CANCELLED',
  SUSPENDED = 'SUSPENDED',
  RETURNED = 'RETURNED',
}
