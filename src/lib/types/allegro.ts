export interface AllegroCategory {
  id: string;
  leaf: boolean;
  name: string;
  options: AllegroCategoryOptions;
  parent: AllegroCategoryParent;
}

export interface AllegroCategoryOptions {
  [key: string]: any;
}

export interface AllegroCategoryParent {
  id: string;
}

export interface AllegroProductOffer {
  id: string;
  productSet: Array<{
    quantity: {
      value: number;
    };
    product: {
      id: string;
      publication: {
        status: string;
      };
      parameters: Array<{
        id: string;
        name: string;
        rangeValue?: {
          from: string;
          to: string;
        };
        values?: string[];
        valuesIds?: string[];
      }>;
    };
    responsiblePerson?: {
      id: string;
    };
    responsibleProducer?: {
      id: string;
    };
    safetyInformation?: {
      type: string;
    };
    marketedBeforeGPSRObligation?: boolean;
  }>;
  category: {
    id: string;
  };
  attachments?: Array<{
    id: string;
  }>;
  fundraisingCampaign?: {
    id: string;
  };
  additionalServices?: {
    id: string;
  };
  delivery?: {
    handlingTime: string;
    shippingRates: {
      id: string;
    };
    additionalInfo?: string;
    shipmentDate?: string;
  };
  publication: {
    duration: string;
    startingAt: string;
    status: string;
    republish: boolean;
    endingAt: string;
    endedBy?: string;
    marketplaces: {
      base: {
        id: string;
      };
      additional?: Array<{
        id: string;
      }>;
    };
  };
  additionalMarketplaces?: {
    [key: string]: {
      sellingMode: {
        price: {
          amount: string;
          currency: string;
        };
      };
      publication: {
        state: string;
        refusalReasons?: Array<{
          code: string;
          userMessage: string;
          parameters: {
            [key: string]: string[];
          };
        }>;
      };
    };
  };
  b2b?: {
    buyableOnlyByBusiness: boolean;
  };
  compatibilityList?: {
    type: string;
  };
  language: string;
}

export interface AllegroThreadMessage {
  id: string;
  status: 'VERIFYING' | 'NEW' | 'READ';
  type: 'MESSAGE_CENTER';
  createdAt: string;
  thread: {
    id: string;
  };
  author: {
    login: string;
    isInterlocutor: boolean;
  };
  text: string;
  subject: string;
  relatesTo?: {
    offer?: {
      id: string;
    };
    order?: {
      id: string;
    };
  };
  hasAdditionalAttachments: boolean;
  attachments: AllegroThreadMessageAttachment[];
  additionalInformation?: {
    vin?: string;
  };
}

export interface AllegroThreadMessageAttachment {
  fileName: string;
  mimeType: string;
  url: string;
  status: 'NEW' | 'VERIFYING' | 'READ';
}

export interface AllegroCustomerReturnItem {
  offerId: string;
  quantity: number;
  name: string;
  price: {
    amount: string;
    currency: string;
  };
  url: string;
  reason: {
    type: string;
    userComment: string;
  };
}

export interface Amount {
  amount: string;
  currency: string;
}

export interface Payment {
  id: string;
  type: string;
  provider: string;
  finishedAt: string;
  paidAmount: Amount;
  reconciliation: Amount;
  features: string[];
}

export interface DeliveryMethod {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  quantity: number;
}

export interface Offer {
  id: string;
  name: string;
  external?: {
    id: string;
  };
  productSet?: {
    products: Product[];
  };
}

export interface AdditionalService {
  definitionId: string;
  name: string;
  price: Amount;
  quantity: number;
}

export interface Voucher {
  id: string;
  name: string;
  price: Amount;
}

export interface Tax {
  rate: string;
  amount: Amount;
}

export interface LineItem {
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
  selectedAdditionalServices?: AdditionalService[];
  vouchers?: Voucher[];
  tax?: Tax;
  boughtAt: string;
}

export interface Surcharge {
  id: string;
  type: string;
  provider: string;
  finishedAt: string;
  paidAmount: Amount;
  reconciliation: Amount;
  features: string[];
}

