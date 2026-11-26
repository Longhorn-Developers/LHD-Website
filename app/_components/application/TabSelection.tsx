"use client";
import "../../_styles/applicationStyles.css";
import { menus, menuColors } from "../../_data/applicationQuestions";
import { Dispatch, SetStateAction } from "react";

interface TabProps {
  tab: string;
  setTab: Dispatch<SetStateAction<string>>;
  roles: string[];
}

export default function TabSelection({tab, setTab, roles}: TabProps) {
    return (
        <div className="max-w-full">
            <div className="flex flex-row gap-2 justify-center flex-wrap">
                {["general", ...roles].map((id) => (
                    <button className={`${tab == id ? 'bg-(--bg-token)' : undefined} p-2 min-w-fit rounded-t-md`}
                    style={{ '--bg-token': `var(--colors-${menuColors[id]})` } as React.CSSProperties}
                    key={id} onClick={() => setTab(id)}>
                        {menus[id]}
                    </button>
                ))}
            </div>
            <hr className="border border-ut-offwhite w-full mb-7"></hr>
        </div>
    )
}
