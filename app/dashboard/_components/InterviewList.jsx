"use client"
import { useUser } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'
import { MockInterview } from '../../../utils/schema'
import { db } from '../../../utils/db'
import { desc, eq } from 'drizzle-orm'
// import { index } from 'drizzle-orm/mysql-core'
import InterviewItemCard from './InterviewItemCard'
function interviewList() {
    const {user}=useUser();
    const [interviewList,setInterviewList]=useState([]);
    useEffect(()=>{
        user&&GetInterviewList();
    },[user])
    const GetInterviewList=async()=>{
        const result=await db.select()
        .from(MockInterview)
        .where(eq(MockInterview.createdBy,user?.primaryEmailAddress?.emailAddress))
        .orderBy(desc(MockInterview.id));

        console.log(result)
        setInterviewList(result)
    }
  return (
    <div>
        <h2 className='font-medium text-xl'>Previous Mock Interview</h2>
        <div  className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 my-3 gap-5'>
            {interviewList&&interviewList.map((interview,index)=>(
                <InterviewItemCard 
                interview={interview}
                key={index}/>
            ))

            }
        </div>
    </div>
  )
}

export default interviewList