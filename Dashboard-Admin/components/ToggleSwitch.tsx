'use client';

import { useState } from 'react';
import { ApiClient } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface ToggleSwitchProps {
    productId: string;
    initialEnabled: boolean;
    onToggle?: (newState: boolean) => void;
}

export default function ToggleSwitch({ productId, initialEnabled, onToggle }: ToggleSwitchProps) {
    const [enabled, setEnabled] = useState(initialEnabled);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation if inside a link
        e.stopPropagation();

        setLoading(true);
        const newState = !enabled;
        try {
            await ApiClient.updateProduct(productId, { enabled: newState });
            setEnabled(newState);
            if (onToggle) onToggle(newState);
            router.refresh(); // Refresh Next.js server components
        } catch (err) {
            console.error('Failed to toggle product', err);
            alert('Failed to update product status');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggle}
            disabled={loading}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${enabled ? 'bg-green-500' : 'bg-gray-200'}`}
        >
            <span className="sr-only">Enable product</span>
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
            />
        </button>
    );
}
