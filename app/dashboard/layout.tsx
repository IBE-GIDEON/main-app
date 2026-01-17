"use client"


import "../globals.css";
import SidebarContainer from "@/components/SidebarContainer";
import AppLoader from "@/components/AppLoader";
import { useState, useRef, useEffect } from "react";
import Heyzenpopup from "@/components/Heyzenpopup";
import Aicontentspace from "@/components/Aicontentspace";
import Searchbar from "@/components/Searchbar";
import Gradient from "@/components/Gradient";
import Dashboardnav from "@/components/Dashboardnav";



export default function DashboardLayout(

  {
  children,
}: {
  children: React.ReactNode;
}) 

{
  
 const [show, setShow] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [onMicClick, setOnMicClick] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [messages] = useState<message[]>([
    
   
    { id: "1", role: "user", content: "Hey, can you help me build a workout plan?" },
    {
      id: "2",
      role: "assistant",
      content:
        "Absolutely! I'd love to help you craft a personalized workout plan. What's your fitness level and goal?",
    },

    { id: "3", role: "user", content: "Beginner, want to lose fat and feel stronger" },
{ id: "1", role: "user", content: "Hey, can you help me build a workout plan?" },
    {
      id: "2",
      role: "assistant",
      content:
        "Absolutely! I'd love to help you craft a personalized workout plan. What's your fitness level and goal?",
    },

    { id: "3", role: "user", content: "Beginner, want to lose fat and feel stronger" },
{ id: "1", role: "user", content: "Hey, can you help me build a workout plan?" },
    {
      id: "2",
      role: "assistant",
      content:
        "Absolutely! I'd love to help you craft a personalized workout plan. What's your fitness level and goal?",
    },

    { id: "3", role: "user", content: "Beginner, want to lose fat and feel stronger" },
{ id: "1", role: "user", content: "Hey, can you help me build a workout plan?" },
    {
      id: "2",
      role: "assistant",
      content:
        "Absolutely! I'd love to help you craft a personalized workout plan. What's your fitness level and goal?",
    },

    { id: "3", role: "user", content: "Beginner, want to lose fat and feel stronger" },
{ id: "1", role: "user", content: "Hey, can you help me build a workout plan?" },
    {
      id: "2",
      role: "assistant",
      content:
        "Absolutely! I'd love to help you craft a personalized workout plan. What's your fitness level and goal?",
    },

    { id: "3", role: "user", content: "Beginner, want to lose fat and feel stronger" },
{ id: "1", role: "user", content: "Hey, can you help me build a workout plan?" },
    {
      id: "2",
      role: "assistant",
      content:
        "Absolutely! I'd love to help you craft a personalized workout plan. What's your fitness level and goal?",
    },

    { id: "3", role: "user", content: "Beginner, want to lose fat and feel stronger" },

  ]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);


  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-gray-700 via-white/10 to-gray-600">
   <div className="absolute inset-0 -z-10">

        <div className="top-[-250px] left-[150px] w-[600px] h-[600px] bg-gray-900/30 rounded-full blur-3xl"></div>
        <div className="bottom-[-200px] right-[-200px] w-[550px] h-[550px] bg-indigo-400/20 rounded-full blur-3xl"></div>
        <div className="bottom-[-200px] right-[-200px] w-[550px] h-[550px] bg-black-900/90 rounded-full blur-3xl"></div>
      </div>
   
   <div className="flex h-screen">
    <Gradient />
    <div>
        <SidebarContainer  />
    </div>
    

     {/* MAIN CHAT AREA */}
    <div className="flex flex-col w-full h-full relative">

<Heyzenpopup/>
        {/* CHAT CONTENT */}
        <div
          className={`
            flex-1 overflow-y-auto pb-32 transition-opacity duration-500
            ${hasStarted ? "opacity-100" : "opacity-0 pointer-events-none"}
          `}
        >
          <Aicontentspace messages={messages} isTyping={false} />
        </div>

        {/* SEARCHBAR (CENTER → BOTTOM) */}
        <div
          className={`
            absolute left-1/2 -translate-x-1/2 w-full max-w-3xl px-4
            transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
            ${hasStarted ? "bottom-4" : "top-1/2 -translate-y-1/2"}
          `}
        >
          <div className="bg-black/90 backdrop-blur-xl rounded-3xl shadow-2xl">
           <Searchbar
   
           onMicClick={() => setHasStarted(true)}/>

           </div>
           </div>
          
    </div>
        
       <AppLoader>{children}</AppLoader> 
      </div>
</div>
  );
}
