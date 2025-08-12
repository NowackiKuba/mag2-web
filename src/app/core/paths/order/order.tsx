import { useOrder } from '@/features/orders/get-order-by-id';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import StatusBadge from '../../components/atoms/status-badge';
import { Amount } from '@/lib/types/allegro';

// Using the provided types directly
const Order = () => {
  const { id } = useParams();
  const { data: order, isLoading } = useOrder({
    id: id!,
    opts: {
      enabled: !!id && id !== '',
    },
  });

  console.log(order);
  const [showBuyerDetails, setShowBuyerDetails] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const toggleBuyerDetails = () => {
    setShowBuyerDetails(!showBuyerDetails);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Format currency
  const formatCurrency = (amount: Amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: amount.currency,
    }).format(+amount?.amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const TabButton = ({ id, label, active }: { id: string; label: string; active: boolean }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`cursor-pointer px-4 py-2 font-medium text-sm rounded-t-lg ${
        active ? 'bg-secondary text-blue-600 border-b-2 border-blue-600' : 'text-muted-foreground hover:text-gray-700'
      }`}
    >
      {label}
    </button>
  );

  if (isLoading) {
    return '...loading';
  }

  return (
    <div className='min-h-screen p-6'>
      <div className='max-w-5xl mx-auto'>
        {/* Header */}
        <div className='bg-secondary border border-border rounded-lg shadow-md p-6 mb-6'>
          <div className='flex justify-between items-center'>
            <div>
              <h1 className='text-2xl font-bold'>Order #{order?.id}</h1>
              <p className='text-muted-foreground text-sm'>
                {order?.updatedAt && (
                  <>
                    Updated: {formatDate(order?.updatedAt)} • Revision: {order?.revision}
                  </>
                )}
              </p>
            </div>
            <div className='flex space-x-4'>
              <StatusBadge status={order?.fulfillment?.status?.toString() ?? 'NEW'} />
              <div className='relative'>
                <button className='bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700'>Actions</button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className='flex border-b mb-6'>
          <TabButton id='overview' label='Overview' active={activeTab === 'overview'} />
          <TabButton id='items' label='Items' active={activeTab === 'items'} />
          <TabButton id='delivery' label='Delivery' active={activeTab === 'delivery'} />
          <TabButton id='payment' label='Payment' active={activeTab === 'payment'} />
        </div>

        {/* Main content */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Left column */}
          <div className='lg:col-span-2'>
            {activeTab === 'overview' && (
              <div className='bg-secondary border border-border rounded-lg shadow-md p-6 mb-6'>
                <div className='flex justify-between items-center mb-4'>
                  <h2 className='text-lg font-semibold'>Order Status</h2>
                </div>
                <div className='grid grid-cols-2 gap-4 mb-6'>
                  <div>
                    <p className='text-sm text-muted-foreground'>Order Status</p>
                    <div className='flex items-center mt-1'>
                      <StatusBadge status={order?.status ?? ''} />
                    </div>
                  </div>
                  <div>
                    <p className='text-sm text-muted-foreground'>Fulfillment Status</p>
                    <div className='flex items-center mt-1'>
                      <StatusBadge status={order?.fulfillment?.status ?? ''} />
                    </div>
                  </div>
                </div>

                {order?.messageToSeller && (
                  <div className='mb-6'>
                    <h3 className='text-sm font-medium text-muted-foreground mb-1'>Message from buyer</h3>
                    <p className='p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm'>{order?.messageToSeller}</p>
                  </div>
                )}

                <div className='mb-6'>
                  <div className='flex justify-between items-center mb-2'>
                    <h3 className='text-sm font-medium text-muted-foreground'>Buyer Information</h3>
                    <button onClick={toggleBuyerDetails} className='text-xs text-blue-600 hover:text-blue-800'>
                      {showBuyerDetails ? 'Hide Details' : 'Show Details'}
                    </button>
                  </div>
                  <div className='border rounded-md p-4'>
                    <div className='flex justify-between'>
                      <p className='font-medium'>
                        {order?.buyer.firstName} {order?.buyer.lastName}
                      </p>
                      <button
                        onClick={() => copyToClipboard(`${order?.buyer.firstName} ${order?.buyer.lastName}`)}
                        className='text-xs text-muted-foreground hover:text-gray-700'
                      >
                        Copy
                      </button>
                    </div>
                    <p className='text-sm text-muted-foreground'>
                      {order?.buyer.email}
                      <button onClick={() => copyToClipboard(order?.buyer?.email ?? '')} className='ml-2 text-xs text-muted-foreground hover:text-gray-700'>
                        Copy
                      </button>
                    </p>
                    {order?.buyer.phoneNumber && (
                      <p className='text-sm text-muted-foreground'>
                        {order?.buyer.phoneNumber}
                        <button
                          onClick={() => copyToClipboard(order?.buyer.phoneNumber || '')}
                          className='ml-2 text-xs text-muted-foreground hover:text-gray-700'
                        >
                          Copy
                        </button>
                      </p>
                    )}

                    {showBuyerDetails && (
                      <div className='mt-3 pt-3 border-t'>
                        <p className='text-xs text-muted-foreground'>User ID: {order?.buyer.id}</p>
                        <p className='text-xs text-muted-foreground'>Username: {order?.buyer.login}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'delivery' && (
              <div className='bg-secondary border border-border rounded-lg shadow-md p-6 mb-6'>
                <h2 className='text-lg font-semibold mb-4'>Delivery Information</h2>
                <div className='mb-6'>
                  <div className='flex justify-between mb-2'>
                    <h3 className='text-sm font-medium text-muted-foreground'>Delivery Method</h3>
                    <span className='text-sm font-medium'>{order?.delivery.method.name.replace('_', ' ')}</span>
                  </div>

                  <div className='border rounded-md p-4'>
                    <h4 className='font-medium mb-2'>Shipping Address</h4>
                    <div className='text-sm'>
                      <p>
                        {order?.delivery.address.firstName} {order?.delivery.address.lastName}
                      </p>
                      <p>{order?.delivery.address.street}</p>
                      <p>
                        {order?.delivery.address.zipCode} {order?.delivery.address.city}
                      </p>
                      <p>{order?.delivery.address.countryCode}</p>
                      {order?.delivery.address.phoneNumber && <p className='mt-1'>{order?.delivery.address.phoneNumber}</p>}
                    </div>
                    <button
                      className='mt-2 text-xs text-blue-600 hover:text-blue-800'
                      onClick={() =>
                        copyToClipboard(`${order?.delivery.address.firstName} ${order?.delivery.address.lastName}
${order?.delivery.address.street}
${order?.delivery.address.zipCode} ${order?.delivery.address.city}
${order?.delivery.address.countryCode}
${order?.delivery.address.phoneNumber || ''}`)
                      }
                    >
                      Copy Address
                    </button>
                  </div>

                  {order?.delivery.method?.name === 'PICKUP_POINT' && order?.delivery.point && (
                    <div className='mt-4 border rounded-md p-4'>
                      <h4 className='font-medium mb-2'>Pickup Point</h4>
                      <div className='text-sm'>
                        <p className='font-medium'>{order?.delivery.point.name}</p>
                        {order?.delivery.point.description && <p className='text-gray-600'>{order?.delivery.point.description}</p>}
                        <div className='mt-2'>
                          <p>{order?.delivery.point.address.street}</p>
                          <p>
                            {order?.delivery.point.address.zipCode} {order?.delivery.point.address.city}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {order?.delivery.timeGuaranteed && (
                    <div className='mt-4'>
                      <h4 className='text-sm font-medium text-muted-foreground'>Delivery Due Date</h4>
                      <p className='text-sm'>{formatDate(order?.delivery.timeGuaranteed)}</p>
                    </div>
                  )}

                  <div className='mt-4'>
                    <h4 className='text-sm font-medium text-muted-foreground'>Shipping Cost</h4>
                    {order && <p className='text-sm'>{formatCurrency(order?.delivery?.cost)}</p>}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'items' && (
              <div className='bg-secondary border border-border rounded-lg shadow-md p-6 mb-6'>
                <h2 className='text-lg font-semibold mb-4'>Order Items</h2>
                <div className='overflow-x-auto'>
                  <table className='min-w-full divide-y divide-border'>
                    <thead className='bg-muted'>
                      <tr>
                        <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                          Item
                        </th>
                        <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                          Qty
                        </th>
                        <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                          Unit Price
                        </th>
                        <th scope='col' className='px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className='bg-secondary border border-border divide-y divide-border'>
                      {order?.lineItems.map((item) => (
                        <tr key={item.id}>
                          <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground'>{item?.offer?.name}</td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-muted-foreground'>{item.quantity}</td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-muted-foreground'>{formatCurrency(item?.price)}</td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-muted-foreground'>{formatCurrency(item?.price)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'payment' && (
              <div className='bg-secondary border border-border rounded-lg shadow-md p-6 mb-6'>
                <h2 className='text-lg font-semibold mb-4'>Payment Information</h2>

                <div className='mb-6'>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <h3 className='text-sm font-medium text-muted-foreground mb-1'>Payment Method</h3>
                      <p>{order?.payment?.type}</p>
                    </div>
                    <div>
                      <h3 className='text-sm font-medium text-muted-foreground mb-1'>Payment Status</h3>
                      <StatusBadge status={order?.payment?.finishedAt ? 'PAID' : 'PROCESSING'} />
                    </div>
                  </div>

                  {order?.payment?.finishedAt && (
                    <div className='mt-4'>
                      <h3 className='text-sm font-medium text-muted-foreground mb-1'>Payment Date</h3>
                      <p>{formatDate(order?.payment?.finishedAt)}</p>
                    </div>
                  )}
                </div>

                <div className='border-t pt-4'>
                  <h3 className='text-sm font-medium text-muted-foreground mb-3'>Payment Breakdown</h3>

                  <div className='space-y-2'>
                    {order?.lineItems.map((item) => (
                      <div key={item.id} className='flex justify-between'>
                        <span className='text-sm'>
                          {item.offer.name} (×{item.quantity})
                        </span>
                        <span className='text-sm'>{formatCurrency(item.price)}</span>
                      </div>
                    ))}

                    <div className='border-t pt-2'>
                      <div className='flex justify-between'>
                        <span className='text-sm'>Shipping</span>
                        {order && <span className='text-sm'>{formatCurrency(order?.delivery.cost)}</span>}
                      </div>
                    </div>

                    {order?.surcharges.map((surcharge, index) => (
                      <div key={index} className='flex justify-between'>
                        <span className='text-sm'>{surcharge.type}</span>
                        <span className='text-sm'>{formatCurrency(surcharge.paidAmount)}</span>
                      </div>
                    ))}

                    <div className='border-t pt-2'>
                      <div className='flex justify-between font-medium'>
                        <span>Total</span>
                        {order && <span>{formatCurrency(order?.summary.totalToPay)}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right column - Summary */}
          <div className='lg:col-span-1'>
            <div className='bg-secondary border border-border rounded-lg shadow-md p-6 mb-6'>
              <h2 className='text-lg font-semibold mb-4'>Order Summary</h2>

              <div className='space-y-4'>
                <div>
                  <h3 className='text-sm font-medium text-muted-foreground mb-1'>Order ID</h3>
                  <div className='flex items-center'>
                    <p className='text-sm font-medium'>{order?.id}</p>
                    <button onClick={() => copyToClipboard(order?.id ?? '')} className='ml-2 text-xs text-muted-foreground hover:text-gray-700'>
                      Copy
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className='text-sm font-medium text-muted-foreground mb-1'>Order Date</h3>
                  <p className='text-sm'>{formatDate(order?.updatedAt ?? '')}</p>
                </div>

                <div>
                  <h3 className='text-sm font-medium text-muted-foreground mb-1'>Order Status</h3>
                  <StatusBadge status={order?.status ?? ''} />
                </div>

                <div>
                  <h3 className='text-sm font-medium text-muted-foreground mb-1'>Payment Status</h3>
                  <StatusBadge status={order?.payment?.finishedAt ? 'PAID' : 'PROCESSING'} />
                </div>

                <div>
                  <h3 className='text-sm font-medium text-muted-foreground mb-1'>Fulfillment Status</h3>
                  <StatusBadge status={order?.fulfillment?.status ?? 'New'} />
                </div>

                <div className='pt-4 border-t'>
                  <h3 className='text-sm font-medium text-muted-foreground mb-2'>Items</h3>
                  <ul className='space-y-2'>
                    {order?.lineItems.map((item) => (
                      <li key={item.id} className='text-sm'>
                        {item.quantity}× {item?.offer?.name}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className='pt-4 border-t'>
                  <div className='flex justify-between items-center'>
                    <h3 className='text-sm font-medium text-muted-foreground'>Total</h3>
                    {order && <p className='font-medium'>{formatCurrency(order?.summary.totalToPay)}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* <div className='bg-secondary border border-border rounded-lg shadow-md p-6'>
              <h2 className='text-lg font-semibold mb-4'>Actions</h2>

              <div className='space-y-3'>
                <button className='w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700'>Print Shipping Label</button>

                <button className='w-full bg-secondary border border-border text-blue-600 border border-blue-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50'>
                  Generate Invoice
                </button>

                <button className='w-full bg-secondary border border-border text-gray-600 border border-gray-300 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50'>
                  Email Customer
                </button>

                <button className='w-full bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-100'>
                  Cancel Order
                </button>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
