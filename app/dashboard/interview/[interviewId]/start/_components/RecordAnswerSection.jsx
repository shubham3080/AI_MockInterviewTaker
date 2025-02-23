"use client"
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import {Mic} from 'lucide-react'
import useSpeechToText from 'react-hook-speech-to-text';
import { toast, Toaster } from 'sonner';
import { chatSession } from '@/utils/GeminiAiModel.js';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { db } from '../../../../../../utils/db';
import { UserAnswer } from '../../../../../../utils/schema';

function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex ,interviewData}) {
    // const waitForMockId = async () => {
    //     if (!interviewData?.mockId) {
    //         toast.error("Mock interview reference ID is missing.");
    //         return;
    //       }
    //       console.log("hello")
    //     return interviewData.mockId;
    //   };
    // console.log(db.select('userAnswer').mockId)
    const [userAnswer,setUserAnswer]=useState('');
    const user=useUser();
    const [loading,setLoading]=useState(false);
    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
        setResults
      } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
      });
      useEffect(()=>{
        // setUserAnswer('')
        results.map((result)=>setUserAnswer(prevAns=>prevAns+result?.transcript))
      },[results])

      useEffect(()=>{
        if(!isRecording&&userAnswer.length>10){
            UpdateUserAnswer()
        }
      },[userAnswer])

      const SaveUserAnswer=async()=>{
        if(isRecording){
            stopSpeechToText()
            // if(userAnswer?.length<10){
            //     setLoading(false)
            //     toast('Error while saving the answer please record again')
            //     return;
            // }
            
        }
        else{
            startSpeechToText()
        }
      }
      const UpdateUserAnswer=async()=>{
        // setUserAnswer(',')
        setLoading(true);
        const feedbackPrompt="Question:"+mockInterviewQuestion[activeQuestionIndex]?.question+", User Answer:"+userAnswer+",Depending on question and user answer for given interview question please give a rating for the answer on a scale of 10 and feedback as area of improvement in 3-5 lines in JSON format with rating feild and feedback feild and dont give anything extra in the start or end so that i can directly do json.parse on your response"
            const result=await chatSession.sendMessage(feedbackPrompt)
            const rawResponse = await result.response.text(); // Ensure `response.text()` is properly awaited
  
            // Clean up JSON-like response by removing Markdown code block delimiters
            const cleanedResponse = rawResponse
              .replace("```json", "")
              .replace("```", "")
              .replace(/\\"/g, '"')
              .replace(/}","{/g, "},{");
                
            // Parse and log the JSON response
            const parsedResponse = JSON.parse(cleanedResponse);
            console.log("AI Response (Parsed):", parsedResponse);
            
            const resp=await db.insert(UserAnswer)
            .values({
                mockIdRef:interviewData?.mockId,
                question:mockInterviewQuestion[activeQuestionIndex]?.question,
                correctAns:mockInterviewQuestion[activeQuestionIndex]?.answer,
                userAns:userAnswer,
                feedback:parsedResponse?.feedback,
                rating:parsedResponse?.rating,
                userEmail:user?.primaryEmailAddress?.emailAddress,
                createdAt:moment().format('DD-MM-yyyy')
            })
            
            if(resp){
                toast('User Answer recorded successfully')
                setUserAnswer('');
                setResults([])
            }
            setResults([])
            setLoading(false)
      }
  return (
    <div className='flex flex-col items-center justify-center'>
        <div className='bg-black mx-10 h-[500px] w-full mt-10 border rounded-lg'>
        <Webcam
        mirrored={true}
        style={{
            height:500,
            width:'100%',
            zIndex:10,
            padding:80
        }}/>
        </div>
        <button disabled={loading} className='bg-blue-500 text-white border p-3 rounded-lg my-4 mx-10 flex'
        onClick={SaveUserAnswer}>
            {isRecording?
            <h2 className='text-red-600 flex gap-2'>
                <Mic/> Stop Recording....
            </h2>:
            'Record Answer'}</button>
        
        {/* <button className='bg-blue-500 text-white border p-3 rounded-lg my-4 mx-10' onClick={() => console.log(userAnswer)}>Show User Answer</button> */}
    </div>
  )
}

export default RecordAnswerSection