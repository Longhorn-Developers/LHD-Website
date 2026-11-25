"use client";
import "../_styles/applicationStyles.css";
import { questions, menus, Question, menuColors } from "../_data/applicationQuestions";
import { useState, Dispatch, SetStateAction, Activity } from "react";
import TeamSelection from "../_components/TeamSelection";
import RoleSelection from "../_components/RoleSelection";
import QuestionBlock from "../_components/QuestionBlock";

export default function ApplicationPortal() {

    const [tab, setTab] = useState("general");
    const [roles, setRoles] = useState<string[]>([]);
    const [teams, setTeams] = useState<string[]>([]);
    const availableTeams = Object.keys(menus).slice(1);

    return (
        <div className="portal-body">
            <TabSelection tab={tab} setTab={setTab} roles={roles} />
             
            <Activity mode={tab === "general" ? 'visible' : 'hidden'}>
                <GeneralBlock roles={roles} setRoles={setRoles} />
            </Activity>
            {availableTeams.map((team) => (
                <Activity mode={tab === team ? 'visible' : 'hidden'} key={team} >
                    <RoleApplicationBlock teams={teams} setTeams={setTeams} tab={team} />
                </Activity>
            ))}
        </div>
    )
}

interface RoleProps {
  roles: string[];
  setRoles: Dispatch<SetStateAction<string[]>>;
}

function GeneralBlock({roles, setRoles}: RoleProps) {
    return (
        <>
            <RoleSelection roles={roles} setRoles={setRoles} />
            <QuestionBlock tab="general" />
        </>
    )
}

interface RoleApplicationProps {
  teams: string[];
  setTeams: Dispatch<SetStateAction<string[]>>;
  tab: string;
}

function RoleApplicationBlock({teams, setTeams, tab}: RoleApplicationProps) {
    return (
        <>
            <TeamSelection teams={teams} setTeams={setTeams} />
            <QuestionBlock tab={tab} />
        </>
    )
}

interface TabProps {
  tab: string;
  setTab: Dispatch<SetStateAction<string>>;
  roles: string[];
}

function TabSelection({tab, setTab, roles}: TabProps) {
    return (
        <div className="w-[40%]">
            <div className="flex flex-row gap-6 justify-center">
                {["general", ...roles].map((id) => (
                    <button className={`${tab == id ? 'bg-(--bg-token)' : undefined} p-2 min-w-fit rounded-md`}
                    style={{ '--bg-token': `var(--colors-${menuColors[id]})` } as React.CSSProperties}
                    key={id} onClick={() => setTab(id)}>
                        {menus[id]}
                    </button>
                ))}
            </div>
            <hr className="border border-ut-offwhite w-full mb-7 mt-1.5"></hr>
        </div>
    )
}
