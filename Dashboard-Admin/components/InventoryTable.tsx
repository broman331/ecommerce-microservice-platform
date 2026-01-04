"use client";

import { useState } from "react";
import Link from "next/link";
import { EnrichedProduct } from "@/lib/api";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface InventoryTableProps {
    products: EnrichedProduct[];
}

export default function InventoryTable({ products }: InventoryTableProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const totalPages = Math.ceil(products.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProducts = products.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1); // Reset to first page when changing limit
    };

    return (
        <div className="flex flex-col gap-4">
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
                        {currentProducts.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50 transition-colors cursor-pointer group">
                                <td className="py-3 px-4 font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                    <Link href={`/products/${product.id}`} className="hover:underline">
                                        {product.name}
                                    </Link>
                                </td>
                                <td className="py-3 px-4 text-gray-700">${product.price}</td>
                                <td className="py-3 px-4 text-gray-700">{product.stock}</td>
                                <td className="py-3 px-4 text-gray-700">{product.totalOrders}</td>
                                <td className="py-3 px-4 text-gray-700">
                                    {product.lastOrderedAt
                                        ? new Date(product.lastOrderedAt).toLocaleDateString()
                                        : "Never"}
                                </td>
                                <td className="py-3 px-4">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-semibold ${product.stock > 10
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {product.stock > 10 ? "In Stock" : "Low Stock"}
                                    </span>
                                </td>
                            </tr>
                        ))}
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
                        Showing {startIndex + 1}-{Math.min(endIndex, products.length)} of {products.length}
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
                                // Simple pagination logic for now - allows showing a window of pages
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
        </div>
    );
}
