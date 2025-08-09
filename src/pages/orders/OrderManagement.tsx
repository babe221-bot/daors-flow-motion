import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Plus, Filter, Search, FileText, Truck, Package, 
  Calendar, User, DollarSign, CheckCircle, AlertCircle 
} from 'lucide-react';

// Types
interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  totalAmount: number;
  currency: string;
  shippingAddress: Address;
  billingAddress: Address;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  notes?: string;
}

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface OrderFilters {
  status: string;
  dateRange: { start: string; end: string } | null;
  customer: string;
  search: string;
}

// Mock API functions
const getOrders = async (filters: OrderFilters): Promise<Order[]> => {
  // In a real app, this would call an API with the filters
  console.log('Fetching orders with filters:', filters);
  
  // Mock data
  return [
    {
      id: 'ord-001',
      orderNumber: 'ORD-2023-001',
      customerId: 'cust-001',
      customerName: 'Acme Corporation',
      status: 'processing',
      items: [
        {
          id: 'item-001',
          productId: 'prod-001',
          productName: 'Industrial Sensors',
          quantity: 50,
          unitPrice: 120,
          totalPrice: 6000
        },
        {
          id: 'item-002',
          productId: 'prod-002',
          productName: 'Control Panels',
          quantity: 10,
          unitPrice: 350,
          totalPrice: 3500
        }
      ],
      totalAmount: 9500,
      currency: 'EUR',
      shippingAddress: {
        street: 'Industrijska zona bb',
        city: 'Belgrade',
        state: 'Serbia',
        postalCode: '11000',
        country: 'Serbia'
      },
      billingAddress: {
        street: 'Industrijska zona bb',
        city: 'Belgrade',
        state: 'Serbia',
        postalCode: '11000',
        country: 'Serbia'
      },
      paymentStatus: 'paid',
      createdAt: '2023-06-01T10:30:00Z',
      updatedAt: '2023-06-01T14:45:00Z',
      estimatedDelivery: '2023-06-10T12:00:00Z',
      notes: 'Priority customer, ensure timely delivery'
    },
    {
      id: 'ord-002',
      orderNumber: 'ORD-2023-002',
      customerId: 'cust-002',
      customerName: 'TechSolutions Ltd',
      status: 'pending',
      items: [
        {
          id: 'item-003',
          productId: 'prod-003',
          productName: 'Server Racks',
          quantity: 5,
          unitPrice: 800,
          totalPrice: 4000
        }
      ],
      totalAmount: 4000,
      currency: 'EUR',
      shippingAddress: {
        street: 'Tehnološki park 5',
        city: 'Zagreb',
        state: 'Croatia',
        postalCode: '10000',
        country: 'Croatia'
      },
      billingAddress: {
        street: 'Tehnološki park 5',
        city: 'Zagreb',
        state: 'Croatia',
        postalCode: '10000',
        country: 'Croatia'
      },
      paymentStatus: 'pending',
      createdAt: '2023-06-02T09:15:00Z',
      updatedAt: '2023-06-02T09:15:00Z',
      estimatedDelivery: '2023-06-15T12:00:00Z'
    },
    {
      id: 'ord-003',
      orderNumber: 'ORD-2023-003',
      customerId: 'cust-003',
      customerName: 'MediSupply d.o.o.',
      status: 'shipped',
      items: [
        {
          id: 'item-004',
          productId: 'prod-004',
          productName: 'Medical Refrigerators',
          quantity: 3,
          unitPrice: 1200,
          totalPrice: 3600
        },
        {
          id: 'item-005',
          productId: 'prod-005',
          productName: 'Lab Equipment',
          quantity: 15,
          unitPrice: 450,
          totalPrice: 6750
        }
      ],
      totalAmount: 10350,
      currency: 'EUR',
      shippingAddress: {
        street: 'Zdravstvena 12',
        city: 'Sarajevo',
        state: 'Bosnia and Herzegovina',
        postalCode: '71000',
        country: 'Bosnia and Herzegovina'
      },
      billingAddress: {
        street: 'Zdravstvena 12',
        city: 'Sarajevo',
        state: 'Bosnia and Herzegovina',
        postalCode: '71000',
        country: 'Bosnia and Herzegovina'
      },
      paymentStatus: 'paid',
      createdAt: '2023-06-02T11:45:00Z',
      updatedAt: '2023-06-03T08:30:00Z',
      estimatedDelivery: '2023-06-08T12:00:00Z',
      notes: 'Temperature-sensitive items, handle with care'
    },
    {
      id: 'ord-004',
      orderNumber: 'ORD-2023-004',
      customerId: 'cust-004',
      customerName: 'Alpine Resorts',
      status: 'delivered',
      items: [
        {
          id: 'item-006',
          productId: 'prod-006',
          productName: 'Heating Systems',
          quantity: 8,
          unitPrice: 950,
          totalPrice: 7600
        }
      ],
      totalAmount: 7600,
      currency: 'EUR',
      shippingAddress: {
        street: 'Planinska 45',
        city: 'Ljubljana',
        state: 'Slovenia',
        postalCode: '1000',
        country: 'Slovenia'
      },
      billingAddress: {
        street: 'Planinska 45',
        city: 'Ljubljana',
        state: 'Slovenia',
        postalCode: '1000',
        country: 'Slovenia'
      },
      paymentStatus: 'paid',
      createdAt: '2023-05-25T14:20:00Z',
      updatedAt: '2023-06-01T16:45:00Z',
      estimatedDelivery: '2023-06-01T12:00:00Z'
    },
    {
      id: 'ord-005',
      orderNumber: 'ORD-2023-005',
      customerId: 'cust-005',
      customerName: 'Balkan Exports',
      status: 'cancelled',
      items: [
        {
          id: 'item-007',
          productId: 'prod-007',
          productName: 'Packaging Materials',
          quantity: 1000,
          unitPrice: 2.5,
          totalPrice: 2500
        }
      ],
      totalAmount: 2500,
      currency: 'EUR',
      shippingAddress: {
        street: 'Izvozna 78',
        city: 'Skopje',
        state: 'North Macedonia',
        postalCode: '1000',
        country: 'North Macedonia'
      },
      billingAddress: {
        street: 'Izvozna 78',
        city: 'Skopje',
        state: 'North Macedonia',
        postalCode: '1000',
        country: 'North Macedonia'
      },
      paymentStatus: 'refunded',
      createdAt: '2023-05-30T10:10:00Z',
      updatedAt: '2023-05-31T09:25:00Z',
      notes: 'Order cancelled by customer due to delay'
    }
  ];
};

