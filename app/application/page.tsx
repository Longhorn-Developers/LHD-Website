"use client";
import "../_styles/applicationStyles.css";
import { menus } from "../_data/applicationQuestions";
import { useState, Dispatch, SetStateAction, Activity } from "react";
import Image from 'next/image';
import TeamSelection from "../_components/application/TeamSelection";
import RoleSelection from "../_components/application/RoleSelection";
import QuestionBlock from "../_components/application/QuestionBlock";
import TabSelection from "../_components/application/TabSelection";

export default function ApplicationPortal() {

    const [tab, setTab] = useState("general");
    const [roles, setRoles] = useState<string[]>([]);
    const [teams, setTeams] = useState<string[]>([]);
    const availableTeams = Object.keys(menus).slice(1);

    return (
        <div className="portal-body 2xl:mt-25!">
            <LHDGraphic />
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

function LHDGraphic() {
    return (
        <div className="lhd-header">
            <Image src="/lhdlogo.png" width="100" height="100" alt="LHD Logo"
            className="rounded-xl max-2xl:size-20" />
            <p className="text-2xl 2xl:text-3xl mt-3">Longhorn Developers Application</p>
        </div>
    )
}