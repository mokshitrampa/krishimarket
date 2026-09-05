import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { FarmerCompareBar } from '../components/farmer/FarmerCompareBar';

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <FarmerCompareBar />
      <Footer />
    </div>
  );
};