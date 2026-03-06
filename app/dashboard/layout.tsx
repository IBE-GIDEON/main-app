"use client";

import React, { useState } from "react";
/* Think AI Component Imports */
import Aicontentspace from "@/components/Aicontentspace";
import Searchbar from "@/components/Searchbar";
import SidebarContainer from "@/components/SidebarContainer";

/* Logic & Types */
import { useChat } from "@/hooks/useChat";

export default function ChatLayout() {
  const [started, setStarted] = useState(false);

  /* useChat handles the recursive refinement logic. 
     'loading' triggers our glasmorphic typing indicators.
  */
  const { messages, loading, send, clear } = useChat();

  return (
    /* THE SHELL: 
       'h-screen' and 'overflow-hidden' are the security guards. 
       They prevent the browser itself from scrolling.
    */
    <div className="flex bg-[#050505] h-screen w-full overflow-hidden text-white">
      
      {/* Sidebar stays fixed - won't shrink */}
      <SidebarContainer />

      {/* MAIN CONTENT AREA:
          'min-w-0' is critical. It stops long AI strings from 
          stretching this container horizontally.
      */}
      <div className="flex flex-col flex-1 min-w-0 h-full relative">
        
        {/* SCROLLABLE CONTENT SPACE:
            'flex-1' fills the gap. 
            'min-h-0' forces the content to scroll INSIDE this div
            instead of pushing the Searchbar down.
        */  }
        <div className="flex-1 min-h-0 w-full">
          <Aicontentspace
            messages={messages}
            isTyping={loading}
            onSpawnQuestion={(q) => send(q)}
          />
        </div>

        {/* SEARCHBAR AREA:
            'flex-none' keeps this at the bottom regardless of content size.
            The max-width ensures a clean 'Decision Engine' look.
        */}
        <div className="flex-none w-full max-w-4xl mx-auto p-4 md:p-8">
          <Searchbar
            isLoading={loading}
            onMicClick={() => setStarted(true)}
            onResult={(text) => {
              setStarted(true);
              send(text);
            }}
          />
        </div>

      </div>
    </div>
  );
}