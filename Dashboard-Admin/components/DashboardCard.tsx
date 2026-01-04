"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, MoreHorizontal } from "lucide-react";
import clsx from "clsx";

interface DashboardCardProps {
    title: string;
    children: React.ReactNode;
    actions?: React.ReactNode;
    defaultExpanded?: boolean;
}

export default function DashboardCard({
    title,
    children,
    actions,
    defaultExpanded = false,
}: DashboardCardProps) {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    return (
        <div
            className={clsx(
                "bg-white rounded-xl border border-gray-200 shadow-sm transition-all duration-200 overflow-hidden",
                "hover:shadow-md"
            )}
        >
            <div
                className="flex items-center justify-between p-4 cursor-pointer bg-gray-50/50 hover:bg-gray-50"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <div className="flex items-center space-x-2">
                    {actions && (
                        <div
                            className="flex items-center space-x-2 mr-2"
                            onClick={(e) => e.stopPropagation()} // Prevent expansion when clicking actions
                        >
                            {actions}
                        </div>
                    )}
                    <button className="p-1 rounded-full hover:bg-gray-200 text-gray-500">
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                </div>
            </div>

            <div
                className={clsx(
                    "transition-all duration-300 ease-in-out border-t border-gray-100",
                    isExpanded ? "max-h-[2000px] opacity-100 p-4" : "max-h-0 opacity-0 overflow-hidden"
                )}
            >
                {children}
            </div>
        </div>
    );
}
