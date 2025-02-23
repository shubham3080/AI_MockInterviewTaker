import { useRouter } from 'next/navigation'
import React from 'react'

function InterviewItemCard({interview}) {
    const router=useRouter()
    const onStart=()=>{
        router.push('/dashboard/interview/'+interview?.mockId)
    }
    const onFeedback=()=>{
        router.push('/dashboard/interview/'+interview?.mockId+'/feedback')
    }
  return (
    <div className='border shadow-sm rounded-lg p-3'>
        <h2 className='font-bold text-primary'>{interview?.jobPosition}</h2>
        <h2 className='text-md text-gray-700'>{interview?.jobExperience} Years of Experience </h2>
        <h2 className='text-md text-gray-700'>Created At: {interview?.createdAt}</h2>
        <div className='flex justify-between mt-2 gap-10' >
            <button className='border rounded-lg p-2 w-full' onClick={onFeedback}>Feedback</button>
            <button className='border rounded-lg px-3 py-2 text-white bg-blue-500 w-full' onClick={onStart}>Start</button>
        </div>
    </div>
  )
}

export default InterviewItemCard