"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Fuse from "fuse.js";
import type { Member } from "../_data/workerFunctions";

interface MemberSearchDropdownProps {
    members: Member[];
    selectedMember: string;
    onSelectMember: (memberId: string) => void;
}

const getMemberId = (member: Member) =>
    member.userID ?? member.memberID ?? member.email;

export default function MemberSearchDropdown({
    members,
    selectedMember,
    onSelectMember,
}: MemberSearchDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const fuse = useMemo(
        () =>
            new Fuse(members, {
                keys: ["name", "email"],
                threshold: 0.4,
                ignoreLocation: true,
                minMatchCharLength: 1,
                includeScore: true,
            }),
        [members]
    );

    const matchingMembers = useMemo(() => {
        if (!query.trim()) {
            return members;
        }

        return fuse
            .search(query.trim())
            .sort((a, b) => (a.score ?? 1) - (b.score ?? 1))
            .map((result) => result.item);
    }, [fuse, members, query]);

    const selectedUser = members.find(
        (member) => getMemberId(member) === selectedMember
    );

    useEffect(() => {
        if (isOpen) {
            searchInputRef.current?.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handlePointerDown = (event: PointerEvent) => {
            if (
                event.target instanceof Node &&
                !dropdownRef.current?.contains(event.target)
            ) {
                setIsOpen(false);
                setQuery("");
            }
        };

        document.addEventListener("pointerdown", handlePointerDown);
        return () =>
            document.removeEventListener("pointerdown", handlePointerDown);
    }, [isOpen]);

    return (
        <div ref={dropdownRef} className="relative">
            <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                onClick={() => {
                    if (isOpen) {
                        setQuery("");
                    }
                    setIsOpen((open) => !open);
                }}
                className="flex w-full items-center justify-between rounded-lg border border-[#d6d3d1] bg-white p-2.5 text-left text-sm text-gray-900 outline-none transition focus:border-[#BF5700] focus:ring-2 focus:ring-[#BF5700]/15"
            >
                <span className={selectedUser ? "" : "text-gray-500"}>
                    {selectedUser
                        ? `${selectedUser.name} (${selectedUser.email})`
                        : "Choose a user..."}
                </span>
                <span aria-hidden="true" className="ml-3 text-[#9a4600]">
                    {isOpen ? "▲" : "▼"}
                </span>
            </button>

            {isOpen && (
                <div className="absolute z-20 mt-1 w-full rounded-lg border border-[#e7e2dc] bg-white p-2 shadow-lg">
                    <input
                        ref={searchInputRef}
                        type="search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === "Escape") {
                                setIsOpen(false);
                                setQuery("");
                            }
                        }}
                        placeholder="Search users..."
                        aria-label="Search users"
                        className="mb-2 w-full rounded-md border border-[#d6d3d1] px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-[#BF5700] focus:ring-2 focus:ring-[#BF5700]/15"
                    />

                    <ul
                        role="listbox"
                        aria-label="Available users"
                        className="max-h-56 overflow-y-auto"
                    >
                        {matchingMembers.length > 0 ? (
                            matchingMembers.map((member) => {
                                const memberId = getMemberId(member);

                                return (
                                    <li key={memberId}>
                                        <button
                                            type="button"
                                            role="option"
                                            aria-selected={
                                                memberId === selectedMember
                                            }
                                            onClick={() => {
                                                onSelectMember(memberId);
                                                setQuery("");
                                                setIsOpen(false);
                                            }}
                                            className="w-full rounded-md px-3 py-2 text-left text-sm text-gray-800 hover:bg-[#fff4e8] hover:text-[#7a3900] focus:bg-[#fff4e8] focus:outline-none"
                                        >
                                            {member.name} ({member.email})
                                        </button>
                                    </li>
                                );
                            })
                        ) : (
                            <li className="px-3 py-2 text-sm text-gray-500">
                                No matching users.
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}
