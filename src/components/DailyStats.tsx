import React from "react";
import { Flame, Compass } from "lucide-react";

interface DailyStatsProps {
  currentCalories: number;
  targetCalories: number;
  carbs: number;
  protein: number;
  fat: number;
}

export const DailyStats: React.FC<DailyStatsProps> = ({
  currentCalories,
  targetCalories,
  carbs,
  protein,
  fat,
}) => {
  // Calculate percentage for gauge
  const percentage = Math.min((currentCalories / targetCalories) * 100, 100);
  
  // Angle for speedometer needle: from -90deg (0%) to 90deg (100%)
  const minAngle = -90;
  const maxAngle = 90;
  const needleAngle = minAngle + (percentage / 100) * (maxAngle - minAngle);

  // Targets for macros based on balanced diet (approximate targets)
  // 50% Carbs, 20% Protein, 30% Fat is standard
  const carbTarget = Math.round((targetCalories * 0.5) / 4);
  const proteinTarget = Math.round((targetCalories * 0.2) / 4);
  const fatTarget = Math.round((targetCalories * 0.3) / 9);

  const carbPerc = Math.min((carbs / carbTarget) * 100, 100);
  const proteinPerc = Math.min((protein / proteinTarget) * 100, 100);
  const fatPerc = Math.min((fat / fatTarget) * 100, 100);

  return (
    <div id="stats-mechanical-panel" className="bg-[#f5ebd2] border-2 border-[#d9cbb0] rounded-xl p-4 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),0_4px_8px_rgba(0,0,0,0.1)] relative overflow-hidden">
      {/* Brass Screws at Corners */}
      <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-gradient-to-br from-yellow-100 via-amber-400 to-amber-700 shadow-sm border border-amber-800 flex items-center justify-center">
        <div className="w-1.5 h-[1px] bg-amber-950 rotate-45"></div>
      </div>
      <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-gradient-to-br from-yellow-100 via-amber-400 to-amber-700 shadow-sm border border-amber-800 flex items-center justify-center">
        <div className="w-1.5 h-[1px] bg-amber-950 -rotate-45"></div>
      </div>
      <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full bg-gradient-to-br from-yellow-100 via-amber-400 to-amber-700 shadow-sm border border-amber-800 flex items-center justify-center">
        <div className="w-1.5 h-[1px] bg-amber-950 -rotate-12"></div>
      </div>
      <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-gradient-to-br from-yellow-100 via-amber-400 to-amber-700 shadow-sm border border-amber-800 flex items-center justify-center">
        <div className="w-1.5 h-[1px] bg-amber-950 rotate-75"></div>
      </div>

      <div className="text-center font-serif text-[#5c4a37] font-bold text-xs tracking-wider uppercase mb-1">
        PENGUKUR ENERGI MEKANIK
      </div>

      <div className="flex flex-col md:flex-row items-center justify-around gap-4 mt-2">
        {/* Speedometer Gauge */}
        <div className="relative w-36 h-24 flex items-center justify-center">
          {/* Gauge dial background */}
          <svg className="w-36 h-24" viewBox="0 0 120 80">
            {/* Background Arch */}
            <path
              d="M 10 70 A 50 50 0 0 1 110 70"
              fill="none"
              stroke="#dfd2b9"
              strokeWidth="10"
              strokeLinecap="round"
            />
            {/* Active Color Arcs */}
            {/* Safe zone - green */}
            <path
              d="M 10 70 A 50 50 0 0 1 60 20"
              fill="none"
              stroke="rgba(34, 197, 94, 0.45)"
              strokeWidth="10"
              strokeDasharray="40 100" // limit visually
            />
            {/* Danger zone - red */}
            <path
              d="M 60 20 A 50 50 0 0 1 110 70"
              fill="none"
              stroke="rgba(239, 68, 68, 0.45)"
              strokeWidth="10"
              strokeDasharray="100 100"
            />

            {/* Scale Tickmarks */}
            <line x1="15" y1="65" x2="22" y2="61" stroke="#8a7355" strokeWidth="1" />
            <line x1="28" y1="45" x2="35" y2="44" stroke="#8a7355" strokeWidth="1" />
            <line x1="60" y1="20" x2="60" y2="28" stroke="#8a7355" strokeWidth="1.5" />
            <line x1="92" y1="45" x2="85" y2="44" stroke="#8a7355" strokeWidth="1" />
            <line x1="105" y1="65" x2="98" y2="61" stroke="#8a7355" strokeWidth="1" />

            {/* Center Pivot and Pins */}
            <circle cx="60" cy="70" r="5" fill="#3a2e2b" />
            <circle cx="60" cy="70" r="7" fill="none" stroke="#a18055" strokeWidth="1.5" />

            {/* Needle */}
            <line
              x1="60"
              y1="70"
              x2="60"
              y2="24"
              stroke="#b91c1c"
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{
                transform: `rotate(${needleAngle}deg)`,
                transformOrigin: "60px 70px",
                transition: "transform 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
              }}
            />
            
            {/* Minimum / Maximum Text labels inside dial */}
            <text x="18" y="78" fill="#78624c" fontSize="6" fontFamily="monospace" textAnchor="middle">0%</text>
            <text x="60" y="15" fill="#78624c" fontSize="7" fontFamily="monospace" textAnchor="middle">50%</text>
            <text x="102" y="78" fill="#78624c" fontSize="6" fontFamily="monospace" textAnchor="middle">100%</text>
          </svg>

          {/* Calorie Readout Box - looks like mechanical counter */}
          <div className="absolute bottom-1 bg-neutral-900 border-2 border-stone-600 rounded px-2.5 py-0.5 shadow-inner flex items-center justify-center space-x-1">
            <span className="text-red-500 font-mono text-xs font-bold font-typewriter tracking-widest">
              {String(currentCalories).padStart(4, '0')}
            </span>
            <span className="text-zinc-500 font-mono text-[9px]">/ kcal</span>
          </div>
        </div>

        {/* Macro dials */}
        <div className="flex-1 w-full space-y-2 select-none">
          {/* Calorie Target Info */}
          <div className="text-[11px] font-sans text-[#7c634a] font-semibold flex justify-between items-center bg-[#eae0c6] px-2 py-1 rounded border border-[#dbcca6] mb-1">
            <span>Kalori Tersisa:</span>
            <span className={`font-mono text-xs font-bold ${targetCalories - currentCalories < 0 ? 'text-red-600' : 'text-green-700'}`}>
              {targetCalories - currentCalories} kcal
            </span>
          </div>

          {/* Carbo Bar */}
          <div>
            <div className="flex justify-between text-[10px] text-[#5c4a37] mb-0.5">
              <span className="font-semibold">🌾 Karbohidrat</span>
              <span className="font-mono">{carbs}g / {carbTarget}g</span>
            </div>
            <div className="h-3.5 bg-[#dfd4b9] rounded-md p-[1.5px] border border-[#cfc0a1] shadow-inner">
              <div 
                className="h-full rounded bg-gradient-to-r from-amber-500 to-yellow-500 shadow-sm transition-all duration-700"
                style={{ width: `${carbPerc}%` }}
              ></div>
            </div>
          </div>

          {/* Protein Bar */}
          <div>
            <div className="flex justify-between text-[10px] text-[#5c4a37] mb-0.5">
              <span className="font-semibold">🥩 Protein</span>
              <span className="font-mono">{protein}g / {proteinTarget}g</span>
            </div>
            <div className="h-3.5 bg-[#dfd4b9] rounded-md p-[1.5px] border border-[#cfc0a1] shadow-inner">
              <div 
                className="h-full rounded bg-gradient-to-r from-emerald-500 to-teal-500 shadow-sm transition-all duration-700"
                style={{ width: `${proteinPerc}%` }}
              ></div>
            </div>
          </div>

          {/* Fat Bar */}
          <div>
            <div className="flex justify-between text-[10px] text-[#5c4a37] mb-0.5">
              <span className="font-semibold">🥑 Lemak</span>
              <span className="font-mono">{fat}g / {fatTarget}g</span>
            </div>
            <div className="h-3.5 bg-[#dfd4b9] rounded-md p-[1.5px] border border-[#cfc0a1] shadow-inner">
              <div 
                className="h-full rounded bg-gradient-to-r from-red-500 to-orange-500 shadow-sm transition-all duration-700"
                style={{ width: `${fatPerc}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
