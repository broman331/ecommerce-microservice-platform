'use client';

import { useState, useEffect } from 'react';
import { ApiClient, Cart, Promotion } from '@/lib/api';

export default function ActiveCarts() {
    const [carts, setCarts] = useState<Cart[]>([]);
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [addresses, setAddresses] = useState<Record<string, any[]>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [cartsData, promotionsData] = await Promise.all([
                    ApiClient.getAllCarts(),
                    ApiClient.getPromotions()
                ]);
                setCarts(cartsData);
                setPromotions(promotionsData.filter(p => p.enabled));

                // Fetch addresses for all customers in carts
                const addrMap: Record<string, any[]> = {};
                await Promise.all(cartsData.map(async (cart) => {
                    try {
                        const userAddresses = await ApiClient.getShippingAddresses(cart.customerId);
                        addrMap[cart.customerId] = userAddresses;
                    } catch (e) {
                        console.warn(`Failed to load addresses for ${cart.customerId}`, e);
                        addrMap[cart.customerId] = [];
                    }
                }));
                setAddresses(addrMap);

            } catch (error) {
                console.error("Failed to load data", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleCheckout = async (customerId: string) => {
        if (!confirm('Are you sure you want to place this order?')) return;

        try {
            await ApiClient.checkout(customerId);
            alert('Order placed successfully!');
            // Remove the cart from the UI
            setCarts(prev => prev.filter(c => c.customerId !== customerId));
            // Trigger a reload of recent orders if possible, or user handles refresh
        } catch (error) {
            console.error(error);
            alert('Failed to place order.');
        }
    };

    const handleApplyPromotion = async (customerId: string, code: string) => {
        if (!code) return;
        try {
            await ApiClient.applyPromotion(customerId, code);
            alert('Promotion applied!');
            // Refresh carts
            const updatedCarts = await ApiClient.getAllCarts();
            setCarts(updatedCarts);
        } catch (error: any) {
            console.error(error);
            alert(error.message || 'Failed to apply promotion');
        }
    };

    const handleSetAddress = async (customerId: string, addressId: string) => {
        try {
            await ApiClient.setCartAddress(customerId, addressId);
            // Update local state deeply to reflect change without full reload
            setCarts(prev => prev.map(c =>
                c.customerId === customerId ? { ...c, shippingAddressId: addressId } : c
            ));
        } catch (error) {
            console.error(error);
            alert('Failed to select shipping address');
        }
    };

    if (loading) return <div className="text-gray-400 text-sm">Loading carts...</div>;
    if (carts.length === 0) return null;

    return (
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Active Shopping Carts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {carts.map(cart => (
                    <div key={cart.customerId} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-100">
                                <span className="font-semibold text-gray-700">User ID: {cart.customerId}</span>
                                <div className="text-right">
                                    {cart.discountAmount && cart.discountAmount > 0 ? (
                                        <>
                                            <span className="block text-xs text-red-500 line-through">${(cart.totalPrice + cart.discountAmount).toFixed(2)}</span>
                                            <span className="text-sm font-bold text-green-600">${cart.totalPrice.toFixed(2)}</span>
                                        </>
                                    ) : (
                                        <span className="text-sm font-bold text-blue-600">${cart.totalPrice.toFixed(2)}</span>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2 mb-4">
                                {cart.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between text-sm">
                                        <span className="text-gray-600 truncate flex-1 pr-2">
                                            {item.quantity}x {item.name}
                                        </span>
                                        <span className="text-gray-500 font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Shipping Address Section */}
                            <div className="mb-4 pt-3 border-t border-gray-100">
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Shipping Address</label>
                                {addresses[cart.customerId] && addresses[cart.customerId].length > 0 ? (
                                    <select
                                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-white text-gray-700"
                                        value={cart.shippingAddressId || ""}
                                        onChange={(e) => handleSetAddress(cart.customerId, e.target.value)}
                                    >
                                        <option value="" disabled>Select Address...</option>
                                        {addresses[cart.customerId].map((addr: any) => (
                                            <option key={addr.id} value={addr.id}>
                                                {addr.streetAddress}, {addr.city}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <p className="text-xs text-red-400 italic">No addresses found (Add in Customer Details)</p>
                                )}
                            </div>

                            {/* Promotion Section */}
                            <div className="mb-4 pt-3 border-t border-gray-100">
                                {cart.promotionCode ? (
                                    <div className="flex justify-between items-center bg-green-50 p-2 rounded text-xs text-green-700">
                                        <span>Code: <b>{cart.promotionCode}</b></span>
                                        <span>-${cart.discountAmount?.toFixed(2)}</span>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <select
                                            onChange={(e) => {
                                                if (e.target.value) {
                                                    handleApplyPromotion(cart.customerId, e.target.value);
                                                    e.target.value = ''; // Reset select
                                                }
                                            }}
                                            className="flex-1 border border-gray-300 rounded px-2 py-1 text-xs text-gray-900 bg-white"
                                            defaultValue=""
                                        >
                                            <option value="" disabled>Select Promotion</option>
                                            {promotions.map(p => (
                                                <option key={p.code} value={p.code}>
                                                    {p.code} ({p.type === 'PERCENTAGE' ? `${p.value}%` : `$${p.value}`})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="mt-2 pt-2 border-t border-gray-100 flex justify-end">
                            <button
                                onClick={() => handleCheckout(cart.customerId)}
                                className="text-sm bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 transition"
                            >
                                Place Order
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
