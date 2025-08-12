export interface ErliProduct {
  name: string;
  description: {
    sections: Array<{
      items: Array<{
        type: string;
        content: string;
        url: string;
      }>;
    }>;
  };
  ean: string;
  sku: string;
  externalReferences: Array<{
    id: string;
    kind: string;
  }>;
  sourceFulfillmentProductId: number;
  importantFeatures: string[];
  externalAttributes: Array<{
    id: string;
    type: string;
    values: string[];
    source: string;
    index: number;
  }>;
  externalCategories: Array<{
    source: string;
    breadcrumb: Array<{
      id: string;
      name: string;
    }>;
    index: number;
  }>;
  externalVariantGroup: {
    id: string;
    source: string;
    attributes: any[];
  };
  externalResponsibleProducer: Array<{
    externalId: string;
    source: string;
  }>;
  externalResponsiblePerson: Array<{
    externalId: string;
    source: string;
  }>;
  images: Array<{
    url: string;
    isVariantImage: boolean;
    internalUrl: string;
  }>;
  files: Array<{
    url: string;
  }>;
  price: number;
  mobilePrice: number;
  cataloguePrice: number;
  referencePriceType: string;
  stock: number;
  status: string;
  archived: boolean;
  dispatchTime: {
    period: number;
  };
  deliveryPriceList: string;
  weight: number;
  obligatoryIdentifier: string;
  voluntaryIdentifier: string;
  returnIdentifier: string;
  invoiceType: string;
  taxRate: string;
  basketLimit: number;
  energyLabel: string;
  instructionWithSafetyInformation: string;
  informationCard: string;
  producerId: number;
  responsiblePersonId: number;
  productAttachments: Array<{
    id: number;
    kind: string;
    url: string;
  }>;
  markets: string;
  translations: Record<
    string,
    {
      name: string;
      descriptionId: number;
      attributes: Array<{
        key: string;
        name: string;
        values: string[];
        unit: string;
      }>;
    }
  >;
  externalId: string;
  externalDescriptionHash: string;
  externalDescription: string;
  attributes: Array<{
    id: number;
    name: string;
    values: string[];
    valueIds: number[];
    unit: string;
  }>;
  categories: Array<
    Array<{
      id: number;
      name: string;
    }>
  >;
  packaging: {
    tags: string[];
    weight: number;
  };
  marketplaceId: number;
  slug: string;
  buyableProblems: string[];
  archivedAt: string;
  frozen: {
    name: boolean;
    description: boolean;
    ean: boolean;
    sku: boolean;
    externalAttributes: boolean;
    externalCategories: boolean;
    externalVariantGroup: boolean;
    images: boolean;
    files: boolean;
    price: boolean;
    mobilePrice: boolean;
    cataloguePrice: boolean;
    importantFeatures: boolean;
    stock: boolean;
    status: boolean;
    dispatchTime: boolean;
    invoiceType: boolean;
    taxRate: boolean;
    obligatoryIdentifier: boolean;
    voluntaryIdentifier: boolean;
    returnIdentifier: boolean;
    deliveryPriceList: boolean;
    weight: boolean;
  };
  created: string;
  updated: string;
  producerIds: number[];
  responsiblePersonIds: number[];
}

export interface ErliProductsResponse {
  products: ErliProduct[];
  pagination: any;
  filter: any;
}