export interface CheckoutForm {
  id: string;
  messageToSeller?: string;
  buyer: {
    id: string;
    email: string;
    login: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
  };
  payment: Payment;
  status: OrderStatus;
  fulfillment: {
    status: string;
  };
  delivery: {
    method: DeliveryMethod;
    address: {
      firstName: string;
      lastName: string;
      street: string;
      city: string;
      zipCode: string;
      countryCode: string;
      phoneNumber?: string;
    };
    cost: Amount;
    timeGuaranteed?: string;
    smart?: boolean;
    point?: {
      id: string;
      name: string;
      description?: string;
      address: {
        street: string;
        zipCode: string;
        city: string;
      };
    };
  };
  lineItems: LineItem[];
  surcharges: Surcharge[];
  summary: {
    totalToPay: Amount;
  };
  updatedAt: string;
  revision: string;
}

export interface AllegroOrderResponse {
  checkoutForms: CheckoutForm[];
  count: number;
  totalCount: number;
  hasMore: boolean;
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

export interface AllegroProductOffer {
  id: string;
  productSet: Array<{
    quantity: {
      value: number;
    };
    product: {
      id: string;
      publication: {
        status: string;
      };
      parameters: Array<{
        id: string;
        name: string;
        rangeValue?: {
          from: string;
          to: string;
        };
        values?: string[];
        valuesIds?: string[];
      }>;
    };
    responsiblePerson?: {
      id: string;
    };
    responsibleProducer?: {
      id: string;
    };
    safetyInformation?: {
      type: string;
    };
    marketedBeforeGPSRObligation?: boolean;
  }>;
  category: {
    id: string;
  };
  attachments?: Array<{
    id: string;
  }>;
  fundraisingCampaign?: {
    id: string;
  };
  additionalServices?: {
    id: string;
  };
  delivery?: {
    handlingTime: string;
    shippingRates: {
      id: string;
    };
    additionalInfo?: string;
    shipmentDate?: string;
  };
  publication: {
    duration: string;
    startingAt: string;
    status: string;
    republish: boolean;
    endingAt: string;
    endedBy?: string;
    marketplaces: {
      base: {
        id: string;
      };
      additional?: Array<{
        id: string;
      }>;
    };
  };
  additionalMarketplaces?: {
    [key: string]: {
      sellingMode: {
        price: {
          amount: string;
          currency: string;
        };
      };
      publication: {
        state: string;
        refusalReasons?: Array<{
          code: string;
          userMessage: string;
          parameters: {
            [key: string]: string[];
          };
        }>;
      };
    };
  };
  b2b?: {
    buyableOnlyByBusiness: boolean;
  };
  compatibilityList?: {
    type: string;
  };
  language: string;
  validation?: {
    errors: Array<{
      code: string;
      details: string;
      message: string;
      path: string;
      userMessage: string;
      metadata?: {
        productId: string;
      };
    }>;
    warnings: Array<{
      code: string;
      details: string;
      message: string;
      path: string;
      userMessage: string;
      metadata?: {
        productId: string;
      };
    }>;
    validatedAt: string;
  };
  warnings?: any[];
  afterSalesServices?: {
    impliedWarranty?: {
      id: string;
    };
    returnPolicy?: {
      id: string;
    };
    warranty?: {
      id: string;
    };
  };
  discounts?: {
    wholesalePriceList?: {
      id: string;
    };
  };
  stock: {
    available: number;
    unit: string;
  };
  parameters?: Array<{
    id: string;
    name: string;
    rangeValue?: {
      from: string;
      to: string;
    };
    values?: string[];
    valuesIds?: string[];
  }>;
  contact?: {
    id: string;
  };
  createdAt: string;
  updatedAt: string;
  name: string;
  payments: {
    invoice: string;
  };
  sellingMode: {
    format: string;
    price: {
      amount: string;
      currency: string;
    };
    minimalPrice?: {
      amount: string;
      currency: string;
    };
    startingPrice?: {
      amount: string;
      currency: string;
    };
  };
  location: {
    city: string;
    countryCode: string;
    postCode: string;
    province: string;
  };
  images?: string[];
  description?: {
    sections: Array<{
      items: Array<{
        type: string;
        url?: string;
        content?: string;
      }>;
    }>;
  };
  external?: {
    id: string;
  };
  sizeTable?: {
    id: string;
  };
  taxSettings?: {
    rates: Array<{
      rate: string;
      countryCode: string;
    }>;
    subject: string;
    exemption: string;
  };
  messageToSellerSettings?: {
    mode: string;
    hint?: string;
  };
}

export interface AllegroProductOfferResponse {
  offers: AllegroProductOffer[];
  count: number;
  totalCount: number;
}

export interface AllegroOffer {
  id: string;
  name: string;
  category: {
    id: string;
  };
  primaryImage: {
    url: string;
  };
  sellingMode: {
    format: string;
    price: {
      amount: string;
      currency: string;
    };
    priceAutomation: {
      rule: {
        id: string;
        type: string;
      };
    };
    minimalPrice: {
      amount: string;
      currency: string;
    };
    startingPrice: {
      amount: string;
      currency: string;
    };
  };
  saleInfo: {
    currentPrice: {
      amount: string;
      currency: string;
    };
    biddersCount: number;
  };
  stock: {
    available: number;
    sold: number;
  };
  stats: {
    watchersCount: number;
    visitsCount: number;
  };
  publication: {
    status: string;
    startingAt: string;
    startedAt: string;
    endingAt: string;
    endedAt: string;
    marketplaces: {
      base: {
        id: string;
      };
      additional: Array<{
        id: string;
      }>;
    };
  };
  afterSalesServices: {
    impliedWarranty: {
      id: string;
    };
    returnPolicy: {
      id: string;
    };
    warranty: {
      id: string;
    };
  };
  additionalServices: {
    id: string;
  };
  external: {
    id: string;
  };
  delivery: {
    shippingRates: {
      id: string;
    };
  };
  b2b: {
    buyableOnlyByBusiness: boolean;
  };
  fundraisingCampaign: {
    id: string;
  };
  additionalMarketplaces: {
    [key: string]: {
      publication: {
        state: string;
      };
      sellingMode: {
        price: {
          amount: string;
          currency: string;
        };
        priceAutomation: {
          rule: {
            id: string;
            type: string;
          };
        };
      };
      stats: {
        watchersCount: number;
        visitsCount: number;
      };
      stock: {
        sold: number;
      };
    };
  };
}

export interface AllegroOffer {
  id: string;
  name: string;
  category: {
    id: string;
  };
  primaryImage: {
    url: string;
  };
  sellingMode: {
    format: string;
    price: {
      amount: string;
      currency: string;
    };
    priceAutomation: {
      rule: {
        id: string;
        type: string;
      };
    };
    minimalPrice: {
      amount: string;
      currency: string;
    };
    startingPrice: {
      amount: string;
      currency: string;
    };
  };
  saleInfo: {
    currentPrice: {
      amount: string;
      currency: string;
    };
    biddersCount: number;
  };
  stock: {
    available: number;
    sold: number;
  };
  stats: {
    watchersCount: number;
    visitsCount: number;
  };
  publication: {
    status: string;
    startingAt: string;
    startedAt: string;
    endingAt: string;
    endedAt: string;
    marketplaces: {
      base: {
        id: string;
      };
      additional: Array<{
        id: string;
      }>;
    };
  };
  afterSalesServices: {
    impliedWarranty: {
      id: string;
    };
    returnPolicy: {
      id: string;
    };
    warranty: {
      id: string;
    };
  };
  additionalServices: {
    id: string;
  };
  external: {
    id: string;
  };
  delivery: {
    shippingRates: {
      id: string;
    };
  };
  b2b: {
    buyableOnlyByBusiness: boolean;
  };
  fundraisingCampaign: {
    id: string;
  };
  additionalMarketplaces: {
    [key: string]: {
      publication: {
        state: string;
      };
      sellingMode: {
        price: {
          amount: string;
          currency: string;
        };
        priceAutomation: {
          rule: {
            id: string;
            type: string;
          };
        };
      };
      stats: {
        watchersCount: number;
        visitsCount: number;
      };
      stock: {
        sold: number;
      };
    };
  };
}

export interface AllegroOffersResponse {
  offers: Array<AllegroOffer>;
  count: number;
  totalCount: number;
}
