import { ApiClient } from '@/lib/api';
import Link from 'next/link';

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const order = await ApiClient.getOrder(id);

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <Link href="/" className="text-blue-600 hover:underline">&larr; Back to Dashboard</Link>
                <div className="mt-4 text-red-600">Order not found.</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="mb-8">
                <Link href="/" className="text-blue-600 hover:underline">&larr; Back to Dashboard</Link>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-6 pb-6 border-b">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Order #{order.id}</h1>
                        <p className="text-gray-500 text-sm">Placed on {new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${order.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                            {order.status}
                        </span>
                    </div>
                </div>

                <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-4">Items</h2>
                    <div className="space-y-4">
                        {order.items.map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center py-2 border-b last:border-0 border-gray-50">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
                                        IMG
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{item.name || item.productName || `Product ${item.productId}`}</p>
                                        <p className="text-xs text-gray-400">ID: {item.productId}</p>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                                <p className="font-medium">${item.priceAtPurchase * item.quantity}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Total Amount</p>
                        <p className="text-2xl font-bold text-gray-900">${order.totalAmount}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
