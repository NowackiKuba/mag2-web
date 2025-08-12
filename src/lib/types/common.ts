import { Dispatch, SetStateAction } from 'react';
import { Product, ProductSource } from './api';

export interface DialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export interface DialogDetailsProps extends DialogProps {
  id: string;
}

export enum SYSTEM_CONFIGURATION {
  PUBLIC = 'PUBLIC',
  PUBLIC_BETA = 'PUBLIC_BETA',
  CLIENT_EXCLUSIVE_KICKS = 'CLIENT_EXCLUSIVE_KICKS',
}

export interface ScannerProd {
  product: Product;
  sources?: ProductSource[];
  details?: MarketplaceProductDetails;
  quantityScanned: number;
  isSynced: boolean;
}

export interface MarketplaceProductDetails {
  price: number;
  currency: string;
  stock: number;
  source: ProductSource;
}

export interface ReportData {
  product: {
    image: string;
    name: string;
  };
  cost: number;
  currentPrice: number;
  income: number;
  profit: number;
  kp: number;
  fees: number;
  avgSellingPrice: number;
  ordersCount: number;
}
