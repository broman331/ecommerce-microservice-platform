import { ApiClient, EnrichedProduct } from '@/lib/api';
import Link from 'next/link';
import RecentOrders from '@/components/RecentOrders';
import PromotionsSection from '@/components/PromotionsSection';
import ActiveCarts from '@/components/ActiveCarts';
import InventoryTable from '@/components/InventoryTable';
import DashboardCard from '@/components/DashboardCard';
import { Plus } from 'lucide-react';

export default async function Dashboard() {
  let products: EnrichedProduct[] = [];
  try {
    products = await ApiClient.getEnrichedProducts();
  } catch (e) {
    console.error("Failed to load products", e);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>

      {/* Key Metrics Section */}
      <DashboardCard title="Key Metrics" defaultExpanded={true}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">Low Stock Items</div>
            <div className="text-2xl font-bold text-gray-900">
              {products.filter(p => p.stock <= 10).length}
            </div>
            <div className="text-xs text-blue-600 mt-2 flex items-center gap-1">
              Alert threshold: 10
            </div>
          </div>
        </div>
      </DashboardCard>

      {/* Inventory Status Section */}
      <DashboardCard
        title="Inventory Status"
        defaultExpanded={true}
        actions={
          <div className="flex gap-2">
            <Link href="/products" className="text-sm text-blue-600 hover:text-blue-800 font-medium px-2 py-1">View Full Catalog</Link>
            <Link href="/admin/products/new" className="flex items-center text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition">
              <Plus size={16} className="mr-1" /> Add Product
            </Link>
          </div>
        }
      >
        <InventoryTable products={products} />
      </DashboardCard>

      {/* Recent Orders Section */}
      <DashboardCard title="Recent Orders" defaultExpanded={false}>
        <RecentOrders />
      </DashboardCard>

      {/* Active Carts Section */}
      <DashboardCard title="Active Carts" defaultExpanded={false}>
        <ActiveCarts />
      </DashboardCard>

      {/* Promotions Section */}
      <DashboardCard title="Active Promotions" defaultExpanded={false}>
        <PromotionsSection />
      </DashboardCard>
    </div>
  );
}
