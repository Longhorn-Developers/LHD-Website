"use client";
import "../_components/applicationStyles.css";
import { questions, menus } from "../_data/applicationQuestions";
import { useState, Dispatch, SetStateAction } from "react";
import TeamSelection from "../_components/TeamSelection";
import RoleSelection from "../_components/RoleSelection";

export default function ApplicationPortal() {

    const [tab, setTab] = useState("general");
    const [roles, setRoles] = useState<string[]>([]);
    const [teams, setTeams] = useState<string[]>([]);

    return (
        <div className="portal-body">
            <button key="general" onClick={() => setTab("general")}>{menus["general"]}</button>
            {roles.map((id) => (
                <button key={id} onClick={() => setTab(id)}>{menus[id]}</button>
            ))}
            <RoleSelection roles={roles} setRoles={setRoles} />
            {/* {questions
            .filter((question) => question.role == tab)
            .map((question) => (
                <div key={question.ID}>
                    <p>{question.description}</p>
                </div>
            ))} */}
            <TeamSelection teams={teams} setTeams={setTeams} />
        </div>
    )
}

