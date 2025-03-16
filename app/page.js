// import { Button } from "@/components/ui/button";
// import Image from "next/image";
"use client"
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter('');
  const onStart1 = () => {
    router.push('/dashboard')
  }
  const onStart2 = () => {
    window.open("https://study-mate-lake.vercel.app", "_blank", "noopener,noreferrer");
  }
  return (
    <div className="flex justify-items-center align-middle">
        <button className='border rounded-lg px-3 py-2 text-white bg-blue-500' onClick={onStart1}>MockInterview</button>
        <button className='border rounded-lg px-3 py-2 text-white bg-blue-500 ' onClick={onStart2}>Notes Generation</button>
    </div>
  );
}
