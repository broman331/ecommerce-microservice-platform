import { ApiClient, User } from '@/lib/api';
import Link from 'next/link';
import CustomerRow from '@/components/CustomerRow';

export default async function CustomersPage() {
    let customers: User[] = [];
    try {
        customers = await ApiClient.getCustomers();
    } catch (e) {
        console.error(e);
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <Link href="/" className="text-blue-600 hover:underline mb-2 block">&larr; Back to Dashboard</Link>
                    <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
                    <p className="text-gray-600">Prepare for data analysis</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-900">Name</th>
                            <th className="px-6 py-4 font-semibold text-gray-900">Email</th>
                            <th className="px-6 py-4 font-semibold text-gray-900">Joined</th>
                            <th className="px-6 py-4 font-semibold text-gray-900">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {customers.map((c) => (
                            <CustomerRow key={c.id} customer={c} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
