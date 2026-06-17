import React, { useState } from "react";
import { FoodLog, AIAnalysisResult } from "../types";
import { Plus, Trash2, Clock, Sparkles, Image, Eye } from "lucide-react";

interface FoodDiaryProps {
  logs: FoodLog[];
  onAddLog: (log: Omit<FoodLog, "id">) => void;
  onDeleteLog: (id: string) => void;
}

export const FoodDiary: React.FC<FoodDiaryProps> = ({
  logs,
  onAddLog,
  onDeleteLog,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedPolaroid, setSelectedPolaroid] = useState<FoodLog | null>(null);

  // Manual form state
  const [foodName, setFoodName] = useState("");
  const [time, setTime] = useState("");
  const [calories, setCalories] = useState("");
  const [carbs, setCarbs] = useState("");
  const [protein, setProtein] = useState("");
  const [fat, setFat] = useState("");

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName || !calories) return;

    // Get current clock hours if not set
    let logTime = time;
    if (!logTime) {
      const now = new Date();
      logTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    }

    onAddLog({
      foodName,
      time: logTime,
      calories: parseInt(calories) || 0,
      carbs: parseInt(carbs) || 0,
      protein: parseInt(protein) || 0,
      fat: parseInt(fat) || 0,
      isAiAnalyzed: false,
    });

    // Reset Form
    setFoodName("");
    setCalories("");
    setCarbs("");
    setProtein("");
    setFat("");
    setTime("");
    setShowAddForm(false);
  };

  return (
    <div id="journal-ledger-page" className="paper-texture p-5 border border-[#dfcca6] rounded-xl shadow-md min-h-[450px] relative select-none">
      
      {/* Brass rivets/rings motif on outer left edge */}
      <div className="absolute top-1/2 -left-3 -translate-y-1/2 flex flex-col gap-10 items-center pointer-events-none">
        <div className="w-5 h-5 rounded-full ring-binding"></div>
        <div className="w-5 h-5 rounded-full ring-binding"></div>
        <div className="w-5 h-5 rounded-full ring-binding"></div>
      </div>

      <div className="flex justify-between items-center border-b-2 border-dashed border-[#dcd1ba] pb-2 mb-4">
        <h3 className="font-serif font-black text-[#5c4a37] text-sm uppercase tracking-wider flex items-center gap-1.5">
          📝 Catatan Makanan harian
        </h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-2.5 py-1 text-[10px] font-serif font-extrabold uppercase bg-neutral-900 text-white rounded shadow-sm hover:bg-neutral-800 active:translate-y-0.5 cursor-pointer flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          {showAddForm ? "Batal" : "Tambah Manual"}
        </button>
      </div>

      {/* Manual Add Form (Animated dropdown entry inside note book paper) */}
      {showAddForm && (
        <form onSubmit={handleManualAdd} className="bg-[#f0e6cc] p-4 rounded-lg border border-[#dfcca6] mb-5 space-y-3.5 animate-fade-in">
          <div className="text-[10px] text-[#715c43] font-bold uppercase tracking-wider">
            Log Manual Makanan Baru
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase font-bold text-stone-600 mb-1">Nama Makanan</label>
              <input
                type="text"
                required
                placeholder="cth: Nasi Goreng Telur"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                className="w-full bg-[#fcfaf2] border border-[#d2c5aa] rounded px-2.5 py-1.5 text-xs text-stone-800 font-serif"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-stone-600 mb-1">Waktu Makan</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-[#fcfaf2] border border-[#d2c5aa] rounded px-2.5 py-1.5 text-xs text-stone-800 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div>
              <label className="block text-[8px] uppercase font-bold text-stone-500 mb-0.5">Kalori (kcal)</label>
              <input
                type="number"
                required
                min="0"
                placeholder="250"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="w-full bg-[#fcfaf2] border border-[#d2c5aa] rounded px-2 py-1 text-xs text-stone-800 font-mono text-center"
              />
            </div>
            <div>
              <label className="block text-[8px] uppercase font-bold text-stone-500 mb-0.5">Karbo (g)</label>
              <input
                type="number"
                min="0"
                placeholder="40"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                className="w-full bg-[#fcfaf2] border border-[#d2c5aa] rounded px-2 py-1 text-xs text-stone-800 font-mono text-center"
              />
            </div>
            <div>
              <label className="block text-[8px] uppercase font-bold text-stone-500 mb-0.5">Protein (g)</label>
              <input
                type="number"
                min="0"
                placeholder="10"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                className="w-full bg-[#fcfaf2] border border-[#d2c5aa] rounded px-2 py-1 text-xs text-stone-800 font-mono text-center"
              />
            </div>
            <div>
              <label className="block text-[8px] uppercase font-bold text-stone-500 mb-0.5">Lemak (g)</label>
              <input
                type="number"
                min="0"
                placeholder="5"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                className="w-full bg-[#fcfaf2] border border-[#d2c5aa] rounded px-2 py-1 text-xs text-stone-800 font-mono text-center"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-[#5c4a37] text-[#fffef0] font-serif font-black text-xs uppercase rounded hover:bg-[#4a3a29] shadow active:translate-y-0.5 cursor-pointer"
          >
            Tambahkan Makanan
          </button>
        </form>
      )}

      {/* Ledger lists (lined paper look) */}
      <div className="space-y-1.5">
        {logs.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-handwritten text-lg text-stone-400 italic">
              "Buku harian masih kosong."
            </p>
            <p className="text-[10px] text-zinc-400/80 mt-1 font-serif uppercase">
              Gunakan kamera AI di bawah atau tambah log manual
            </p>
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="flex items-center gap-3 py-2 px-1.5 border-b border-[#dfcca6] hover:bg-[#eae0c6]/20 transition-all rounded"
            >
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-800" />
                <span className="font-mono text-[11px] text-[#715c43]">{log.time}</span>
              </div>

              {/* Polaroid icon trigger if log has photo */}
              {log.imageUrl && (
                <button
                  type="button"
                  onClick={() => setSelectedPolaroid(log)}
                  className="w-10 h-10 rounded overflow-hidden border border-amber-800/60 shadow-sm relative group cursor-pointer hover:brightness-105 shrink-0"
                  title="Lihat polaroid"
                >
                  <img src={log.imageUrl} alt={log.foodName} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye className="w-4 h-4 text-white" />
                  </div>
                </button>
              )}

              {/* Food Details - Handwritten styling */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-serif font-black text-xs text-[#453423] truncate">
                    {log.foodName}
                  </span>
                  {log.isAiAnalyzed && (
                    <span
                      title="Dianalisis oleh Gemini AI"
                      className="px-1 text-[8px] bg-red-100 text-red-700 font-bold border border-red-200 rounded shrink-0 uppercase tracking-widest"
                    >
                      AI
                    </span>
                  )}
                </div>

                {/* Macro summary line */}
                <span className="block text-[10px] font-mono text-stone-500">
                  C: {log.carbs}g · P: {log.protein}g · F: {log.fat}g
                </span>
                
                {/* Ingredient list if any */}
                {log.ingredients && log.ingredients.length > 0 && (
                  <span className="block text-[8px] text-[#86735a] font-sans truncate">
                    Bahan: {log.ingredients.join(", ")}
                  </span>
                )}
              </div>

              {/* Right side calories readout */}
              <div className="text-right shrink-0 pr-1 select-none">
                <span className="font-mono text-xs font-black text-[#5c4a37]">
                  {log.calories}
                </span>
                <span className="text-[8px] text-neutral-500 font-mono block">kcal</span>
              </div>

              {/* Trash button */}
              <button
                onClick={() => onDeleteLog(log.id)}
                className="p-1 px-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50/70 rounded transition-all cursor-pointer"
                title="Hapus record"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Retro Total Ledger tally on paper bottom */}
      {logs.length > 0 && (
        <div className="mt-6 pt-3 border-t-2 border-dashed border-[#dcd1ba] flex justify-between items-center bg-[#f0e8cc]/40 py-1.5 px-3 rounded select-none">
          <span className="text-[10px] font-serif font-extrabold uppercase text-[#715c43] tracking-wider">
            Akumulasi Harian:
          </span>
          <span className="font-mono text-xs font-black text-orange-800 bg-[#dfd6bc] px-2 py-0.5 rounded border border-[#cbbaa4]">
            {logs.reduce((sum, item) => sum + item.calories, 0)} kcal
          </span>
        </div>
      )}

      {/* Polaroid View lightbox modal popup */}
      {selectedPolaroid && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0" onClick={() => setSelectedPolaroid(null)}></div>
          <div className="bg-white p-4 rounded shadow-2xl border border-stone-300 relative max-w-sm w-full rotate-[-1deg] transition-all duration-300 z-10 flex flex-col items-center">
            {/* Real aesthetic Polaroid tape */}
            <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 h-5 w-24 bg-yellow-100/70 border-l border-r border-amber-100 opacity-90 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"></div>

            <div className="bg-[#1a1a1a] p-1 shadow-inner aspect-square w-full rounded-[1px] relative overflow-hidden flex items-center justify-center border border-neutral-900">
              <img
                src={selectedPolaroid.imageUrl}
                alt={selectedPolaroid.foodName}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="mt-4 text-center w-full">
              <h4 className="font-handwritten text-xl font-bold text-red-700 leading-none">
                {selectedPolaroid.foodName}
              </h4>
              <p className="text-[10px] font-mono text-zinc-400 mt-1 uppercase tracking-wider">
                DIANALISIS GEMINI AI · {selectedPolaroid.time}
              </p>

              {/* Macros summary card inside lightbox */}
              <div className="mt-3.5 bg-[#fcfaf2] border border-stone-200 p-2.5 rounded text-left space-y-2 font-sans select-none text-xs">
                <div className="grid grid-cols-4 gap-1.5 text-center">
                  <div className="bg-orange-50/50 p-1 rounded font-mono">
                    <span className="block text-[8px] text-orange-600">KALORI</span>
                    <span className="font-bold text-[#5c4a37]">{selectedPolaroid.calories}</span>
                  </div>
                  <div className="bg-amber-50/50 p-1 rounded font-mono">
                    <span className="block text-[8px] text-amber-600">KARBOHIDRAT</span>
                    <span className="font-bold text-[#5c4a37]">{selectedPolaroid.carbs}s</span>
                  </div>
                  <div className="bg-teal-50/50 p-1 rounded font-mono">
                    <span className="block text-[8px] text-teal-600">PROTEIN</span>
                    <span className="font-bold text-[#5c4a37]">{selectedPolaroid.protein}g</span>
                  </div>
                  <div className="bg-red-50/50 p-1 rounded font-mono">
                    <span className="block text-[8px] text-red-600">LEMAK</span>
                    <span className="font-bold text-[#5c4a37]">{selectedPolaroid.fat}g</span>
                  </div>
                </div>

                {selectedPolaroid.ingredients && selectedPolaroid.ingredients.length > 0 && (
                  <div>
                    <span className="block text-[8px] text-zinc-400 uppercase font-bold tracking-wider mb-0.5">Bahan Makanan:</span>
                    <p className="text-[10px] text-zinc-700 leading-normal">
                      {selectedPolaroid.ingredients.join(", ")}
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedPolaroid(null)}
                className="mt-4 px-4 py-1.5 bg-[#4a3a29] text-white hover:bg-[#5c4a37] text-xs font-serif uppercase tracking-widest rounded-md w-full cursor-pointer transition-colors"
              >
                Tutup Polaroid
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
