"use client"
import React, { useEffect, useState } from 'react'
import { db } from '../../../../../utils/db'
import { UserAnswer } from '../../../../../utils/schema'
import { eq } from 'drizzle-orm'
import {ChevronsUpDown} from 'lucide-react'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@/@/components/ui/collapsible.jsx"
import { useRouter } from 'next/navigation'
import Link from 'next/link'
  
function Feedback({params}) {
    const [feedbackList,setFeedbackList]=useState([]);
    useEffect(()=>{
        GetFeedback();
    },[])
    const GetFeedback=async()=>{
        const result=await db.select()
        .from(UserAnswer)
        .where(eq(UserAnswer.mockIdRef,params.interviewId))
        .orderBy(UserAnswer.id);

        console.log(result);
        setFeedbackList(result)

    }

  return (
    <div className='p-10'>
        <h2 className='text-3xl font-bold text-green-500'>Congratulations!</h2>
        <h2 className='font-bold text-2xl'>Here is your interview feedback</h2>
        <h2 className='text-primary text-lg my-3'>Your overall interview rating <strong>2/10</strong></h2>
        <h2 className='text-md text-gray-500'>Find below interview question with correct answer, Your answer and feedback for improvement</h2>
        {feedbackList&&feedbackList.map((item,index)=>(
            <Collapsible key={index} className='mt-7'>
            <CollapsibleTrigger className='p-2 bg-secondary rounded-lg my-2 text-left flex justify-between gap-7 w-full'>
            {item.question} <ChevronsUpDown/>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className='flex flex-col gap-2'>
                <h2 className='text-red-500 p-2 border rounded-lg'><strong>Rating:</strong>{item.rating}</h2>
                <h2 className='p-2 border rounded-lg bg-red-50 text-md text-red-900'><strong>Your Answer: </strong>{item.userAns}</h2>
                <h2 className='p-2 border rounded-lg bg-green-50 text-md text-green-900'><strong>Correct Answer: </strong>{item.correctAns}</h2>
                <h2 className='p-2 border rounded-lg bg-blue-50 text-md text-primary'><strong>Feedback: </strong>{item.feedback}</h2>
              </div>
            </CollapsibleContent>
          </Collapsible>
          
        ))}
        <Link href={'/dashboard'}>
        <button className='p-3 bg-blue-500 text-white rounded-lg'>Go Home</button>
        </Link>
    </div>
  )
}

export default Feedback