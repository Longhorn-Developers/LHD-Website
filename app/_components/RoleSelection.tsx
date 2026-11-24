"use client";
import "../_styles/applicationStyles.css";
import { menus } from "../_data/applicationQuestions";
import { useState, useRef, Dispatch, SetStateAction } from "react";

export interface RoleProps {
  roles: string[];
  setRoles: Dispatch<SetStateAction<string[]>>;
}

export default function RoleSelection({roles, setRoles} : RoleProps) {

    const containerRef = useRef<HTMLDivElement>(null);

    const handleReadCheckboxes = () => {
        if (!containerRef.current) {
            return;
        }

        const checkboxes = containerRef.current.querySelectorAll<HTMLInputElement>(
            'input[type="checkbox"]'
        );
        
        const checked: string[] = [];
        checkboxes.forEach((checkbox) => {
            if (checkbox.checked) {
                checked.push(checkbox.value);
            }
        });

        setRoles(checked);
    };


    return (
        <div className="flex flex-col justify-center items-center">
            <label htmlFor="teamSelect">Select the roles you'd like to apply for:</label>
            <div
                id="teamSelect"
                className="w-fit outline-0 flex flex-row gap-3"
                ref={containerRef}
            >
                {Object.entries(menus).slice(1).map(([id, label]) => (
                    <label key={id} className="role-container">
                        <input type="checkbox" key={id} value={id} 
                        onChange={handleReadCheckboxes} className="role-input"
                        />
                        <p>{label.split(" ")[0]}</p>
                    </label>
                ))}
            </div>
        </div>
    );
}