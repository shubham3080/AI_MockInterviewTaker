"use client"
import React, { useEffect, useState } from 'react'
import { MockInterview } from '../../../../../utils/schema'
import { db } from '../../../../../utils/db'
import { eq } from 'drizzle-orm'
import QuestionsSection from './_components/QuestionsSection'
import RecordAnswerSection from './_components/RecordAnswerSection'
import Link from 'next/link'
function StartInterview({ params }) {
    const [interviewData, setInterviewData] = useState();
    const [mockInterviewQuestion, setMockInterviewQuestion] = useState();
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0)
    let result;
    useEffect(() => {
        const GetInterviewDetails = async () => {
            result = await db.select().from(MockInterview)
                .where(eq(MockInterview.mockId, params.interviewId))
            console.log((result[0].jsonMockResp))
            let cleanedJsonString=(result[0].jsonMockResp);
            if (cleanedJsonString.startsWith('{"') && cleanedJsonString.endsWith('"}')) {
                cleanedJsonString = cleanedJsonString.slice(2, -2); // Remove the first `{"` and last `"}`
            }
            // const cleanedJsonString = result[0].jsonMockResp.slice(1, -1);
            const cleanedString = cleanedJsonString.replace(/\\"/g, '"').replace(/}","{/g, "},{");
            const jsonArrayString = `[${cleanedString}]`;
            console.log(jsonArrayString)

            const jsonMockResp = JSON.parse(jsonArrayString);

            console.log(jsonMockResp);
            setMockInterviewQuestion(jsonMockResp)
            setInterviewData(result[0]);
        }
        GetInterviewDetails();
    }, [])
    return (
        <div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
            <QuestionsSection mockInterviewQuestion={mockInterviewQuestion}
                activeQuestionIndex={activeQuestionIndex} />
            <RecordAnswerSection
                mockInterviewQuestion={mockInterviewQuestion}
                activeQuestionIndex={activeQuestionIndex}
                interviewData={interviewData} />
        </div>        
            <div className='flex justify-end gap-6'>
                {activeQuestionIndex > 0 && (
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-3 rounded-lg" // Added styling
                        onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
                    >
                        Previous
                    </button>
                )}

                {activeQuestionIndex < mockInterviewQuestion?.length - 1 && (
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-3 rounded-lg"
                        onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
                    >
                        Next
                    </button>
                )}

                {activeQuestionIndex === mockInterviewQuestion?.length - 1 && (
                    <Link href={'/dashboard/interview/'+interviewData?.mockId+"/feedback"}>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-3 rounded-lg"                    >
                        End Interview
                    </button>
                    </Link>
                )}
            </div>
        </div>
    )
}

export default StartInterview