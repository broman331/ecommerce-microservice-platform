'use client';

import { useState, useEffect } from 'react';
import { ApiClient, Promotion } from '@/lib/api';

export default function PromotionsSection() {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newPromo, setNewPromo] = useState<Partial<Promotion>>({
        type: 'PERCENTAGE',
        enabled: true
    });

    useEffect(() => {
        loadPromotions();
    }, []);

    const loadPromotions = () => {
        setLoading(true);
        ApiClient.getPromotions()
            .then(setPromotions)
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    const handleToggle = async (code: string) => {
        try {
            await ApiClient.togglePromotion(code);
            // Optimistic update or reload
            setPromotions(prev => prev.map(p =>
                p.code === code ? { ...p, enabled: !p.enabled } : p
            ));
        } catch (error) {
            console.error("Failed to toggle promotion", error);
            alert("Failed to toggle promotion");
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!newPromo.code || !newPromo.value) return;

            await ApiClient.createPromotion({
                code: newPromo.code,
                type: newPromo.type as 'PERCENTAGE' | 'FIXED_AMOUNT',
                value: Number(newPromo.value),
                minOrderValue: newPromo.minOrderValue ? Number(newPromo.minOrderValue) : undefined,
                enabled: true
            });
            setIsCreating(false);
            setNewPromo({ type: 'PERCENTAGE', enabled: true });
            loadPromotions();
        } catch (error) {
            console.error("Failed to create promotion", error);
            alert("Failed to create promotion");
        }
    };

    return (
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Promotions</h2>
                <button
                    onClick={() => setIsCreating(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium text-sm"
                >
                    + Add Promotion
                </button>
            </div>

            {/* Create Modal/Form (Inline for simplicity) */}
            {isCreating && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="text-sm font-bold text-gray-700 mb-3">New Promotion</h3>
                    <form onSubmit={handleCreate} className="flex flex-wrap gap-4 items-end">
                        <div className="w-full sm:w-auto">
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Code</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. SUMMER25"
                                className="bg-white text-gray-900 border border-gray-300 rounded px-3 py-2 text-sm w-full uppercase focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                value={newPromo.code || ''}
                                onChange={e => setNewPromo({ ...newPromo, code: e.target.value.toUpperCase() })}
                            />
                        </div>
                        <div className="w-full sm:w-auto">
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Type</label>
                            <select
                                className="bg-white text-gray-900 border border-gray-300 rounded px-3 py-2 text-sm w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                value={newPromo.type}
                                onChange={e => setNewPromo({ ...newPromo, type: e.target.value as any })}
                            >
                                <option value="PERCENTAGE">Percentage (%)</option>
                                <option value="FIXED_AMOUNT">Fixed Amount ($)</option>
                            </select>
                        </div>
                        <div className="w-full sm:w-24">
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Value</label>
                            <input
                                type="number"
                                required
                                min="0"
                                className="bg-white text-gray-900 border border-gray-300 rounded px-3 py-2 text-sm w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                value={newPromo.value || ''}
                                onChange={e => setNewPromo({ ...newPromo, value: Number(e.target.value) })}
                            />
                        </div>
                        <div className="w-full sm:w-32">
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Min Order ($)</label>
                            <input
                                type="number"
                                min="0"
                                className="bg-white text-gray-900 border border-gray-300 rounded px-3 py-2 text-sm w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                value={newPromo.minOrderValue || ''}
                                onChange={e => setNewPromo({ ...newPromo, minOrderValue: Number(e.target.value) })}
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsCreating(false)}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 text-sm"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <div className="text-gray-400 text-center py-4">Loading promotions...</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
                            <tr>
                                <th className="py-3 px-4">Code</th>
                                <th className="py-3 px-4">Type</th>
                                <th className="py-3 px-4">Value</th>
                                <th className="py-3 px-4">Min Order</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {promotions.map((promo) => (
                                <tr key={promo.code} className={`group ${!promo.enabled ? 'bg-gray-50 opacity-75' : 'hover:bg-gray-50'}`}>
                                    <td className="py-3 px-4 font-mono font-medium text-blue-600">{promo.code}</td>
                                    <td className="py-3 px-4 text-gray-600">
                                        {promo.type === 'PERCENTAGE' ? 'Percentage' : 'Fixed Amount'}
                                    </td>
                                    <td className="py-3 px-4 font-medium text-gray-900">
                                        {promo.type === 'PERCENTAGE' ? `${promo.value}%` : `$${promo.value}`}
                                    </td>
                                    <td className="py-3 px-4 text-gray-500">
                                        {promo.minOrderValue ? `$${promo.minOrderValue}` : '-'}
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${promo.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                                            }`}>
                                            {promo.enabled ? 'Active' : 'Disabled'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <button
                                            onClick={() => handleToggle(promo.code)}
                                            className={`text-xs font-medium px-3 py-1 rounded border transition-colors ${promo.enabled
                                                ? 'border-red-200 text-red-600 hover:bg-red-50'
                                                : 'border-green-200 text-green-600 hover:bg-green-50'
                                                }`}
                                        >
                                            {promo.enabled ? 'Disable' : 'Enable'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}
