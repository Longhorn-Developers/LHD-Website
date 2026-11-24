"use client";
import "../_components/applicationStyles.css";
import { Question, questions } from "../_data/applicationQuestions";
import { useState, useRef, Dispatch, SetStateAction } from "react";


export default function QuestionBlock({tab} : {tab : string}) {
    return (
        <div>
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
            <p>{question.description}</p>
            <textarea
                value={response}
                onChange={(e) => updateResponse(e.target.value)}
                placeholder="Type your response here..."
            />
            {question.wordLimit && 
                <p>Words Remaining: {question.wordLimit - getLength(response)}</p>
            }
        </div>
    );

}