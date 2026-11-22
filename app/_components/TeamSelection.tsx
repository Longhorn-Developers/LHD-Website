"use client";
import "./applicationStyles.css";
import { teamOptions } from "../_data/applicationQuestions";
import { useRef, useEffect , Dispatch, SetStateAction } from "react";

interface TeamProps {
  teams: string[];
  setTeams: Dispatch<SetStateAction<string[]>>;
}

export default function TeamSelection({teams, setTeams} : TeamProps) {
    
    const dragItemIndex = useRef<number | null>(null);
    const dragOverItemIndex = useRef<number | null>(null);

    const addTeam = (team: string) => {
        if (teams.length < 4 && !teams.includes(team)) {
            setTeams([...teams, team]);
        }
    }

    const removeTeam = (team: string) => {
        setTeams((prev) => prev.filter((t) => t !== team));
    }

    const handleDragEnd = () => {
        if (
            dragItemIndex.current === null ||
            dragOverItemIndex.current === null ||
            dragItemIndex.current === dragOverItemIndex.current
        ) {
            dragItemIndex.current = null;
            dragOverItemIndex.current = null;
            return;
        }

        const updatedItems = [...teams];
        const [draggedItem] = updatedItems.splice(dragItemIndex.current, 1);
        updatedItems.splice(dragOverItemIndex.current, 0, draggedItem);

        dragItemIndex.current = null;
        dragOverItemIndex.current = null;
        setTeams(updatedItems);
    };

    return (
        <div className="flex flex-row gap-5">
            <ul className="list-none p-0 w-80">
            {teams.map((id, index) => (
                <li
                key={id}
                draggable
                onDragStart={() => (dragItemIndex.current = index)}
                onDragEnter={() => (dragOverItemIndex.current = index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()} // Required to allow dropping
                
                className="drag-element"
                >
                <b>{index + 1}</b> {teamOptions[id]} <Bars/>
                </li>
            ))}
            </ul>
            <ul className="list-none p-0 w-60 flex flex-col gap-2 my-3">
            {Object.entries(teamOptions).map(([id, label]) => (
                <li key={id} className={teams.length > 4 ? "text-gray-400" : ""} onClick={() => addTeam(id)}>
                <p><b className="px-1">+</b> {label}</p>
                </li>
            ))}
            </ul>
        </div>
    )
}

function Bars() {

    return (
        <div className="flex flex-col ml-auto">
            <hr className="m-px w-3"></hr>
            <hr className="m-px w-3"></hr>
            <hr className="m-px w-3"></hr>
        </div>
    )

}