import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#F5E9D3] px-4 py-10">
      {children}
      <p className="mt-8 text-center text-xs text-[#025E43] opacity-70">
        {"© 2024 RESIK Ecosystem. Membangun bumi lebih hijau dan bersih."}
      </p>
    </main>
  );
}