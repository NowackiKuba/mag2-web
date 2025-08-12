import { Check, Cog, Package2, PackageCheck, Timer, Truck, Undo2, X } from 'lucide-react';
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'CANCELLED':
        return { text: 'Cancelled', icon: X, className: 'bg-red-500/20 text-red-200' };
      case 'SUSPENDED':
        return { text: 'Suspended', icon: X, className: 'bg-red-500/20 text-red-200' };
      case 'PICKED_UP':
        return { text: 'Picked Up', icon: Check, className: 'bg-green-500/20 text-green-200' };
      case 'READY_FOR_PICKUP':
        return { text: 'Ready for pickup', icon: PackageCheck, className: 'bg-emerald-500/20 text-emerald-200' };
      case 'READY_FOR_PROCESSING':
        return { text: 'Ready for Processing', icon: Cog, className: 'bg-yellow-500/20 text-yellow-200' };
      case 'READY_FOR_SHIPMENT':
        return { text: 'Ready for shipment', icon: Package2, className: 'bg-cyan-500/20 text-cyan-200' };
      case 'NEW':
        return { text: 'New', icon: Timer, className: 'bg-blue-500/20 text-blue-200', animation: 'animate-pulse' };
      case 'PROCESSING':
        return { text: 'Processing', icon: Cog, className: 'bg-yellow-500/20 text-yellow-200' };
      case 'RETURNED':
        return { text: 'Returned', icon: Undo2, className: 'bg-rose-500/20 text-rose-200' };
      case 'SENT':
        return { text: 'Sent', icon: Truck, className: 'bg-indigo-500/20 text-indigo-200' };
      case 'PAID':
        return { text: 'Paid', icon: Check, className: 'bg-emerald-500/20 text-emerald-200' };
    }
  };

  return <span className={`py-1 px-3 rounded-full text-xs font-medium flex items-center justify-center ${getStatusColor(status)?.className}`}>{status}</span>;
};

export default StatusBadge;
