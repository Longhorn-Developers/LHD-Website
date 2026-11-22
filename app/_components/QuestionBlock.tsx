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

    return (
        <div className="text-left">
            <p>{question.description}</p>
            <textarea></textarea>
            <p>Word Limit: {question.wordLimit}</p>
        </div>
    );

}