"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
// import { MockInterview } from "C:/Users/yash/Desktop/StudyMate/my-app/utils/schema.js"
import { chatSession } from '@/utils/GeminiAiModel.js';
import { db } from '@/utils/db.js';
import {v4 as uuidv4} from 'uuid';
import {useUser} from '@clerk/nextjs' ;
import moment from 'moment';
import { useRouter } from 'next/navigation';
import { MockInterview } from '../../../utils/schema';
function AddNewInterview() {
  const [openDailog,setOpenDailog]=useState(false)
  const [jobPosition,setJobPosition]=useState();
  const [jobDesc,setJobDesc]=useState();
  const [jobExperience,setJobExperience]=useState();
  const [loading,setLoading]=useState(false);
  const [jsonResponse,setJsonResponse]=useState([]);
  const router=useRouter();
  const {user}=useUser();

  const onSubmit = async (e) => {
    setLoading(true)
    e.preventDefault();
  
    console.log(jobPosition, jobDesc, jobExperience);
  
    const InputPrompt =
    "just give me a json data dont give anything else in the start or end for "+
      "Job Position: " +
      jobPosition +
      ", Job Description: " +
      jobDesc +
      ", Years of Experience: " +
      jobExperience +
      ", Depends on this information please give me " +
      process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT +
      " Format your response as a JSON array of objects. Each object in the array should have two keys: 'question' and 'answer'.  The 'question' key should contain the interview question, and the 'answer' key should contain a suitable answer for a developer." ;
     try {
        // Send the input pro
        // mpt to the chat session
        const result = await chatSession.sendMessage(InputPrompt);
        
        // Extract the response text
        const rawResponse = await result.response.text(); // Ensure `response.text()` is properly awaited
        console.log(rawResponse,333333333)
        // Clean up JSON-like response by removing Markdown code block delimiters
        const cleanedResponse = rawResponse
          .replace("```json", "")
          .replace("```", "");
        console.log(cleanedResponse)
        // Parse and log the JSON response
        const parsedResponse = JSON.parse(cleanedResponse);
        console.log("AI Response (Parsed):", parsedResponse);
        setJsonResponse(parsedResponse);

        const resp=await db.insert(MockInterview)
        .values({
          mockId:uuidv4(),
          jsonMockResp:parsedResponse,
          jobPosition:jobPosition,
          jobDesc:jobDesc,
          jobExperience:jobExperience,
          createdBy:user?.primaryEmailAddress?.emailAddress,
          createdAt:moment().format('DD-MM-YYYY')
        }).returning({mockId:MockInterview.mockId})
        console.log("inserted id:",resp)
        if(resp){
          setOpenDailog(false);
          router.push('/dashboard/interview/'+resp[0]?.mockId)
        } 
      } catch (error) {
        console.error("Error sending message or parsing response:", error);
      } finally {
        setLoading(false); // End loading state
      }
  };
  

  return (
    <div>
        <div className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all'
        onClick={()=>setOpenDailog(true)}>
            <h2 className='text-lg text-center'>+ Add New</h2>
        </div>
        <Dialog open={openDailog}>
        <DialogContent className="max-w-2xl"> 
          <DialogHeader>
            <DialogTitle className="font-bold text-2xl">Tell us more about your job interviwing</DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
              <div>
                <h2>Add Details .....</h2>
                <div className="mt-7 my-3">
                  <label>Job Role/Job Position</label>
                  <Input placeholder="Ex. Full Stack Developer" 
                  required
                  onChange={(event)=>setJobPosition(event.target.value)}
                  />
                </div>
                <div className="mt-7 my-3">
                  <label>Job Description/ Tech Stack (In Short)</label>
                  <Textarea placeholder="Ex. React,Angular,NodeJs,MySql etc" 
                  required
                  onChange={(event)=>setJobDesc(event.target.value)}
                  />
                </div>
                <div className="mt-7 my-3">
                  <label>Years of experience</label>
                  <Input placeholder="Ex. 5" type="number" max="100" 
                  required
                  onChange={(event)=>setJobExperience(event.target.value)}
                  />
                </div>
              </div>
                 <div className="mt-4 flex space-x-2">
                  {/* Cancel Button */}
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                    onClick={() => setOpenDailog(false)} // Fix typo: Changed Dailog to Dialog for consistency
                  >
                    Cancel
                  </button>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className={`px-4 py-2 rounded transition ${
                      loading
                        ? "bg-blue-400 text-white cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 inline mr-2 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4l3-3-3-3V4a8 8 0 00-8 8z"
                          ></path>
                        </svg>
                        Generating from AI...
                      </>
                    ) : (
                      "Start Interview"
                    )}
                  </button>
                </div>

              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

    </div>
  )
}

export default AddNewInterview