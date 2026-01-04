'use client';

import { useState, useEffect } from 'react';
import { ApiClient, Order } from '@/lib/api';

interface OrderDetailsModalProps {
    order: Order;
    onClose: () => void;
    onUpdate: () => void;
}

export default function OrderDetailsModal({ order: initialOrder, onClose, onUpdate }: OrderDetailsModalProps) {
    const [order, setOrder] = useState<Order>(initialOrder);
    const [updating, setUpdating] = useState(false);

    // Status color helper
    const [dispatching, setDispatching] = useState(false);

    // Status color helper
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'DELIVERED': return 'bg-green-100 text-green-700';
            case 'SHIPPED': return 'bg-blue-100 text-blue-700';
            case 'CONFIRMED': return 'bg-purple-100 text-purple-700';
            default: return 'bg-yellow-100 text-yellow-700';
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        if (newStatus === order.status) return;
        setUpdating(true);
        try {
            const updatedOrder = await ApiClient.updateOrderStatus(order.id, newStatus);
            setOrder(updatedOrder);
            onUpdate(); // Trigger parent refresh if needed, though we updated local state too
        } catch (error) {
            console.error('Failed to update status', error);
            alert('Failed to update status');
        } finally {
            setUpdating(false);
        }
    };

    const handleDispatch = async () => {
        if (!confirm('Dispatch this order to the distributor?')) return;
        setDispatching(true);
        try {
            // 1. Get User Addresses to pick one (mock: pick first)
            // In real app, we might ask user to select, but here we simulate automated dropshipping to default addr.
            const addresses = await ApiClient.getShippingAddresses(order.userId);
            if (!addresses || addresses.length === 0) {
                alert('No shipping addresses found for this customer. Cannot dispatch.');
                return;
            }
            const targetAddress = addresses[0];

            // 2. Dispatch
            const shipment = await ApiClient.dispatchShipment(order.id, order.userId, targetAddress.id, order.items);

            // 3. Update Order Status to SHIPPED
            await ApiClient.updateOrderStatus(order.id, 'SHIPPED');

            // 4. Update UI
            setOrder(prev => ({ ...prev, status: 'SHIPPED' }));
            onUpdate();

            alert(`Order Dispatched Successfully!\nTracking Number: ${shipment.trackingNumber}\nDistributor: ${shipment.distributorId}`);

        } catch (error) {
            console.error('Failed to dispatch', error);
            alert('Failed to dispatch order');
        } finally {
            setDispatching(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">Order Details #{order.id}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Status Section */}
                    <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
                        <div>
                            <span className="text-sm text-gray-500 block mb-1">Current Status</span>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                                {order.status}
                            </span>
                        </div>
                        <div className="flex-1 text-right">
                            <label className="text-sm text-gray-700 font-medium mr-2">Update Status:</label>
                            <select
                                value={order.status}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                disabled={updating || dispatching}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="PENDING">PENDING</option>
                                <option value="CONFIRMED">CONFIRMED</option>
                                <option value="SHIPPED">SHIPPED</option>
                                <option value="DELIVERED">DELIVERED</option>
                            </select>
                        </div>
                    </div>

                    {/* Order Meta */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="text-sm text-gray-500">Date Placed</span>
                            <div className="font-medium text-gray-900">{new Date(order.createdAt).toLocaleString()}</div>
                        </div>
                        <div>
                            <span className="text-sm text-gray-500">Total Amount</span>
                            <div className="font-bold text-lg text-gray-900">${order.totalAmount.toFixed(2)}</div>
                        </div>
                    </div>

                    {/* Shipping Address Display */}
                    {order.shippingAddressId && (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h4 className="text-sm font-semibold text-gray-700 uppercase mb-2">Shipping Address</h4>
                            <AddressDisplay userId={order.userId} addressId={order.shippingAddressId} />
                        </div>
                    )}

                    {/* Items Table */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Items</h3>
                        <div className="border rounded-lg overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-700 font-medium">
                                    <tr>
                                        <th className="py-2 px-4">Product ID</th>
                                        <th className="py-2 px-4">Product Name</th>
                                        <th className="py-2 px-4 text-center">Qty</th>
                                        <th className="py-2 px-4 text-right">Price</th>
                                        <th className="py-2 px-4 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {order.items.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="py-2 px-4 text-gray-900">{item.productId}</td>
                                            <td className="py-2 px-4 text-gray-900">{item.name || item.productName || `Product ${item.productId}`}</td>
                                            <td className="py-2 px-4 text-center text-gray-900">{item.quantity}</td>
                                            <td className="py-2 px-4 text-right text-gray-900">${item.priceAtPurchase.toFixed(2)}</td>
                                            <td className="py-2 px-4 text-right font-medium text-gray-900">${(item.priceAtPurchase * item.quantity).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                    <div>
                        {order.status !== 'SHIPPED' && order.status !== 'DELIVERED' && (
                            <button
                                onClick={handleDispatch}
                                disabled={dispatching || updating}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 disabled:opacity-50"
                            >
                                {dispatching ? 'Dispatching...' : 'Dispatch to Distributor'}
                                {!dispatching && (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                                    </svg>
                                )}
                            </button>
                        )}
                    </div>
                    <button onClick={onClose} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

function AddressDisplay({ userId, addressId }: { userId: string, addressId: string }) {
    const [address, setAddress] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        ApiClient.getShippingAddresses(userId).then(addrs => {
            if (mounted) {
                const found = addrs.find(a => a.id === addressId);
                setAddress(found);
            }
        }).catch(err => console.error(err)).finally(() => {
            if (mounted) setLoading(false);
        });
        return () => { mounted = false; };
    }, [userId, addressId]);

    if (loading) return <span className="text-xs text-gray-500">Loading address...</span>;
    if (!address) return <span className="text-xs text-red-400">Address not found ({addressId})</span>;

    return (
        <div className="text-sm text-gray-700">
            <p className="font-medium">{address.streetAddress}</p>
            <p>{address.city}, {address.state} {address.zipCode}</p>
            <p className="text-xs text-gray-500">{address.country}</p>
        </div>
    );
}
