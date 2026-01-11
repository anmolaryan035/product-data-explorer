// src/app/page.tsx
'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProductGrid from './components/ProductGrid';// This imports the grid we made

// Create a client instance
const queryClient = new QueryClient();

export default function Home() {
  return (
    // We wrap the app in the Provider so components can fetch data
    <QueryClientProvider client={queryClient}>
      <main className="min-h-screen p-8 bg-gray-100">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">World of Books Explorer</h1>
          <p className="text-gray-600">Live Scraper Demo</p>
        </header>
        
        {/* This places the grid on the screen */}
        <ProductGrid />
      </main>
    </QueryClientProvider>
  );
}