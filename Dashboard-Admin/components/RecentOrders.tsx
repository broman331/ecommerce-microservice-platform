'use client';

import { useState, useEffect } from 'react';
import { ApiClient, Order, User } from '@/lib/api';
import OrderDetailsModal from './OrderDetailsModal';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

export default function RecentOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<string>('all');
    const [selectedPeriod, setSelectedPeriod] = useState<string>('last_month');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

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

    // Pagination calculations
    const totalPages = Math.ceil(orders.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentOrders = orders.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-2 gap-4">
                <div></div> {/* Spacer or Title if needed inside the card content, but card has header */}
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
                <>
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
                                {currentOrders.map((order) => {
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

                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>Show</span>
                            <select
                                value={itemsPerPage}
                                onChange={handleItemsPerPageChange}
                                className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                            <span>items per page</span>
                            <span className="ml-2 text-gray-400 border-l border-gray-200 pl-2">
                                Showing {startIndex + 1}-{Math.min(endIndex, orders.length)} of {orders.length}
                            </span>
                        </div>

                        {totalPages > 1 && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handlePageChange(1)}
                                    disabled={currentPage === 1}
                                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
                                    title="First Page"
                                >
                                    <ChevronsLeft size={20} />
                                </button>
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
                                    title="Previous Page"
                                >
                                    <ChevronLeft size={20} />
                                </button>

                                <div className="flex items-center gap-1">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum = i + 1;
                                        if (totalPages > 5) {
                                            if (currentPage > 3) {
                                                pageNum = currentPage - 2 + i;
                                            }
                                            // Adjust if we are near the end
                                            if (currentPage > totalPages - 2) {
                                                pageNum = totalPages - 4 + i;
                                            }
                                        }

                                        if (pageNum > totalPages || pageNum < 1) return null;

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => handlePageChange(pageNum)}
                                                className={`w-8 h-8 rounded flex items-center justify-center text-sm font-medium transition-colors ${currentPage === pageNum
                                                    ? "bg-blue-600 text-white"
                                                    : "hover:bg-gray-100 text-gray-700"
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
                                    title="Next Page"
                                >
                                    <ChevronRight size={20} />
                                </button>
                                <button
                                    onClick={() => handlePageChange(totalPages)}
                                    disabled={currentPage === totalPages}
                                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
                                    title="Last Page"
                                >
                                    <ChevronsRight size={20} />
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}

            {selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onUpdate={() => {
                        fetchOrders();
                    }}
                />
            )}
        </div>
    );
}
