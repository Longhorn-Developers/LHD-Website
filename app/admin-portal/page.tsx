"use client";

import "../globals.css";
import TeamSection from "../_components/TeamPage"
import MemberSection from "../_components/MemberPage"
import {useEffect, useState} from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import Settings from "../_components/Settings";
import { Sidebar } from "../_components/Sidebar";

export default function AdminPortal() {
    const [activeView, setActiveView] = useState('Teams');
    const { loading, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        router.replace('/admin-portal/login');
      }
    }, [loading, isAuthenticated, router]);

    if (loading) {
      return <p>Loading...</p>;
    }

    const renderView = () => {
        switch (activeView) {
            case 'Teams':
                return <TeamSection />;
            case 'Members':
                return <MemberSection />;
            case 'Settings':
              return <Settings />
        };
    }

    return (
        <div className="flex h-screen">
            <Sidebar activeView={activeView} setActiveView={setActiveView}/>
            <main className="ml-0 flex-1 pt-16 lg:ml-70 lg:pt-0">
                {renderView()}
            </main>
        </div>
    )
}


// export function Sidebar({ activeView, setActiveView }) {
//   const navItems = ["Teams", "Members", "Settings"]
//   const { handleLogout, user } = useAuth();

//   return (
//     <aside className="w-50 bg-slate-100 p-5 fixed h-screen">
//       <h2 className="font-700 text-xl">LHD Membership Portal</h2>
//       <h3 className="mt-5 mb-5">{user?.name}</h3>
//       <button
//         onClick={handleLogout}
//         className="flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 shadow-sm transition-all duration-200 hover:border-red-300 hover:bg-red-50 hover:text-red-700 active:scale-95 mb-5 mt-5 cursor-pointer"
//       >
//         Log out
//       </button>
//       <ul style={{ listStyle: 'none', padding: 0 }}>
//         {navItems.map((item) => (
//           <li key={item} className="my-3">
//             <button
//               onClick={() => setActiveView(item)}
//               className = {`sidebar-button ${activeView === item ? 'sidebar-current' : ''}`}
//             >
//               {item}
//             </button>
//           </li>
//         ))}
//       </ul>
//     </aside>
//   );
// }