const createOrder = async (orderData: Partial<Order>): Promise<Order> => {
  // In a real app, this would call an API to create the order
  console.log('Creating order with data:', orderData);
  
  // Mock response
  return {
    id: `ord-${Math.floor(Math.random() * 1000)}`,
    orderNumber: `ORD-2023-${Math.floor(Math.random() * 1000)}`,
    customerId: orderData.customerId || '',
    customerName: orderData.customerName || '',
    status: 'pending',
    items: orderData.items || [],
    totalAmount: orderData.totalAmount || 0,
    currency: orderData.currency || 'EUR',
    shippingAddress: orderData.shippingAddress || {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    },
    billingAddress: orderData.billingAddress || {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    },
    paymentStatus: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    estimatedDelivery: orderData.estimatedDelivery,
    notes: orderData.notes
  };
};

const updateOrder = async (orderData: Partial<Order> & { id: string }): Promise<Order> => {
  // In a real app, this would call an API to update the order
  console.log('Updating order with data:', orderData);
  
  // Mock response - in a real app, this would return the updated order from the server
  return {
    ...orderData,
    updatedAt: new Date().toISOString()
  } as Order;
};

// Status badge component
const StatusBadge: React.FC<{ status: Order['status'] }> = ({ status }) => {
  const statusConfig = {
    'pending': { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
    'processing': { color: 'bg-blue-100 text-blue-800', label: 'Processing' },
    'shipped': { color: 'bg-purple-100 text-purple-800', label: 'Shipped' },
    'delivered': { color: 'bg-green-100 text-green-800', label: 'Delivered' },
    'cancelled': { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
  };

  const config = statusConfig[status];

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};

// Payment status badge component
const PaymentBadge: React.FC<{ status: Order['paymentStatus'] }> = ({ status }) => {
  const statusConfig = {
    'pending': { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
    'paid': { color: 'bg-green-100 text-green-800', label: 'Paid' },
    'failed': { color: 'bg-red-100 text-red-800', label: 'Failed' },
    'refunded': { color: 'bg-gray-100 text-gray-800', label: 'Refunded' },
  };

  const config = statusConfig[status];

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};

// Create Order Modal
const CreateOrderModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onCreateOrder: (data: Partial<Order>) => void;
  isLoading: boolean;
}> = ({ isOpen, onClose, onCreateOrder, isLoading }) => {
  const [formData, setFormData] = useState<Partial<Order>>({
    customerName: '',
    customerId: '',
    items: [],
    totalAmount: 0,
    currency: 'EUR',
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    },
    billingAddress: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    },
    estimatedDelivery: '',
    notes: ''
  });

  const [currentItem, setCurrentItem] = useState<Partial<OrderItem>>({
    productName: '',
    quantity: 1,
    unitPrice: 0
  });

  const handleAddItem = () => {
    if (!currentItem.productName || !currentItem.quantity || !currentItem.unitPrice) {
      return;
    }

    const newItem = {
      id: `temp-${Date.now()}`,
      productId: `prod-${Date.now()}`,
      productName: currentItem.productName,
      quantity: currentItem.quantity || 0,
      unitPrice: currentItem.unitPrice || 0,
      totalPrice: (currentItem.quantity || 0) * (currentItem.unitPrice || 0)
    };

    const newItems = [...(formData.items || []), newItem];
    const newTotalAmount = newItems.reduce((sum, item) => sum + item.totalPrice, 0);

    setFormData({
      ...formData,
      items: newItems,
      totalAmount: newTotalAmount
    });

    setCurrentItem({
      productName: '',
      quantity: 1,
      unitPrice: 0
    });
  };

  const handleRemoveItem = (itemId: string) => {
    const newItems = (formData.items || []).filter(item => item.id !== itemId);
    const newTotalAmount = newItems.reduce((sum, item) => sum + item.totalPrice, 0);

    setFormData({
      ...formData,
      items: newItems,
      totalAmount: newTotalAmount
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateOrder(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Create New Order</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Customer Name</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Customer ID</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={formData.customerId}
                    onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Order Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Currency</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    required
                  >
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                    <option value="GBP">GBP</option>
                    <option value="CHF">CHF</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Estimated Delivery</label>
                  <input
                    type="date"
                    className="w-full p-2 border rounded-md"
                    value={formData.estimatedDelivery ? new Date(formData.estimatedDelivery).toISOString().split('T')[0] : ''}
                    onChange={(e) => setFormData({ ...formData, estimatedDelivery: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Shipping Address</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Street</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={formData.shippingAddress?.street}
                    onChange={(e) => setFormData({
                      ...formData,
                      shippingAddress: { ...formData.shippingAddress!, street: e.target.value }
                    })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">City</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      value={formData.shippingAddress?.city}
                      onChange={(e) => setFormData({
                        ...formData,
                        shippingAddress: { ...formData.shippingAddress!, city: e.target.value }
                      })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">State/Province</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      value={formData.shippingAddress?.state}
                      onChange={(e) => setFormData({
                        ...formData,
                        shippingAddress: { ...formData.shippingAddress!, state: e.target.value }
                      })}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Postal Code</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      value={formData.shippingAddress?.postalCode}
                      onChange={(e) => setFormData({
                        ...formData,
                        shippingAddress: { ...formData.shippingAddress!, postalCode: e.target.value }
                      })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Country</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      value={formData.shippingAddress?.country}
                      onChange={(e) => setFormData({
                        ...formData,
                        shippingAddress: { ...formData.shippingAddress!, country: e.target.value }
                      })}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Billing Address</h3>
              <div className="space-y-4">
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="same-address"
                    className="mr-2"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          billingAddress: { ...formData.shippingAddress! }
                        });
                      }
                    }}
                  />
                  <label htmlFor="same-address" className="text-sm">Same as shipping address</label>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Street</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={formData.billingAddress?.street}
                    onChange={(e) => setFormData({
                      ...formData,
                      billingAddress: { ...formData.billingAddress!, street: e.target.value }
                    })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">City</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      value={formData.billingAddress?.city}
                      onChange={(e) => setFormData({
                        ...formData,
                        billingAddress: { ...formData.billingAddress!, city: e.target.value }
                      })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">State/Province</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      value={formData.billingAddress?.state}
                      onChange={(e) => setFormData({
                        ...formData,
                        billingAddress: { ...formData.billingAddress!, state: e.target.value }
                      })}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Postal Code</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      value={formData.billingAddress?.postalCode}
                      onChange={(e) => setFormData({
                        ...formData,
                        billingAddress: { ...formData.billingAddress!, postalCode: e.target.value }
                      })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Country</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      value={formData.billingAddress?.country}
                      onChange={(e) => setFormData({
                        ...formData,
                        billingAddress: { ...formData.billingAddress!, country: e.target.value }
                      })}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Order Items</h3>
            
            <div className="bg-muted/30 p-4 rounded-md mb-4">
              <div className="grid grid-cols-12 gap-4 mb-2">
                <div className="col-span-5">
                  <label className="block text-sm font-medium mb-1">Product Name</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={currentItem.productName}
                    onChange={(e) => setCurrentItem({ ...currentItem, productName: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full p-2 border rounded-md"
                    value={currentItem.quantity}
                    onChange={(e) => setCurrentItem({ ...currentItem, quantity: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-sm font-medium mb-1">Unit Price</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full p-2 border rounded-md"
                    value={currentItem.unitPrice}
                    onChange={(e) => setCurrentItem({ ...currentItem, unitPrice: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="col-span-2 flex items-end">
                  <button
                    type="button"
                    className="w-full p-2 bg-primary text-white rounded-md"
                    onClick={handleAddItem}
                  >
                    Add Item
                  </button>
                </div>
              </div>
            </div>
            
            {formData.items && formData.items.length > 0 ? (
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="p-2 text-left">Product</th>
                      <th className="p-2 text-right">Quantity</th>
                      <th className="p-2 text-right">Unit Price</th>
                      <th className="p-2 text-right">Total</th>
                      <th className="p-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.items.map((item) => (
                      <tr key={item.id} className="border-t">
                        <td className="p-2">{item.productName}</td>
                        <td className="p-2 text-right">{item.quantity}</td>
                        <td className="p-2 text-right">{item.unitPrice.toFixed(2)} {formData.currency}</td>
                        <td className="p-2 text-right">{item.totalPrice.toFixed(2)} {formData.currency}</td>
                        <td className="p-2 text-center">
                          <button
                            type="button"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t bg-muted/20">
                      <td colSpan={3} className="p-2 text-right font-medium">Total:</td>
                      <td className="p-2 text-right font-bold">{formData.totalAmount?.toFixed(2)} {formData.currency}</td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center p-4 border rounded-md bg-muted/10">
                <p className="text-muted-foreground">No items added yet</p>
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              className="w-full p-2 border rounded-md"
              rows={3}
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any special instructions or notes about this order"
            ></textarea>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 border rounded-md"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md flex items-center"
              disabled={isLoading || !formData.items || formData.items.length === 0}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Creating...
                </>
              ) : (
                <>
                  Create Order
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Order Details Component
const OrderDetails: React.FC<{
  order: Order | undefined;
  onUpdateOrder: (data: Partial<Order>) => void;
}> = ({ order, onUpdateOrder }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedOrder, setEditedOrder] = useState<Partial<Order>>({});

  React.useEffect(() => {
    if (order) {
      setEditedOrder({
        status: order.status,
        paymentStatus: order.paymentStatus,
        estimatedDelivery: order.estimatedDelivery,
        notes: order.notes
      });
    }
  }, [order]);

  if (!order) {
    return (
      <div className="bg-card p-6 rounded-lg shadow h-full flex items-center justify-center">
        <p className="text-muted-foreground">Select an order to view details</p>
      </div>
    );
  }

  const handleSave = () => {
    onUpdateOrder({ ...editedOrder, id: order.id });
    setIsEditing(false);
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold">Order Details</h2>
        <button
          className="text-primary hover:text-primary/80"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>
      
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">{order.orderNumber}</h3>
            {isEditing ? (
              <select
                className="p-1 border rounded-md"
                value={editedOrder.status}
                onChange={(e) => setEditedOrder({ ...editedOrder, status: e.target.value as Order['status'] })}
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            ) : (
              <StatusBadge status={order.status} />
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Created: {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Customer</p>
            <p className="font-medium">{order.customerName}</p>
            <p className="text-sm">ID: {order.customerId}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Payment Status</p>
            {isEditing ? (
              <select
                className="p-1 border rounded-md"
                value={editedOrder.paymentStatus}
                onChange={(e) => setEditedOrder({ ...editedOrder, paymentStatus: e.target.value as Order['paymentStatus'] })}
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            ) : (
              <PaymentBadge status={order.paymentStatus} />
            )}
          </div>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Total Amount</p>
          <p className="text-xl font-bold">{order.totalAmount.toFixed(2)} {order.currency}</p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Estimated Delivery</p>
          {isEditing ? (
            <input
              type="date"
              className="p-1 border rounded-md w-full"
              value={editedOrder.estimatedDelivery ? new Date(editedOrder.estimatedDelivery).toISOString().split('T')[0] : ''}
              onChange={(e) => setEditedOrder({ 
                ...editedOrder, 
                estimatedDelivery: e.target.value ? new Date(e.target.value).toISOString() : undefined 
              })}
            />
          ) : (
            <p className="font-medium">
              {order.estimatedDelivery 
                ? new Date(order.estimatedDelivery).toLocaleDateString() 
                : 'Not specified'}
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Shipping Address</p>
            <p className="font-medium">{order.shippingAddress.street}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
            <p>{order.shippingAddress.country}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Billing Address</p>
            <p className="font-medium">{order.billingAddress.street}</p>
            <p>{order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.postalCode}</p>
            <p>{order.billingAddress.country}</p>
          </div>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground mb-2">Order Items</p>
          <div className="border rounded-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="p-2 text-left">Product</th>
                  <th className="p-2 text-right">Qty</th>
                  <th className="p-2 text-right">Price</th>
                  <th className="p-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="p-2">{item.productName}</td>
                    <td className="p-2 text-right">{item.quantity}</td>
                    <td className="p-2 text-right">{item.unitPrice.toFixed(2)}</td>
                    <td className="p-2 text-right">{item.totalPrice.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Notes</p>
          {isEditing ? (
            <textarea
              className="p-2 border rounded-md w-full"
              rows={3}
              value={editedOrder.notes || ''}
              onChange={(e) => setEditedOrder({ ...editedOrder, notes: e.target.value })}
            ></textarea>
          ) : (
            <p className="italic">{order.notes || 'No notes'}</p>
          )}
        </div>
        
        {isEditing && (
          <div className="flex justify-end">
            <button
              className="px-4 py-2 bg-primary text-white rounded-md"
              onClick={handleSave}
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Order Filters Component
const OrderFilters: React.FC<{
  filters: OrderFilters;
  onFilterChange: (filters: OrderFilters) => void;
}> = ({ filters, onFilterChange }) => {
  return (
    <div className="bg-card p-4 rounded-lg shadow grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          className="w-full p-2 border rounded-md"
          value={filters.status}
          onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Date Range</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="date"
            className="p-2 border rounded-md"
            value={filters.dateRange?.start || ''}
            onChange={(e) => onFilterChange({
              ...filters,
              dateRange: {
                start: e.target.value,
                end: filters.dateRange?.end || ''
              }
            })}
          />
          <input
            type="date"
            className="p-2 border rounded-md"
            value={filters.dateRange?.end || ''}
            onChange={(e) => onFilterChange({
              ...filters,
              dateRange: {
                start: filters.dateRange?.start || '',
                end: e.target.value
              }
            })}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Customer</label>
        <input
          type="text"
          className="w-full p-2 border rounded-md"
          placeholder="Customer name or ID"
          value={filters.customer}
          onChange={(e) => onFilterChange({ ...filters, customer: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Search</label>
        <div className="relative">
          <input
            type="text"
            className="w-full p-2 pl-8 border rounded-md"
            placeholder="Order number, product..."
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
          />
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
};

// Main Order Management Component
const OrderManagement: React.FC = () => {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filters, setFilters] = useState<OrderFilters>({
    status: 'all',
    dateRange: null,
    customer: '',
    search: ''
  });
  
  const queryClient = useQueryClient();
  
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders', filters],
    queryFn: () => getOrders(filters)
  });
  
  const createMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setIsCreateModalOpen(false);
    }
  });
  
  const updateMutation = useMutation({
    mutationFn: updateOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    }
  });
  
  const selectedOrder = orders?.find(order => order.id === selectedOrderId);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  // Table columns
  const orderColumns = [
    { 
      header: 'Order #', 
      accessorKey: 'orderNumber',
      cell: ({ row }: any) => (
        <div className="flex items-center">
          <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>{row.original.orderNumber}</span>
        </div>
      )
    },
    { 
      header: 'Customer', 
      accessorKey: 'customerName',
      cell: ({ row }: any) => (
        <div className="flex items-center">
          <User className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>{row.original.customerName}</span>
        </div>
      )
    },
    { 
      header: 'Status', 
      accessorKey: 'status',
      cell: ({ row }: any) => <StatusBadge status={row.original.status} />
    },
    { 
      header: 'Total', 
      accessorKey: 'totalAmount',
      cell: ({ row }: any) => (
        <div className="flex items-center justify-end">
          <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
          <span>{row.original.totalAmount.toFixed(2)} {row.original.currency}</span>
        </div>
      )
    },
    { 
      header: 'Payment', 
      accessorKey: 'paymentStatus',
      cell: ({ row }: any) => <PaymentBadge status={row.original.paymentStatus} />
    },
    { 
      header: 'Date', 
      accessorKey: 'createdAt',
      cell: ({ row }: any) => (
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>{new Date(row.original.createdAt).toLocaleDateString()}</span>
        </div>
      )
    },
  ];

  return (
    <div className="p-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-6"
      >
        <motion.div variants={itemVariants} className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Order Management</h1>
            <p className="text-muted-foreground">Centralized order processing and management</p>
          </div>
          <button 
            className="btn btn-primary flex items-center gap-2"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Create New Order
          </button>
        </motion.div>

        <motion.div variants={itemVariants}>
          <OrderFilters 
            filters={filters} 
            onFilterChange={setFilters} 
          />
        </motion.div>
        
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-card p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Orders</h2>
              
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-12 bg-muted rounded"></div>
                  ))}
                </div>
              ) : orders && orders.length > 0 ? (
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        {orderColumns.map((column) => (
                          <th key={column.accessorKey} className="p-3 text-left">
                            {column.header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr 
                          key={order.id} 
                          className={`border-t hover:bg-muted/30 cursor-pointer ${
                            selectedOrderId === order.id ? 'bg-primary/10' : ''
                          }`}
                          onClick={() => setSelectedOrderId(order.id)}
                        >
                          {orderColumns.map((column) => (
                            <td key={`${order.id}-${column.accessorKey}`} className="p-3">
                              {column.cell ? column.cell({ row: { original: order } }) : (order as any)[column.accessorKey]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center p-8 border rounded-md">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Orders Found</h3>
                  <p className="text-muted-foreground mb-4">
                    No orders match your current filters. Try adjusting your search or create a new order.
                  </p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    Create New Order
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <OrderDetails 
              order={selectedOrder} 
              onUpdateOrder={(data) => updateMutation.mutate(data)}
            />
          </div>
        </motion.div>
      </motion.div>
      
      <CreateOrderModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateOrder={(data) => createMutation.mutate(data)}
        isLoading={createMutation.isPending}
      />
    </div>
  );
};

export default OrderManagement;