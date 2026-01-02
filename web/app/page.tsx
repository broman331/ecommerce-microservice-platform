import { ApiClient, EnrichedProduct } from '@/lib/api';
import Link from 'next/link';
import RecentOrders from '@/components/RecentOrders';
import PromotionsSection from '@/components/PromotionsSection';
import ActiveCarts from '@/components/ActiveCarts';

export default async function Dashboard() {
  let products: EnrichedProduct[] = [];
  try {
    products = await ApiClient.getEnrichedProducts();
  } catch (e) {
    console.error("Failed to load products", e);
  }

  return (
    <div className="min-h-screen bg-gray-50 font-[family-name:var(--font-geist-sans)]">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              A
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Antigravity
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 border-2 border-white shadow-sm"></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Stats Cards - Simplified for now */}
          {/* ... existing stats ... */}
          {/* Placeholder for real stats */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">Total Revenue</div>
            <div className="text-2xl font-bold text-gray-900">$45,231.89</div>
            <div className="text-xs text-green-600 mt-2 flex items-center gap-1">
              ↑ 20.1% from last month
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">Active Orders</div>
            <div className="text-2xl font-bold text-gray-900">+573</div>
            <div className="text-xs text-green-600 mt-2 flex items-center gap-1">
              ↑ 201 since last week
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">Pending Shipment</div>
            <div className="text-2xl font-bold text-gray-900">12</div>
            <div className="text-xs text-red-600 mt-2 flex items-center gap-1">
              ↓ Needs attention
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Inventory Status</h2>
            <div className="flex items-center gap-4">
              <Link href="/products" className="text-blue-600 hover:text-blue-800 font-semibold">View Catalog</Link>
              <span className="text-gray-300">|</span>
              <Link href="/admin/customers" className="text-blue-600 hover:text-blue-800 font-semibold">Customers</Link>
              <span className="text-gray-300">|</span>
              <Link href="/admin/products/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold text-sm">
                + Add Product
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 font-medium">
                <tr>
                  <th className="py-3 px-4 rounded-l-lg">Product Name</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Total Orders</th>
                  <th className="py-3 px-4">Last Ordered</th>
                  <th className="py-3 px-4 rounded-r-lg">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors cursor-pointer group">
                    <td className="py-3 px-4 font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      <Link href={`/products/${product.id}`} className="hover:underline">
                        {product.name}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-gray-500">${product.price}</td>
                    <td className="py-3 px-4 text-gray-500">{product.stock}</td>
                    <td className="py-3 px-4 text-gray-500">{product.totalOrders}</td>
                    <td className="py-3 px-4 text-gray-500">{product.lastOrderedAt ? new Date(product.lastOrderedAt).toLocaleDateString() : 'Never'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${product.stock > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {product.stock > 10 ? 'In Stock' : 'Low Stock'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Recent Orders Section */}
        <RecentOrders />

        {/* Active Carts */}
        <ActiveCarts />

        {/* Promotions Section */}
        <PromotionsSection />
      </main>
    </div>
  );
}
