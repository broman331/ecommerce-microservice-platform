import { ApiClient } from '@/lib/api';
import Link from 'next/link';

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    let customer: any = null;
    let error = null;

    try {
        customer = await ApiClient.getCustomerDetails(id);
    } catch (e) {
        error = "Customer not found";
    }

    if (!customer) {
        return <div className="p-8">Customer not found</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <Link href="/admin/customers" className="text-blue-600 hover:underline mb-8 block">&larr; Back to Customers</Link>

            <div className="flex gap-8 flex-col lg:flex-row">
                {/* Profile Card */}
                <div className="w-full lg:w-1/3">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold mb-4">
                            {customer.name.charAt(0)}
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">{customer.name}</h1>
                        <p className="text-gray-500 mb-6">{customer.email}</p>

                        <div className="border-t border-gray-100 pt-4 space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Member Since</span>
                                <span className="font-medium">{new Date(customer.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Customer ID</span>
                                <span className="font-mono text-sm">{customer.id}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Orders List */}
                <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Order History</h2>
                    {customer.orders && customer.orders.length > 0 ? (
                        <div className="space-y-4">
                            {customer.orders.map((order: any) => (
                                <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="text-sm text-gray-500 mb-1">Order #{order.id}</div>
                                            <div className="font-semibold text-lg">${order.totalAmount}</div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                                                order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {order.items.length} items • Placed on {new Date(order.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-gray-500">
                            No orders found for this customer.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
