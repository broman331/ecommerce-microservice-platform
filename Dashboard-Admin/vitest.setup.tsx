import '@testing-library/jest-dom'
import { vi } from 'vitest'
import React from 'react'

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href} > {children} </a>
  ),
}));

// Mock next/font/google if needed, usually ignored by default if not imported or mocked
