"use client";
import "../_components/applicationStyles.css";
import { questions, menus, Question } from "../_data/applicationQuestions";
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
            <button key="general" onClick={() => setTab("general")}>{menus["general"]}</button>
            {roles.map((id) => (
                <button key={id} onClick={() => setTab(id)}>{menus[id]}</button>
            ))}
            
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
