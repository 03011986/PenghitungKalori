import React, { useState } from "react";
import { GlassWater, Beer, ArrowDown, Flame, Coffee, Minus } from "lucide-react";

interface WaterMeterProps {
  currentWater: number;
  targetWater: number;
  onUpdateWater: (amount: number) => void;
}

export const WaterMeter: React.FC<WaterMeterProps> = ({
  currentWater,
  targetWater,
  onUpdateWater,
}) => {
  const percentage = Math.min((currentWater / targetWater) * 100, 100);

  // Array of bubble offsets for decorative skeuo bubble flow
  const bubbles = [
    { left: "12%", delay: "0s", size: "w-1.5 h-1.5", duration: "3s" },
    { left: "28%", delay: "1.2s", size: "w-2 h-2", duration: "4s" },
    { left: "45%", delay: "0.5s", size: "w-1 h-1", duration: "2.5s" },
    { left: "62%", delay: "1.8s", size: "w-3 h-3", duration: "5s" },
    { left: "78%", delay: "0.9s", size: "w-1.5 h-1.5", duration: "3.5s" },
    { left: "85%", delay: "2.3s", size: "w-2 h-2", duration: "4.5s" },
  ];

  return (
    <div id="water-physics-card" className="bg-[#fcfaf2] border-2 border-[#dcd1ba] rounded-xl p-4 shadow-[0_4px_8px_rgba(0,0,0,0.08)] relative overflow-hidden flex flex-col items-center">
      <div className="text-center font-serif text-[#5c4a37] font-bold text-xs tracking-wider uppercase mb-3">
        TANGKI HIDRASI DISPENSER
      </div>

      <div className="flex gap-4 w-full items-center justify-center">
        {/* The Glass Jar */}
        <div className="relative w-28 h-56 bg-stone-300/30 border-3 border-stone-400 rounded-b-2xl rounded-t-md shadow-[inset_0_4px_12px_rgba(0,0,0,0.15),0_6px_12px_rgba(0,0,0,0.2)] flex items-end overflow-hidden water-gloss">
          
          {/* Glass Gloss highlight stripes (done in CSS classes, but here we add another nice glare) */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-gradient-to-r from-white/15 via-white/5 to-black/10 z-20"></div>
          <div className="absolute top-4 left-3 w-1.5 h-48 bg-white/40 rounded-full blur-[0.5px] z-20 pointer-events-none"></div>

          {/* Liquid content fills from bottom */}
          <div 
            className="w-full bg-gradient-to-t from-sky-600 via-sky-500 to-cyan-400 opacity-90 transition-all duration-1000 relative"
            style={{ height: `${percentage}%` }}
          >
            {/* Waves top highlight */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-sky-200/90 blur-[1px]"></div>
            
            {/* Animating Bubbles inside liquid */}
            {percentage > 5 && bubbles.map((b, i) => (
              <div
                key={i}
                className={`absolute bottom-0 rounded-full bg-white/50 animate-bounce ${b.size}`}
                style={{
                  left: b.left,
                  animationDelay: b.delay,
                  animationDuration: b.duration,
                  opacity: 0.6,
                }}
              ></div>
            ))}
          </div>

          {/* Typewriter measurement tics overlay */}
          <div className="absolute top-0 bottom-0 left-2 right-0 flex flex-col justify-between py-4 text-[9px] font-mono text-zinc-600 font-semibold z-10 pointer-events-none select-none">
            <div className="flex items-center space-x-1">
              <span className="w-2.5 h-[1.5px] bg-stone-500"></span>
              <span>2.5 L</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-1.5 h-[1px] bg-stone-500/80"></span>
              <span>2.0 L</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2.5 h-[1.5px] bg-stone-500"></span>
              <span>1.5 L</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-1.5 h-[1px] bg-stone-500/80"></span>
              <span>1.0 L</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2.5 h-[1.5px] bg-stone-500"></span>
              <span>0.5 L</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2.5 h-[1.5px] bg-stone-500"></span>
              <span className="text-[7px]">KOSONG</span>
            </div>
          </div>
        </div>

        {/* Tactical Buttons */}
        <div className="flex flex-col gap-2.5 justify-center">
          {/* Glass Button (+250ml) */}
          <button
            onClick={() => onUpdateWater(250)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-serif font-bold text-[#453729] bg-gradient-to-r from-[#dfcca6] to-[#cfbaa0] border border-[#a8997a] rounded-lg shadow-sm hover:from-[#e8d7b7] active:translate-y-0.5 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] transition-all cursor-pointer"
          >
            <GlassWater className="w-4 h-4 text-sky-600" />
            <div className="text-left leading-none">
              <span className="block font-mono text-[9px]">MINUM</span>
              <span>+250 mL</span>
            </div>
          </button>

          {/* Bottle Button (+600ml) */}
          <button
            onClick={() => onUpdateWater(600)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-serif font-bold text-[#453729] bg-gradient-to-r from-[#dfcca6] to-[#cfbaa0] border border-[#a8997a] rounded-lg shadow-sm hover:from-[#e8d7b7] active:translate-y-0.5 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] transition-all cursor-pointer"
          >
            <Beer className="w-4 h-4 text-cyan-600" />
            <div className="text-left leading-none">
              <span className="block font-mono text-[9px]">BOTOL</span>
              <span>+600 mL</span>
            </div>
          </button>

          {/* Subtract Button (-250ml) */}
          <button
            disabled={currentWater < 250}
            onClick={() => onUpdateWater(-250)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-serif font-bold text-[#7a4c4c] disabled:opacity-40 disabled:pointer-events-none bg-gradient-to-r from-[#f5d9d9] to-[#ebd0d0] border border-[#c4a9a9] rounded-lg shadow-sm hover:from-[#fadada] active:translate-y-0.5 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] transition-all cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" />
            <div className="text-left leading-none">
              <span className="block font-mono text-[8px] opacity-75">RALAT</span>
              <span>-250 mL</span>
            </div>
          </button>
        </div>
      </div>

      {/* Numerical Counter */}
      <div className="mt-3.5 bg-[#eae3cf] px-3.5 py-1.5 rounded-lg border border-[#d2c9b4] flex items-center justify-between w-full shadow-inner select-none font-sans">
        <span className="text-[11px] text-[#7a6a50] font-semibold">Tercapai Hari Ini:</span>
        <span className="font-mono text-sm font-bold text-sky-700">
          {currentWater} <span className="text-[10px] text-zinc-500">/ {targetWater} mL</span>
        </span>
      </div>
    </div>
  );
};
