'use client';
import { useQuery } from '@tanstack/react-query';
// Removed: import Image from 'next/image'; (Not using it to avoid config errors)

interface Product {
  title: string;
  price: string;
  image?: string;
  url?: string;
}

async function fetchProducts() {
  const targetUrl = 'https://www.worldofbooks.com/en-gb/search?q=mystery';
  const res = await fetch(`https://YOUR-RENDER-URL.onrender.com/products/scrape?url=${targetUrl}`);
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
}

export default function ProductGrid() {
  const { data, isLoading, error } = useQuery({ 
    queryKey: ['products'], 
    queryFn: fetchProducts 
  });

  if (isLoading) return <div className="text-center p-10 animate-pulse">Loading books...</div>;
  if (error) return <div className="text-red-500 text-center">Error loading products.</div>;

  const products = Array.isArray(data) ? data : (data?.items || []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
      {products.map((book: Product, index: number) => (
        <div key={index} className="border rounded-lg p-4 shadow-sm bg-white">
          
          <div className="relative h-48 mb-4 w-full flex justify-center items-center bg-gray-50"> 
            {book.image ? (
              <img 
                src={book.image} 
                alt={book.title} 
                referrerPolicy="no-referrer"
                className="object-contain h-full w-full"
              />
            ) : (
              <div className="text-gray-400">No Image</div>
            )}
          </div>

          <h3 className="font-bold text-lg line-clamp-2">{book.title}</h3>
          <p className="text-green-600 font-bold mt-2">{book.price}</p>
          <a href={book.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm mt-2 block underline">
            View on World of Books
          </a>
        </div>
      ))}
    </div>
  );
}