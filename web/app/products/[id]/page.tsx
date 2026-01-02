import { ApiClient } from '@/lib/api';
import Link from 'next/link';
import ToggleSwitch from '@/components/ToggleSwitch';
import ProductActions from '@/components/ProductActions';

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    // Await the params to extract id
    const { id } = await params;

    let product = null;
    let error = null;

    try {
        product = await ApiClient.getEnrichedProduct(id);
    } catch (e) {
        error = "Product not found or service unavailable.";
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <Link href="/products" className="text-blue-600 hover:underline mb-4 block">&larr; Back to Catalog</Link>
                <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error || 'Unknown error'}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="mb-8">
                <Link href="/products" className="text-blue-600 hover:underline">&larr; Back to Catalog</Link>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
                            <div className="flex flex-col items-end gap-2">
                                <ToggleSwitch productId={product.id} initialEnabled={product.enabled} />
                                <span className={`text-xs ${product.enabled ? 'text-green-600' : 'text-red-500'}`}>
                                    {product.enabled ? 'Visible' : 'Hidden'}
                                </span>
                            </div>
                        </div>
                        <p className="text-2xl text-blue-600 font-bold mb-6">${product.price}</p>

                        <div className="prose text-gray-600 mb-8">
                            <p>{product.description}</p>
                        </div>

                        <div className="mt-8">
                            <ProductActions productId={product.id} />
                        </div>
                    </div>

                    <div className="w-full md:w-80 bg-gray-50 p-6 rounded-lg h-fit">
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Inventory & Stats</h3>

                        <div className="space-y-4">
                            <div>
                                <span className="block text-xs text-gray-500 mb-1">Stock Level</span>
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${product.stock > 10 ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                                    <span className="font-medium">{product.stock} units available</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-200">
                                <span className="block text-xs text-gray-500 mb-1">Sales Performance</span>
                                <p className="font-medium">{product.totalOrders} total orders</p>
                                {product.lastOrderedAt && (
                                    <p className="text-xs text-gray-400 mt-1">Last ordered: {new Date(product.lastOrderedAt).toLocaleDateString()}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
