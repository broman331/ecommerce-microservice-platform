"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import clsx from "clsx";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <Sidebar
                isCollapsed={isSidebarCollapsed}
                toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />

            <main
                className={clsx(
                    "flex-1 transition-all duration-300 p-8",
                    isSidebarCollapsed ? "ml-20" : "ml-64"
                )}
            >
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
