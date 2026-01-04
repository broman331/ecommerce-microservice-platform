"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    Package,
    ShoppingCart,
    Settings,
    ChevronLeft,
    ChevronRight,
    Menu,
    Users
} from "lucide-react";
import clsx from "clsx";

interface SidebarProps {
    isCollapsed: boolean;
    toggleSidebar: () => void;
}

export default function Sidebar({ isCollapsed, toggleSidebar }: SidebarProps) {
    const pathname = usePathname();

    const navItems = [
        { name: "Dashboard", href: "/", icon: Home },
        { name: "Orders", href: "/orders", icon: ShoppingCart },
        { name: "Products", href: "/products", icon: Package },
        { name: "Customers", href: "/admin/customers", icon: Users },
        { name: "Admin", href: "/admin", icon: Settings },
    ];

    return (
        <aside
            className={clsx(
                "fixed left-0 top-0 h-screen bg-slate-900 text-white transition-all duration-300 z-50 flex flex-col",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
                <div className={clsx("font-bold text-xl overflow-hidden whitespace-nowrap transition-all", isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100")}>
                    AdminPanel
                </div>
                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                    {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            <nav className="flex-1 py-6 space-y-2 px-3">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(
                                "flex items-center p-3 rounded-lg transition-colors group",
                                isActive
                                    ? "bg-slate-800 text-white"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            )}
                            title={isCollapsed ? item.name : undefined}
                        >
                            <item.icon size={22} className={clsx("min-w-[22px]", isActive ? "text-indigo-400" : "group-hover:text-indigo-400")} />
                            <span
                                className={clsx(
                                    "ml-3 font-medium overflow-hidden whitespace-nowrap transition-all duration-300",
                                    isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                                )}
                            >
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                        A
                    </div>
                    <div className={clsx("ml-3 overflow-hidden whitespace-nowrap transition-all", isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100")}>
                        <p className="text-sm font-medium text-white">Admin User</p>
                        <p className="text-xs text-slate-400">admin@example.com</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
