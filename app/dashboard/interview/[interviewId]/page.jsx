"use client"
import React, { useEffect, useState } from 'react'
import { MockInterview } from '../../../../utils/schema'
import { db } from '../../../../utils/db'
import { eq } from 'drizzle-orm'
import Webcam from "react-webcam";
import { WebcamIcon, Lightbulb } from 'lucide-react'
// import { Button } from 'C:/Users/yash/Desktop/StudyMate/my-app/@/components/ui/button.jsx'
import Link from "next/link";
import { Button } from '@/@/components/ui/button'
function Interview({ params }) {
    const [interviewData, setInterviewData] = useState();
    const [webCamEnabled, setWebCamEnabled] = useState(false);
    let result;
    useEffect(() => {
        const GetInterviewDetails = async () => {
            result = await db.select().from(MockInterview)
                .where(eq(MockInterview.mockId, params.interviewId))
            console.log(result[0].jobPosition)
            setInterviewData(result[0]);
        }
        GetInterviewDetails();
    }, [])
    useEffect(() => {
        console.log("Updated Interview Data:", interviewData);
    }, [interviewData]);

    if (!interviewData || Object.keys(interviewData).length === 0) {
        return <p>Loading interview details...</p>;
    }

    return (
        <div className='my-10'>
            <h2 className='font-bold text-2xl'>Let's Get Started</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                <div className='flex flex-col my-5 gap-5 '>
                    <div className='flex flex-col gap-5 p-5 rounded-lg border mt-3'>
                        <h2 className='text-lg'><strong>Job Role/Job Position: </strong> {interviewData.jobPosition}</h2>
                        <h2 className='text-lg'><strong>Job Description/Tech Stack: </strong>{interviewData.jobDesc}</h2>
                        <h2 className='text-lg'><strong>Years of Experience: </strong>{interviewData.jobExperience}</h2>
                    </div>
                    <div className='p-5 border rounded-lg border-yellow-300 bg-yellow-100'>
                        <h2 className='flex gap-2 items-center text-yellow-500'><Lightbulb /><strong>Information</strong></h2>
                        <h2 className='mt-3 text-yellow-500'>Enable Video Web Cam and Microphone to Start your AI Generated Mock Interview, It has 5 questions which you can answer and at the last you will get the report on the basis of your answer.NOTE: We never record your video ,Web cam access you can disable at any time if you want</h2>
                    </div>
                </div>
                <div>
                    {webCamEnabled ?
                        <Webcam
                            onUserMedia={() => setWebCamEnabled(true)}
                            onUserMediaError={() => setWebCamEnabled(false)}
                            mirrored={true}
                            style={{
                                height: 300,
                                width: 900
                            }}
                        /> :
                        <><WebcamIcon className='h-64 w-full my-7 p-20 bg-secondary rounded-lg border' />
                            <Button onClick={() => setWebCamEnabled(true)} className='bg-gray-500 text-white w-full pt-6 pb-6'>Enable Web Cam and Microphone</Button>
                        </>
                    }
                </div>


            </div>
            <div className="flex justify-end items-end mt-10">
                <Link href={'/dashboard/interview/' + params.interviewId + '/start'}>
                    <Button className='bg-blue-600 text-white p-5 text-lg'>Start Interview</Button>
                </Link>
            </div>
        </div>
    )
}

export default Interview