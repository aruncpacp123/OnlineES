import React, { createContext, useState } from "react";

export const ExamContext = createContext(null);

export function ExamProvider({ children }) {
    // const [add, setAdd] = useState(false);
    // const [step1,setStep1] = useState(false);
    // const [step2,setStep2] = useState(false);
    const [exam,setExam] = useState(null)

    const login = (examData) => {
        setExam(examData);
    };
    return (
        <ExamContext.Provider value={{ exam,login }}>
            {children}
        </ExamContext.Provider>
    );
}
