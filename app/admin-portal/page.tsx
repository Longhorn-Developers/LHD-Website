"use client";

import "../globals.css";
import {teams} from "../_data/workerFunctions"
import TeamSection from "../_components/TeamPage"
import MemberSection from "../_components/MemberPage"
import {useEffect, useState} from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function AdminPortal() {
    const [activeView, setActiveView] = useState('Teams');
    const { loading, isAuthenticated } = useAuth();
    const router = useRouter();

    if (loading) {
      return <p>Loading...</p>;
    }

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        router.replace('/admin-login');
      }
    }, [loading, isAuthenticated, router]);

    const renderView = () => {
        switch (activeView) {
            case 'Teams':
                return <TeamSection />;
            case 'Members':
                return <MemberSection />;
        };
    }

    return (
        <div className="flex h-screen">
            <Sidebar activeView={activeView} setActiveView={setActiveView} />
            <main className="flex-1 ml-50">
                {renderView()}
            </main>
        </div>
    )
}


function Sidebar({ activeView, setActiveView }) {
  const navItems = ["Teams", "Members"]
  const { handleLogout } = useAuth();

  return (
    <aside className="w-50 bg-slate-100 p-5 fixed h-screen">
      <h2 className="font-700 text-xl">LHD Membership Portal</h2>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 shadow-sm transition-all duration-200 hover:border-red-300 hover:bg-red-50 hover:text-red-700 active:scale-95 mb-5 mt-5 cursor-pointer"
      >
        Log out
      </button>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {navItems.map((item) => (
          <li key={item} className="my-3">
            <button
              onClick={() => setActiveView(item)}
              className = {`flex items-center w-full h-10 p-[10px] text-left border-none 
                cursor-pointer rounded-md ${activeView === item ? 'bg-[#007bff] text-white': 'bg-transparent text-black'}`}
            >
              {item}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}