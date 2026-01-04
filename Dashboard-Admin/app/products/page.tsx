import { ApiClient, EnrichedProduct } from '@/lib/api';
import Link from 'next/link';
import ToggleSwitch from '@/components/ToggleSwitch';

export default async function ProductsPage() {
    let products: EnrichedProduct[] = [];
    let error = null;

    try {
        products = await ApiClient.getEnrichedProducts();
    } catch (e) {
        console.error(e);
        error = "Failed to load products. Ensure Product Service (3004) is running.";
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="mb-8">
                <Link href="/" className="text-blue-600 hover:underline">&larr; Back to Dashboard</Link>
            </div>

            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Product Catalog</h1>
                <p className="text-gray-600">Browsable items with real-time order stats.</p>
            </header>

            {error ? (
                <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(product => (
                        <Link href={`/products/${product.id}`} key={product.id} className="block group relative">
                            <div className={`bg-white p-6 rounded-xl shadow-sm border transition group-hover:shadow-md ${product.enabled ? 'border-gray-100' : 'border-red-100 bg-red-50'}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600">{product.name}</h2>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className="font-bold text-lg text-gray-900">${product.price}</span>
                                        <ToggleSwitch productId={product.id} initialEnabled={product.enabled} />
                                    </div>
                                </div>
                                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                                {!product.enabled && <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">Disabled</div>}
                                <div className="flex justify-between items-center text-sm">
                                    <span className={`px-2 py-1 rounded ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
                                    </span>
                                    <span className="text-gray-600">
                                        {product.totalOrders} orders
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
