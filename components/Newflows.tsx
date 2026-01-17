"use client";

import React from 'react'
import { Workflow } from 'lucide-react'
import { useRouter } from 'next/navigation'


const Newflows = () => {
     const router = useRouter();
     const createNewflows = async () => {
      //created a new chatid in store

      router.push(`/chat/676767`);
     };


  return (
    <div 
    onClick={createNewflows}
    className="mt-8 text-[15px] items-center px-0.5 text-white/80 justify-center mb-[-28px]">
  <div className="flex items-center gap-2
        px-2 py-2
        rounded-lg
        cursor-pointer

        text-white/80
        border border-transparent

        bg-transparent
        transition-all duration-300 ease-out

        hover:bg-white/10
        hover:backdrop-blur-md
        hover:border-white/20
        hover:text-white
        hover:shadow-[0_8px_32px_rgba(255,255,255,0.08)]
        active:scale-[0.98]">
        <span><Workflow /></span>
        
          New think
        </div>
    
    </div>
  )
}

export default Newflows