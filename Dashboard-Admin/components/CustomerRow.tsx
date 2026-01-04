'use client';

import { useState } from 'react';
import { ApiClient, Order, User } from '@/lib/api';

interface CustomerRowProps {
    customer: User;
}

interface CustomerDetails extends User {
    orders: Order[];
    wishlist?: {
        products: { productId: string, addedAt: string }[]
    };
    addresses?: any[];
}

export default function CustomerRow({ customer }: CustomerRowProps) {
    const [expanded, setExpanded] = useState(false);
    const [details, setDetails] = useState<CustomerDetails | null>(null);
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<Record<string, any>>({}); // quick cache for product names

    const toggleExpand = async () => {
        if (expanded) {
            setExpanded(false);
            return;
        }

        setExpanded(true);
        if (!details) {
            setLoading(true);
            try {
                // Fetch Details and Addresses (Graceful degradation for Shipping)
                const customerData = await ApiClient.getCustomerDetails(customer.id);
                let addressData: any[] = [];

                try {
                    addressData = await ApiClient.getShippingAddresses(customer.id);
                } catch (err) {
                    console.warn("Failed to fetch shipping addresses", err);
                }

                setDetails({ ...customerData, addresses: addressData });

                // Fetch Product Info for Wishlist (Optimistic/Lazy)
                const allProducts = await ApiClient.getEnrichedProducts().catch(() => []);
                const productMap: Record<string, any> = {};
                allProducts.forEach(p => productMap[p.id] = p);
                setProducts(productMap);

            } catch (error) {
                console.error("Failed to fetch details", error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <>
            <tr onClick={toggleExpand} className="hover:bg-gray-50 group cursor-pointer border-b border-gray-100 last:border-0">
                <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
                    <span className={`transform transition-transform ${expanded ? 'rotate-90' : ''}`}>
                        ▶
                    </span>
                    <span className="group-hover:text-blue-600 transition-colors">{customer.name}</span>
                </td>
                <td className="px-6 py-4 text-gray-600">{customer.email}</td>
                <td className="px-6 py-4 text-gray-500 text-sm">{new Date(customer.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                    <button className="text-blue-600 font-medium hover:underline text-sm">
                        {expanded ? 'Hide Details' : 'View Details'}
                    </button>
                </td>
            </tr>
            {expanded && (
                <tr className="bg-gray-50 border-b border-gray-100">
                    <td colSpan={4} className="p-6">
                        {loading ? (
                            <div className="text-gray-400 text-center py-4">Loading details...</div>
                        ) : details ? (
                            <div className="space-y-6 animate-in slide-in-from-top-2 duration-300">
                                {/* Order History */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Order History</h3>
                                    {!details.orders || details.orders.length === 0 ? (
                                        <p className="text-gray-500 text-sm italic">No orders found.</p>
                                    ) : (
                                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                            <table className="w-full text-sm">
                                                <thead className="bg-gray-50 text-gray-600 font-medium">
                                                    <tr>
                                                        <th className="px-4 py-2 text-left">ID</th>
                                                        <th className="px-4 py-2 text-left">Date</th>
                                                        <th className="px-4 py-2 text-left">Total</th>
                                                        <th className="px-4 py-2 text-left">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {(details.orders || []).slice(0, 5).map(order => (
                                                        <tr key={order.id}>
                                                            <td className="px-4 py-2 text-gray-900">{order.id}</td>
                                                            <td className="px-4 py-2 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                                                            <td className="px-4 py-2 text-gray-900 font-medium">${order.totalAmount}</td>
                                                            <td className="px-4 py-2">
                                                                <span className={`px-2 py-0.5 rounded text-xs ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                                                    }`}>
                                                                    {order.status}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            {details.orders.length > 5 && (
                                                <div className="px-4 py-2 bg-gray-50 text-xs text-center text-gray-500 border-t border-gray-200">
                                                    + {details.orders.length - 5} older orders
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Wishlist */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Wishlist</h3>
                                    {!details.wishlist || details.wishlist.products.length === 0 ? (
                                        <p className="text-gray-500 text-sm italic">Wishlist is empty.</p>
                                    ) : (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {details.wishlist.products.map((item, idx) => {
                                                const product = products[item.productId];
                                                return (
                                                    <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
                                                            IMG
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900 text-sm truncate w-32">
                                                                {product ? product.name : `Product ${item.productId}`}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {product ? `$${product.price}` : 'Item'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Shipping Addresses */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Shipping Addresses</h3>
                                    {!details.addresses || details.addresses.length === 0 ? (
                                        <p className="text-gray-500 text-sm italic">No addresses found.</p>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {details.addresses.map((addr: any) => (
                                                <div key={addr.id} className="p-3 border rounded text-sm text-gray-600 bg-gray-50">
                                                    <p className="font-medium">{addr.streetAddress}</p>
                                                    <p>{addr.city}, {addr.state} {addr.zipCode}</p>
                                                    <p className="text-xs text-gray-500">{addr.country}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="text-red-500 text-center py-4">Failed to load details.</div>
                        )}
                    </td>
                </tr>
            )}
        </>
    );
}
