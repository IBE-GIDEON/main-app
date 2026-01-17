"use client";

interface HeyzenpopupProps {
  message?: string;
  thinking?: boolean;

}

export default function Heyzenpopup({
  
}: HeyzenpopupProps) {
 


  return (
    <div className=" inset-0 z-50 flex items-start justify-center pt-6">
      {/* Popup Card */}
      <div
        className="relative w-[1800px] h-[70px] mt-[-20px] rounded-[22px] bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden pointer-events-auto"
      style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(0,0,0,0.25))",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
        }}
      >
        {/* Glowing Animated Border */}
        <div className="" />

        {/* Content */}
        <div className="relative z-10 px-5 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
           
          
            <p className="text-white text-sm font-medium tracking-wide drop-shadow-md">
              
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}


