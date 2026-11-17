"use client";

import {
    useEffect,
    useState,
    type Dispatch,
    type SetStateAction,
} from "react";
import { useAuth } from "../context/AuthContext";

interface SidebarProps {
    activeView: string;
    setActiveView: Dispatch<SetStateAction<string>>;
}

const navItems = ["Teams", "Members", "Settings"] as const;

export function Sidebar({ activeView, setActiveView }: SidebarProps) {
    const { handleLogout, user } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const storedView = sessionStorage.getItem("activeView");
        const storedActiveView = navItems.find(
            (item) => item === storedView
        );
        if (storedActiveView) {
            // Restore browser-only state after hydration to keep SSR markup consistent.
            setActiveView(storedActiveView);
        } else if (storedView) {
            sessionStorage.removeItem("activeView");
        }
    }, [setActiveView]);

    useEffect(() => {
        if (!isMobileMenuOpen) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isMobileMenuOpen]);

    return (
        <>
            <button
                type="button"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
                aria-controls="membership-sidebar"
                onClick={() =>
                    setIsMobileMenuOpen((isOpen) => !isOpen)
                }
                className={`fixed ${
                    isMobileMenuOpen ? "left-56" : "left-4"
                } top-4 z-[60] flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg bg-[#BF5700] text-white shadow-md transition-[left] duration-300 ease-in-out hover:bg-[#9a4600] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BF5700] lg:hidden`}
            >
                <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-6 w-6"
                >
                    {isMobileMenuOpen ? (
                        <path
                            d="m6 6 12 12M18 6 6 18"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    ) : (
                        <path
                            d="M4 6h16M4 12h16M4 18h16"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    )}
                </svg>
            </button>

            {isMobileMenuOpen && (
                <button
                    type="button"
                    aria-label="Close navigation menu"
                    tabIndex={-1}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="fixed inset-0 z-40 cursor-pointer bg-[#211a16]/50 lg:hidden"
                />
            )}

            <aside
                id="membership-sidebar"
                aria-label="Membership navigation"
                className={`invisible fixed inset-y-0 left-0 z-50 flex h-screen w-70 flex-col border-r border-[#e7e2dc] bg-[#f7f5f2] shadow-[4px_0_18px_rgba(47,36,29,0.06)] transition-transform duration-300 ease-in-out lg:visible lg:translate-x-0 ${
                    isMobileMenuOpen
                        ? "visible translate-x-0"
                        : "-translate-x-full"
                }`}
            >
            <div className="h-1.5 w-full bg-[#BF5700]" />

            <div className="border-b border-[#e7e2dc] px-5 py-5">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#BF5700] text-sm font-black tracking-wide text-white shadow-sm">
                    <img
                        src="/lhdlogo.png"
                        alt="Longhorn Developers"
                        className="h-full w-full object-contain"
                    />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#BF5700]">
                    Longhorn Developers
                </p>
                <h1 className="mt-1 text-lg font-bold leading-tight text-[#29231f]">
                    Membership Portal
                </h1>
            </div>

            <div className="border-b border-[#e7e2dc] px-5 py-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#877b70]">
                    Signed in as
                </p>
                <p className="mt-1 truncate text-sm font-semibold text-[#342a23]">
                    {user?.name || "Member"}
                </p>
            </div>

            <nav aria-label="Membership portal" className="flex-1 px-3 py-5">
                <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#988b7e]">
                    Workspace
                </p>
                <ul className="space-y-1">
                    {navItems.map((item) => {
                        const isActive = activeView === item;

                        return (
                            <li key={item}>
                                <button
                                    type="button"
                                    aria-current={isActive ? "page" : undefined}
                                    onClick={() => {
                                        sessionStorage.setItem("activeView", item);
                                        setActiveView(item);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BF5700] ${
                                        isActive
                                            ? "bg-[#BF5700] text-white shadow-sm"
                                            : "text-[#51463e] hover:bg-[#fff4e8] hover:text-[#9a4600]"
                                    }`}
                                >
                                    <span
                                        aria-hidden="true"
                                        className={`h-1.5 w-1.5 rounded-full ${
                                            isActive
                                                ? "bg-white"
                                                : "bg-[#c6b8aa]"
                                        }`}
                                    />
                                    {item}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="border-t border-[#e7e2dc] p-4">
                <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#e8cbb7] bg-white px-4 py-2.5 text-sm font-semibold text-[#9a4600] transition hover:border-[#BF5700] hover:bg-[#fff4e8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BF5700] active:scale-[0.98] cursor-pointer"
                >
                    <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-4 w-4"
                    >
                        <path
                            d="M10 17l5-5-5-5M15 12H3m9-8h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    Log out
                </button>
                <p className="mt-3 text-center text-[10px] font-medium tracking-wide text-[#a69a8f]">
                    HOOK &apos;EM
                </p>
            </div>
            </aside>
        </>
    );
}