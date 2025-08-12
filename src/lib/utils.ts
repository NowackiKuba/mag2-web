import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Check, Cog, Package2, PackageCheck, Timer, Truck, Undo2, X } from 'lucide-react';
import { OrderStatus } from './types/api';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseOrderStatus = (status?: OrderStatus) => {
  switch (status) {
    case OrderStatus.CANCELLED:
      return { text: 'Cancelled', icon: X, className: 'bg-red-500/20 text-red-200' };
    case OrderStatus.SUSPENDED:
      return { text: 'Suspended', icon: X, className: 'bg-red-500/20 text-red-200' };
    case OrderStatus.PICKED_UP:
      return { text: 'Picked Up', icon: Check, className: 'bg-green-500/20 text-green-200' };
    case OrderStatus.READY_FOR_PICKUP:
      return { text: 'Ready for pickup', icon: PackageCheck, className: 'bg-emerald-500/20 text-emerald-200' };
    case OrderStatus.READY_FOR_SHIPMENT:
      return { text: 'Ready for shipment', icon: Package2, className: 'bg-cyan-500/20 text-cyan-200' };
    case OrderStatus.NEW:
      return { text: 'New', icon: Timer, className: 'bg-blue-500/20 text-blue-200', animation: 'animate-pulse' };
    case OrderStatus.PROCESSING:
      return { text: 'Processing', icon: Cog, className: 'bg-yellow-500/20 text-yellow-200' };
    case OrderStatus.RETURNED:
      return { text: 'Returned', icon: Undo2, className: 'bg-rose-500/20 text-rose-200' };
    case OrderStatus.SENT:
      return { text: 'Sent', icon: Truck, className: 'bg-indigo-500/20 text-indigo-200' };
  }
};
