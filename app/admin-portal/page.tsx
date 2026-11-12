"use client";

import "../globals.css";
import {FunctionParameter, WorkerFunction, adminFunctions} from "../_data/workerFunctions"
import {useState} from "react";

export default function AdminPortal() {
    const [selectedFunction, setSelectedFunction] = useState<WorkerFunction | null>(null);

    const handleSubmitFunction = () => {
        let proceed = true;
        if (selectedFunction?.critical) {
            proceed = confirm("Are you sure you want to proceed with this action?");
        }
        if (proceed) {
            const elements = document.getElementById("form-group")?.querySelectorAll<HTMLInputElement | HTMLSelectElement>('input, select');
            let parameters: string[] = [];
            if (elements) {
                for (const el of elements) {
                    parameters.push(el.value);
                }
            }
            // code for the functional side of things
            // let changes: NeededChanges[] = selectedFunction?.workerFunction(...parameters);
        }
    }


    return (
        <div className="bg-zinc-800 text-slate-100 h-screen">
        <h1 className="p-10 text-5xl">Hello, ______!</h1>
        <div className="flex flex-row gap-10">
            <div className="flex flex-col gap-5 ml-10">
                <b className="text-3xl">Commands</b>
                {adminFunctions.map((func, index) => (
                    <button className="function-button" key={index} onClick={() => setSelectedFunction(func)}>{func.name}</button>

                ))}
            </div>
            <div className="border-l border-slate-300 pl-5">
                {selectedFunction != null && (
                <div id="form-group">
                    <b className="text-xl">{selectedFunction?.explanation}</b>
                    {selectedFunction?.parameters.map((parameter, index) => (
                        <div key={index} className="mb-4">
                            <p>{parameter.description}</p>
                            {parameter.options.length == 0 && (
                                <input type="text" className="border-slate-300 border focus:outline-none rounded-md px-1"></input>
                            )}

                            {parameter.options.length != 0 && (
                                <select className="border-slate-300 border focus:outline-none px-1">   
                                    {parameter.options.map((option, index) => (
                                        <option value={option.value} key={index}>{option.label}</option>
                                    ))}    
                                </select>
                            )}

                        </div>
                    ))}
                    <button className="function-button" onClick={handleSubmitFunction}>Submit</button>
                </div>
                )}
            </div>
        </div>
        </div>
    );
}
