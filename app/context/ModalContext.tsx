"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type ModalType = "addMember" | "removeMember" | "editMember" | null;

interface ModalContextType {
    activeModal: ModalType;
    openModal: (modal: Exclude<ModalType, null>) => void;
    closeModal: () => void;
    selectedModalTeam: any;
    setSelectedModalTeam: (teamName: string) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const [selectedModalTeam, setSelectedModalTeam] = useState('');

    const openModal = (modal: Exclude<ModalType, null>) => {
        setActiveModal(modal);
    };

    const closeModal = () => {
        setActiveModal(null);
    };

    return (
        <ModalContext.Provider value={{ activeModal, openModal, closeModal, selectedModalTeam, setSelectedModalTeam }}>
            {children}
        </ModalContext.Provider>
    );
}

export function useModal() {
    const context = useContext(ModalContext);

    if (!context) {
        throw new Error("useModal must be used within a ModalProvider");
    }

    return context;
}