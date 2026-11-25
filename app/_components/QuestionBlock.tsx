"use client";
import "../_styles/applicationStyles.css";
import { Question, questions } from "../_data/applicationQuestions";
import { useState, useRef, Dispatch, SetStateAction } from "react";


export default function QuestionBlock({tab} : {tab : string}) {
    return (
        <div className="w-[40%] flex flex-col gap-10">
        {questions.filter((question: Question) => question.role == tab)
            .map((question: Question) => (
                <ApplicationQuestion question={question} key={question.ID} />
        ))}
        </div>
    )
} 

export function ApplicationQuestion({question} : {question: Question}) {

    const [response, setResponse] = useState('');

    const updateResponse = (text: string) => {
        if (!question.wordLimit || getLength(text) <= question.wordLimit) {
            setResponse(text);
        }
    }

    const getLength = (text: string) => {
        const trimmed = text.trim();
        if (!trimmed) return 0;
        return trimmed.split(/\s+/).length;
    }

    return (
        <div className="text-left">
            <p className="pb-2">{question.description}</p>
            <textarea
                value={response}
                onChange={(e) => updateResponse(e.target.value)}
                placeholder="Type your response here..."
                className="w-full min-h-15 h-30 resize-y rounded-md border border-theme-muted p-2"
            />
            {question.wordLimit && 
                <p className="text-right text-ut-gray text-sm">Words Remaining: {question.wordLimit - getLength(response)}/{question.wordLimit}</p>
            }
        </div>
    );

}