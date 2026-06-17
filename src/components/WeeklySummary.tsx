import React from "react";
import { DailyRecord } from "../types";
import { Calendar, Droplet, Flame, Trophy, ChevronLeft, ChevronRight } from "lucide-react";

interface WeeklySummaryProps {
  history: DailyRecord[];
  onSelectDate: (date: string) => void;
  selectedDate: string;
}

export const WeeklySummary: React.FC<WeeklySummaryProps> = ({
  history,
  onSelectDate,
  selectedDate,
}) => {
  // Get last 7 days ending with today (represented in state)
  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    return days[date.getDay()];
  };

  const getShortDate = (dateStr: string) => {
    const parts = dateStr.split("-");
    return parts.length === 3 ? `${parts[2]}/${parts[1]}` : dateStr;
  };

  return (
    <div id="weekly-sheet" className="paper-texture p-5 border border-[#dfcca6] rounded-xl shadow-md relative">
      {/* Tape on top of paper to look like tape on notebook */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 h-5 w-24 bg-yellow-100/60 border-l border-r border-[#d9cea6] opacity-85 rotate-[-1deg] shadow-[0_1px_2px_rgba(0,0,0,0.05)]"></div>

      <div className="flex items-center justify-between mb-4 mt-1">
        <h3 className="font-serif font-black text-[#5c4a37] text-sm flex items-center gap-1.5 uppercase tracking-wide">
          <Calendar className="w-4 h-4 text-amber-700" />
          Agenda Harian & Mingguan
        </h3>
        <span className="text-[10px] font-mono bg-[#eae0c6] px-2 py-0.5 rounded text-[#715c43] border border-[#dfcca6] uppercase font-semibold">
          Kilas Balik 7 Hari
        </span>
      </div>

      {/* Days grid - Interactive Calendars */}
      <div className="grid grid-cols-7 gap-1.5 mb-5">
        {history.map((record) => {
          const totalCalories = record.foodLogs.reduce((sum, item) => sum + item.calories, 0);
          const calorieTarget = record.calorieTarget || 2000;
          const waterTarget = record.waterTarget || 2000;
          
          const isCalorieStatusOk = totalCalories <= calorieTarget;
          const isWaterStatusOk = record.waterIntake >= waterTarget;
          const isSelected = record.date === selectedDate;

          return (
            <button
              key={record.date}
              onClick={() => onSelectDate(record.date)}
              className={`p-2 rounded-lg flex flex-col items-center transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#6b553d] text-[#fffef0] shadow-[0_3px_6px_rgba(0,0,0,0.25)] scale-102 border border-[#4a3a29]"
                  : "bg-[#f1ebd9] hover:bg-[#e9e1cc] text-[#5c4a37] border border-[#d2c2a0]"
              }`}
            >
              <span className="text-[10px] font-serif font-bold uppercase block leading-none">
                {getDayName(record.date)}
              </span>
              <span className="text-[11px] font-mono mt-0.5 font-bold block leading-none">
                {getShortDate(record.date)}
              </span>
              
              {/* Mini Indicators */}
              <div className="flex gap-0.5 mt-2">
                {/* Calorie dot */}
                <div 
                  className={`w-1.5 h-1.5 rounded-full ${
                    totalCalories === 0 
                      ? "bg-stone-300" 
                      : isCalorieStatusOk 
                        ? "bg-emerald-500" 
                        : "bg-rose-500"
                  }`}
                  title={`Kalori: ${totalCalories} / ${calorieTarget}`}
                ></div>
                {/* Water dot */}
                <div 
                  className={`w-1.5 h-1.5 rounded-full ${
                    record.waterIntake === 0 
                      ? "bg-stone-300" 
                      : isWaterStatusOk 
                        ? "bg-sky-500" 
                        : "bg-amber-500"
                  }`}
                  title={`Air: ${record.waterIntake}ml`}
                ></div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Week statistics chart & analysis */}
      <div className="bg-[#f0e6cc] p-3.5 rounded-lg border border-[#dacbae] space-y-3 font-sans">
        <h4 className="font-serif font-bold text-xs text-[#5c4a37] uppercase tracking-wide border-b border-[#dfcca6] pb-1">
          Laporan Kemajuan Mingguan Anda
        </h4>
        
        {(() => {
          const activeDays = history.filter(day => day.foodLogs.length > 0 || day.waterIntake > 0);
          if (activeDays.length === 0) {
            return (
              <p className="text-xs text-[#7c6a53] italic text-center py-2 font-handwritten">
                "Belum ada catatan aktivitas. Silakan tambahkan makanan atau air minum hari ini."
              </p>
            );
          }

          const avgCalories = Math.round(
            activeDays.reduce((sum, d) => sum + d.foodLogs.reduce((s, f) => s + f.calories, 0), 0) / activeDays.length
          );
          const avgWater = Math.round(
            activeDays.reduce((sum, d) => sum + d.waterIntake, 0) / activeDays.length
          );

          const calorieGoalsMet = activeDays.filter(
            d => d.foodLogs.reduce((s, f) => s + f.calories, 0) <= d.calorieTarget && d.foodLogs.length > 0
          ).length;

          const waterGoalsMet = activeDays.filter(
            d => d.waterIntake >= d.waterTarget
          ).length;

          return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-1 select-none">
              {/* Calorie avg card - skeuomorphic block */}
              <div className="bg-[#fcfaf2] border border-[#d2c5aa] p-3 rounded shadow-sm">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] text-[#7a6750] uppercase font-bold tracking-wider">Rata-rata Kalori</span>
                  <Flame className="w-3.5 h-3.5 text-orange-500" />
                </div>
                <div className="font-mono text-lg font-black text-[#5c4a37]">
                  {avgCalories} <span className="text-[10px] text-stone-500 font-normal">kcal / hari</span>
                </div>
                <div className="text-[9px] text-stone-500 mt-1 flex items-center gap-1">
                  <Trophy className="w-3 h-3 text-amber-500 shrink-0" />
                  <span>{calorieGoalsMet} hari kalori ideal</span>
                </div>
              </div>

              {/* Water avg card */}
              <div className="bg-[#fcfaf2] border border-[#d2c5aa] p-3 rounded shadow-sm">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] text-[#7a6750] uppercase font-bold tracking-wider">Rata-rata Air</span>
                  <Droplet className="w-3.5 h-3.5 text-[#0284c7]" />
                </div>
                <div className="font-mono text-lg font-black text-[#0284c7]">
                  {avgWater} <span className="text-[10px] text-stone-500 font-normal">mL / hari</span>
                </div>
                <div className="text-[9px] text-stone-500 mt-1 flex items-center gap-1">
                  <Trophy className="w-3 h-3 text-emerald-500 shrink-0" />
                  <span>Target hidrasi tercapai {waterGoalsMet}x</span>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Aesthetic polaroid corner tape info */}
      <div className="mt-4 border-t border-[#dfcca6] pt-3 flex justify-between items-center">
        <div className="text-[9px] text-[#85725d] font-handwritten italic">
          * Selalu usahakan hidrasi terpenuhi di atas 2000 mL per hari!
        </div>
        <div className="text-[9px] font-mono whitespace-nowrap text-zinc-500/80">
          PROSES ENERGI AKTIF
        </div>
      </div>
    </div>
  );
};
