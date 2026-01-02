'use client';

import { useState, useEffect } from 'react';
import { ApiClient, Order, User } from '@/lib/api';
import OrderDetailsModal from './OrderDetailsModal';

export default function RecentOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<string>('all');
    const [selectedPeriod, setSelectedPeriod] = useState<string>('last_month');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    // ... (keep useEffects same) ...
    // Note: I will replace the component body to insert the modal and button nicely

    useEffect(() => {
        // Fetch users for filter
        ApiClient.getCustomers()
            .then(setUsers)
            .catch(err => console.error("Failed to load users", err));
    }, []);

    const fetchOrders = () => {
        setLoading(true);
        setError(null);
        ApiClient.searchOrders({
            userId: selectedUser === 'all' ? undefined : selectedUser,
            period: selectedPeriod
        })
            .then(setOrders)
            .catch(err => {
                console.error(err);
                setError(err.message || 'Failed to load orders');
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchOrders();
    }, [selectedUser, selectedPeriod]);

    return (
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>

                <div className="flex gap-4">
                    {/* User Filter */}
                    <select
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                        className="bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Users</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>{user.name}</option>
                        ))}
                    </select>

                    {/* Period Filter */}
                    <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="last_day">Last 24 Hours</option>
                        <option value="last_week">Last Week</option>
                        <option value="last_month">Last Month</option>
                        <option value="last_year">Last Year</option>
                    </select>
                </div>
            </div>

            {error ? (
                <div className="text-center py-8 text-red-500 bg-red-50 rounded-lg">
                    <p className="font-semibold">Error loading orders</p>
                    <p className="text-sm">{error}</p>
                    <button onClick={() => window.location.reload()} className="mt-2 text-blue-600 hover:underline text-sm">Retry</button>
                </div>
            ) : loading ? (
                <div className="text-center py-8 text-gray-400">Loading orders...</div>
            ) : orders.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                    No orders found for this period.
                    <br />
                    <span className="text-xs text-gray-300">(Try "Last Year" or checks console for network errors)</span>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 text-sm text-gray-500">
                                    <th className="py-3 font-medium">Order ID</th>
                                    <th className="py-3 font-medium">User</th>
                                    <th className="py-3 font-medium">Date</th>
                                    <th className="py-3 font-medium">Total</th>
                                    <th className="py-3 font-medium">Status</th>
                                    <th className="py-3 font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-gray-50">
                                {orders.map((order) => {
                                    const user = users.find(u => u.id === order.userId);
                                    return (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-3 px-4 font-medium text-gray-900">{order.id}</td>
                                            <td className="py-3 px-4 text-gray-600">
                                                {user ? user.name : `User ${order.userId}`}
                                            </td>
                                            <td className="py-3 px-4 text-gray-500">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="py-3 px-4 font-medium text-gray-900">
                                                ${order.totalAmount}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                                                    order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="text-blue-600 hover:underline font-medium"
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onUpdate={() => {
                        fetchOrders();
                        // Also update the selected order to show new status immediately if we didn't close
                        // Since fetchOrders is async, we trust the modal updated its internal state or we refetch.
                        // Ideally we might reload selectedOrder.
                    }}
                />
            )}
        </section>
    );
}
