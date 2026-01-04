'use client';

import { useState, useEffect } from 'react';
import { ApiClient, User } from '@/lib/api';

interface ProductActionsProps {
    productId: string;
}

export default function ProductActions({ productId }: ProductActionsProps) {
    const [loadingCart, setLoadingCart] = useState(false);
    const [loadingWishlist, setLoadingWishlist] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string>('');

    useEffect(() => {
        ApiClient.getCustomers()
            .then(data => {
                setUsers(data);
                if (data.length > 0) setSelectedUserId(data[0].id);
            })
            .catch(console.error);
    }, []);

    const handleAddToCart = async () => {
        if (!selectedUserId) {
            alert('Please select a user first');
            return;
        }
        setLoadingCart(true);
        try {
            await ApiClient.addToCart(selectedUserId, productId, 1);
            alert('Product added to cart!');
        } catch (error) {
            console.error(error);
            alert('Failed to add to cart.');
        } finally {
            setLoadingCart(false);
        }
    };

    const handleAddToWishlist = async () => {
        if (!selectedUserId) {
            alert('Please select a user first');
            return;
        }
        setLoadingWishlist(true);
        try {
            await ApiClient.addToWishlist(selectedUserId, productId);
            alert('Product added to wishlist!');
        } catch (error) {
            console.error(error);
            alert('Failed to add to wishlist.');
        } finally {
            setLoadingWishlist(false);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="w-full max-w-xs">
                <label className="block text-sm font-medium text-gray-700 mb-1">Select User</label>
                <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {users.map(user => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                </select>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={handleAddToCart}
                    disabled={loadingCart || !selectedUserId}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {loadingCart ? 'Adding...' : 'Add to Cart'}
                </button>
                <button
                    onClick={handleAddToWishlist}
                    disabled={loadingWishlist || !selectedUserId}
                    className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loadingWishlist ? 'Adding...' : 'Add to Wishlist'}
                </button>
            </div>
        </div>
    );
}
