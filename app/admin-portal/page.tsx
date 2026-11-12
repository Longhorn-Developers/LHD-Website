"use client";

import "../globals.css";
import {teams} from "../_data/workerFunctions"
import TeamSection from "../_components/TeamPage"
import MemberSection from "../_components/MemberPage"
import {useState} from "react";


export default function AdminPortal() {
    const [activeView, setActiveView] = useState('Teams');

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

  return (
    <aside className="w-50 bg-slate-100 p-5 fixed h-screen">
      <h2 className="font-700 text-xl">LHD Membership Portal</h2>
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