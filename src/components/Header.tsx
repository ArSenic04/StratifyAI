import React from 'react';
import { Network } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b border-[#2A2A2A]">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <Network className="w-6 h-6 text-blue-500" />
          <div>
            <h1 className="text-lg font-semibold">StratifyAI</h1>
            <p className="text-sm text-gray-400">Multi-Agent Market Research System</p>
          </div>
        </div>
      </div>
    </header>
  );
}