'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CancelPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-50 via-red-100 to-red-200 px-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4 animate-pulse" />
        <h1 className="text-3xl font-extrabold text-red-600 mb-2 tracking-tight">Payment Cancelled</h1>
        <p className="text-gray-700 mb-6 max-w-sm mx-auto text-base">
          Uh oh! Looks like your payment didn’t go through. Don’t worry — you can always return to the homepage or browse the menu again.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button
            className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 text-sm rounded-xl shadow-md"
            onClick={() => router.push('/')}
          >
            🏠 Go Back Home
          </Button>
          <Button
            variant="outline"
            className="border-sky-600 text-sky-700 hover:bg-sky-100 px-6 py-2 text-sm rounded-xl shadow-md"
            onClick={() => router.push('/order')}
          >
            📋 View Menu
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
