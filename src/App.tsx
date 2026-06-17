import React, { useState, useEffect } from "react";
import { DailyRecord, FoodLog, AIAnalysisResult, UserProfile } from "./types";
import { DailyStats } from "./components/DailyStats";
import { WaterMeter } from "./components/WaterMeter";
import { FoodDiary } from "./components/FoodDiary";
import { WeeklySummary } from "./components/WeeklySummary";
import { AIImagePicker } from "./components/AIImagePicker";
import { BookOpen, Settings, User, Compass, RefreshCw, Flame, Droplet, Check } from "lucide-react";

// Standard preset profile
const DEFAULT_PROFILE: UserProfile = {
  name: "Budi Santoso",
  weight: 70,
  height: 172,
  dailyCalorieTarget: 2100,
  dailyWaterTarget: 2500,
};

// 7-day realistic preset history ending on today (2026-06-17)
const PRESET_HISTORY: DailyRecord[] = [
  {
    date: "2026-06-11",
    calorieTarget: 2100,
    waterTarget: 2500,
    waterIntake: 2000,
    foodLogs: [
      { id: "p1", time: "08:15", foodName: "Bubur Ayam Sunda", calories: 380, carbs: 55, protein: 12, fat: 8 },
      { id: "p2", time: "12:30", foodName: "Nasi Padang Rendang + Sayur Singkong", calories: 750, carbs: 90, protein: 32, fat: 28 },
      { id: "p3", time: "19:00", foodName: "Sate Ayam (5 tusuk) + Lontong", calories: 450, carbs: 42, protein: 28, fat: 14 }
    ]
  },
  {
    date: "2026-06-12",
    calorieTarget: 2100,
    waterTarget: 2500,
    waterIntake: 2500,
    foodLogs: [
      { id: "p4", time: "07:30", foodName: "Roti Bakar Bandung Cokelat Keju", calories: 420, carbs: 62, protein: 10, fat: 12 },
      { id: "p5", time: "13:00", foodName: "Gado-Gado Lontong Kentang", calories: 520, carbs: 70, protein: 14, fat: 18 },
      { id: "p6", time: "18:45", foodName: "Soto Ayam Ambengan + Telur", calories: 410, carbs: 35, protein: 25, fat: 12 }
    ]
  },
  {
    date: "2026-06-13",
    calorieTarget: 2100,
    waterTarget: 2500,
    waterIntake: 2750,
    foodLogs: [
      { id: "p7", time: "09:00", foodName: "Lontong Sayur Betawi", calories: 460, carbs: 58, protein: 11, fat: 16 },
      { id: "p8", time: "13:30", foodName: "Nasi Campur Bali Ayam Sisit", calories: 650, carbs: 78, protein: 30, fat: 20 },
      { id: "p9", time: "19:30", foodName: "Bakso Sapi Urat + Bihun", calories: 480, carbs: 48, protein: 22, fat: 18 }
    ]
  },
  {
    date: "2026-06-14",
    calorieTarget: 2100,
    waterTarget: 2500,
    waterIntake: 1800,
    foodLogs: [
      { id: "p10", time: "08:45", foodName: "Nasi Uduk Komplit Dadar Gulung", calories: 580, carbs: 75, protein: 14, fat: 22 },
      { id: "p11", time: "14:00", foodName: "Mie Goreng Jawa Special", calories: 620, carbs: 85, protein: 18, fat: 20 },
      { id: "p12", time: "20:00", foodName: "Martabak Manis (2 potong)", calories: 500, carbs: 68, protein: 8, fat: 18 }
    ]
  },
  {
    date: "2026-06-15",
    calorieTarget: 2100,
    waterTarget: 2500,
    waterIntake: 2500,
    foodLogs: [
      { id: "p13", time: "07:45", foodName: "Oatmeal Pisang Madu", calories: 320, carbs: 58, protein: 8, fat: 4 },
      { id: "p14", time: "12:15", foodName: "Pecel Madiun + Tempe mendoan", calories: 480, carbs: 60, protein: 15, fat: 16 },
      { id: "p15", time: "19:15", foodName: "Capcay Seafood Kuah", calories: 350, carbs: 28, protein: 24, fat: 10 }
    ]
  },
  {
    date: "2026-06-16",
    calorieTarget: 2100,
    waterTarget: 2500,
    waterIntake: 2600,
    foodLogs: [
      { id: "p16", time: "08:00", foodName: "Bubur Kacang Hijau Santan", calories: 340, carbs: 48, protein: 8, fat: 8 },
      { id: "p17", time: "13:00", foodName: "Nasi Padang Ayam Pop + Daun Singkong", calories: 720, carbs: 85, protein: 28, fat: 26 },
      { id: "p18", time: "19:30", foodName: "Ikan Bakar Cianjur + Lalapan", calories: 390, carbs: 12, protein: 36, fat: 14 }
    ]
  },
  {
    date: "2026-06-17", // TODAY
    calorieTarget: 2100,
    waterTarget: 2500,
    waterIntake: 1000,
    foodLogs: [
      { id: "p19", time: "08:30", foodName: "Nasi Uduk Sambal Tempe", calories: 450, carbs: 65, protein: 10, fat: 12 },
      { id: "p20", time: "12:30", foodName: "Soto Madura Daging Sapi", calories: 510, carbs: 25, protein: 28, fat: 24 }
    ]
  }
];

export default function App() {
  const [history, setHistory] = useState<DailyRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState("2026-06-17");
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [showConfig, setShowConfig] = useState(false);

  // Profile tuning state
  const [weightInput, setWeightInput] = useState("");
  const [heightInput, setHeightInput] = useState("");
  const [calTargetInput, setCalTargetInput] = useState("");
  const [waterTargetInput, setWaterTargetInput] = useState("");
  const [nameInput, setNameInput] = useState("");

  // Load from LocalStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem("buku_kalori_history");
    const savedProfile = localStorage.getItem("buku_kalori_profile");

    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    } else {
      setHistory(PRESET_HISTORY);
      localStorage.setItem("buku_kalori_history", JSON.stringify(PRESET_HISTORY));
    }

    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setProfile(parsed);
      initProfileInput(parsed);
    } else {
      setProfile(DEFAULT_PROFILE);
      initProfileInput(DEFAULT_PROFILE);
      localStorage.setItem("buku_kalori_profile", JSON.stringify(DEFAULT_PROFILE));
    }
  }, []);

  const initProfileInput = (prof: UserProfile) => {
    setNameInput(prof.name);
    setWeightInput(String(prof.weight));
    setHeightInput(String(prof.height));
    setCalTargetInput(String(prof.dailyCalorieTarget));
    setWaterTargetInput(String(prof.dailyWaterTarget));
  };

  // Get active record for selected date
  const getActiveRecord = (): DailyRecord => {
    const record = history.find((r) => r.date === selectedDate);
    if (record) return record;

    // Create a fallback blank record if selected day does not exist in array (e.g. customized dates)
    return {
      date: selectedDate,
      foodLogs: [],
      waterIntake: 0,
      calorieTarget: profile.dailyCalorieTarget,
      waterTarget: profile.dailyWaterTarget,
    };
  };

  const activeRecord = getActiveRecord();

  // Save history to state & localStorage
  const saveHistory = (newHistory: DailyRecord[]) => {
    setHistory(newHistory);
    localStorage.setItem("buku_kalori_history", JSON.stringify(newHistory));
  };

  // Log new meal
  const handleAddFoodLog = (newLog: Omit<FoodLog, "id">) => {
    const fullLog: FoodLog = {
      ...newLog,
      id: "log_" + Date.now(),
    };

    const recordExists = history.some((r) => r.date === selectedDate);
    let updatedHistory: DailyRecord[];

    if (recordExists) {
      updatedHistory = history.map((r) => {
        if (r.date === selectedDate) {
          return {
            ...r,
            foodLogs: [...r.foodLogs, fullLog],
          };
        }
        return r;
      });
    } else {
      const newRecord: DailyRecord = {
        date: selectedDate,
        foodLogs: [fullLog],
        waterIntake: 0,
        calorieTarget: profile.dailyCalorieTarget,
        waterTarget: profile.dailyWaterTarget,
      };
      updatedHistory = [...history, newRecord];
    }

    saveHistory(updatedHistory);
  };

  // Delete logged meal
  const handleDeleteFoodLog = (id: string) => {
    const updatedHistory = history.map((r) => {
      if (r.date === selectedDate) {
        return {
          ...r,
          foodLogs: r.foodLogs.filter((log) => log.id !== id),
        };
      }
      return r;
    });
    saveHistory(updatedHistory);
  };

  // Update Hydration Intake
  const handleUpdateWater = (amount: number) => {
    const recordExists = history.some((r) => r.date === selectedDate);
    let updatedHistory: DailyRecord[];

    if (recordExists) {
      updatedHistory = history.map((r) => {
        if (r.date === selectedDate) {
          const updatedIntake = Math.max(0, r.waterIntake + amount);
          return {
            ...r,
            waterIntake: updatedIntake,
          };
        }
        return r;
      });
    } else {
      const newRecord: DailyRecord = {
        date: selectedDate,
        foodLogs: [],
        waterIntake: Math.max(0, amount),
        calorieTarget: profile.dailyCalorieTarget,
        waterTarget: profile.dailyWaterTarget,
      };
      updatedHistory = [...history, newRecord];
    }
    saveHistory(updatedHistory);
  };

  // AI Callback
  const handleFoodAnalyzed = (result: AIAnalysisResult, imageUrl: string) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    handleAddFoodLog({
      foodName: result.foodName,
      time: timeStr,
      calories: result.calories,
      carbs: result.carbs,
      protein: result.protein,
      fat: result.fat,
      ingredients: result.ingredients,
      imageUrl: imageUrl, // Polaroid snap representation
      isAiAnalyzed: true,
    });
  };

  // Save changes to profile targets
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedProfile: UserProfile = {
      name: nameInput || profile.name,
      weight: parseFloat(weightInput) || profile.weight,
      height: parseFloat(heightInput) || profile.height,
      dailyCalorieTarget: parseInt(calTargetInput) || profile.dailyCalorieTarget,
      dailyWaterTarget: parseInt(waterTargetInput) || profile.dailyWaterTarget,
    };

    setProfile(updatedProfile);
    localStorage.setItem("buku_kalori_profile", JSON.stringify(updatedProfile));

    // Project adjustments onto current day if it's new
    const updatedHistory = history.map((r) => {
      if (r.date === selectedDate) {
        return {
          ...r,
          calorieTarget: updatedProfile.dailyCalorieTarget,
          waterTarget: updatedProfile.dailyWaterTarget,
        };
      }
      return r;
    });

    saveHistory(updatedHistory);
    setShowConfig(false);
  };

  // Reset entire state to preset seeds for demonstrating UI fresh
  const handleResetData = () => {
    if (window.confirm("Apakah Anda yakin ingin menyetel ulang data kembali ke preset awal?")) {
      saveHistory(PRESET_HISTORY);
      setProfile(DEFAULT_PROFILE);
      initProfileInput(DEFAULT_PROFILE);
      localStorage.setItem("buku_kalori_profile", JSON.stringify(DEFAULT_PROFILE));
      setSelectedDate("2026-06-17");
    }
  };

  // Calculated totals for active day
  const calorieTarget = activeRecord.calorieTarget || profile.dailyCalorieTarget;
  const waterTarget = activeRecord.waterTarget || profile.dailyWaterTarget;

  const currentCalories = activeRecord.foodLogs.reduce((sum, item) => sum + item.calories, 0);
  const totalCarbs = activeRecord.foodLogs.reduce((sum, item) => sum + item.carbs, 0);
  const totalProtein = activeRecord.foodLogs.reduce((sum, item) => sum + item.protein, 0);
  const totalFat = activeRecord.foodLogs.reduce((sum, item) => sum + item.fat, 0);

  return (
    <div className="min-h-screen bg-[#5c0b0b] wood-texture pb-12 pt-6 px-3 sm:px-6 relative font-sans text-stone-900 selection:bg-red-100">
      {/* Absolute Header with brass signage */}
      <header className="max-w-6xl mx-auto mb-6 flex flex-col md:flex-row items-center justify-between gap-4 bg-[#8b1010] leather-texture p-3.5 px-6 rounded-2xl border-4 border-[#440303] shadow-[0_6px_14px_rgba(0,0,0,0.45)] relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-300 via-amber-400 to-amber-700 border-2 border-[#440303] flex items-center justify-center shadow-md">
            <BookOpen className="w-5 h-5 text-zinc-950" />
          </div>
          <div className="text-left">
            <h1 className="font-serif font-black text-white text-base tracking-wider uppercase leading-none">
              BUKU JURNAL GIZI
            </h1>
            <p className="font-mono text-[9px] text-red-200 uppercase tracking-widest mt-0.5 animate-pulse">
              SKEUOMORFIK KALORI & HIDRASI AI
            </p>
          </div>
        </div>

        {/* User profile brief badge & Configuration Triggers */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-white bg-red-600 border border-red-900 rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1.5px_0.5px_rgba(255,255,255,0.4)] hover:bg-red-500 active:translate-y-0.5 cursor-pointer transition-all uppercase font-bold"
          >
            <User className="w-4 h-4 text-yellow-200" />
            <span>Target: {profile.dailyCalorieTarget} kcal</span>
          </button>

          <button
            onClick={handleResetData}
            title="Saran Reset Data Simpanan"
            className="p-2 text-red-200 hover:text-white hover:bg-red-900 rounded-lg cursor-pointer transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Profile Settings Drawer Panel (Brass styled) */}
      {showConfig && (
        <div className="max-w-3xl mx-auto mb-6 bg-[#fcf5e3] border-4 border-red-900/60 p-5 rounded-xl shadow-2xl relative animate-fade-in text-stone-800 select-none">
          <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-red-600 border border-red-900 shadow-sm flex items-center justify-center pointer-events-none">
            <span className="text-[10px] text-white">⚙️</span>
          </div>

          <h3 className="font-serif font-black text-red-900 text-sm tracking-wider uppercase mb-3.5 border-b border-[#cca98a] pb-1.5">
            ⚙️ PARAMETER TUBUH & TARGET HARIAN
          </h3>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-600 mb-1">Nama Pengguna</label>
                <input
                  type="text"
                  required
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full bg-[#fcfaf2] border border-[#c6b497] rounded px-3 py-1.5 text-xs text-stone-800 font-serif"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-600 mb-1">Berat Badan (kg)</label>
                <input
                  type="number"
                  required
                  min="30"
                  max="200"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  className="w-full bg-[#fcfaf2] border border-[#c6b497] rounded px-3 py-1.5 text-xs text-stone-800 font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-600 mb-1">Tinggi Badan (cm)</label>
                <input
                  type="number"
                  required
                  min="100"
                  max="250"
                  value={heightInput}
                  onChange={(e) => setHeightInput(e.target.value)}
                  className="w-full bg-[#fcfaf2] border border-[#c6b497] rounded px-3 py-1.5 text-xs text-stone-800 font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-600 mb-1">Target Kalori (kcal)</label>
                <input
                  type="number"
                  required
                  min="1000"
                  max="5000"
                  value={calTargetInput}
                  onChange={(e) => setCalTargetInput(e.target.value)}
                  className="w-full bg-[#fcfaf2] border border-[#c6b497] rounded px-3 py-1.5 text-xs text-stone-800 font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-600 mb-1">Target Air (mL)</label>
                <input
                  type="number"
                  required
                  min="1000"
                  max="6000"
                  value={waterTargetInput}
                  onChange={(e) => setWaterTargetInput(e.target.value)}
                  className="w-full bg-[#fcfaf2] border border-[#c6b497] rounded px-3 py-1.5 text-xs text-stone-800 font-mono"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-red-700 text-white hover:bg-red-800 font-serif font-black text-xs uppercase rounded cursor-pointer flex items-center gap-1 shadow-sm"
              >
                <Check className="w-3.5 h-3.5" />
                Simpan Target Baru
              </button>
              <button
                type="button"
                onClick={() => setShowConfig(false)}
                className="px-3 py-2 bg-stone-300 hover:bg-stone-400 text-stone-700 font-serif font-bold text-xs uppercase rounded cursor-pointer"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Journal Book Skeleton */}
      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-1.5 lg:gap-0 bg-[#4e0303] leather-texture p-2.5 sm:p-4 rounded-3xl border-[6px] border-[#240101] shadow-[2px_12px_28px_rgba(0,0,0,0.65)] relative">
        
        {/* Real Central Mechanical Spiral Binder Rings (Hidden on single stack mobile layouts) */}
        <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 top-10 bottom-10 w-4 z-30 flex-col justify-around pointer-events-none">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className="w-12 h-5 bg-gradient-to-r from-stone-600 via-stone-400 to-stone-500 rounded-full shadow-[0_4px_4px_rgba(0,0,0,0.35)] -ml-4 border-r border-[#1a1a1a]"></div>
          ))}
        </div>

        {/* --- LEFT PAGE (Page 1): Calibration Dials & Mechanical Water Level Tank --- */}
        <section className="lg:col-span-6 bg-[#fffdf5] paper-texture lg:rounded-l-2xl rounded-2xl lg:rounded-r-none p-5 sm:p-7 shadow-lg border-b lg:border-r-3 lg:border-b-0 border-[#d9cea6] flex flex-col justify-between space-y-6 relative overflow-hidden">
          {/* Top aesthetic bookmark string/tag */}
          <div className="absolute top-0 left-8 w-4 h-16 bg-red-800 shadow-[2px_1px_3px_rgba(0,0,0,0.15)] rounded-b-md opacity-30 select-none pointer-events-none"></div>

          <div>
            {/* Header / Active date ink signature */}
            <div className="flex items-center justify-between border-b border-[#dfcca6] pb-2 mb-4">
              <span className="font-serif font-bold text-xs text-[#715c43]">
                Catatan Harian: <span className="font-mono text-xs text-stone-600 font-extrabold">{selectedDate}</span>
              </span>
              <div className="text-[9px] font-mono text-zinc-400 bg-[#dfd4b9]/50 border border-[#dfcca6]/85 px-1.5 py-0.5 rounded uppercase">
                Jurnal {profile.name.split(" ")[0]}
              </div>
            </div>

            {/* Speeder Calorie Gauge Panel */}
            <DailyStats
              currentCalories={currentCalories}
              targetCalories={calorieTarget}
              carbs={totalCarbs}
              protein={totalProtein}
              fat={totalFat}
            />
          </div>

          {/* Water Dispenser Visual Level */}
          <WaterMeter
            currentWater={activeRecord.waterIntake}
            targetWater={waterTarget}
            onUpdateWater={handleUpdateWater}
          />

          {/* Retro Water Meter status footnote */}
          <div className="border-t border-[#dfcca6] pt-3 flex items-center justify-between text-[9px] text-[#715c43] select-none">
            <div className="flex items-center gap-1 font-mono">
              <Droplet className="w-3 h-3 text-sky-500" />
              <span>Target Hidrasi: {waterTarget} mL</span>
            </div>
            <span>LOG PRESEDUR</span>
          </div>
        </section>

        {/* --- RIGHT PAGE (Page 2): Food Diaries, Weekly Agendas & AI Vision Snapshot --- */}
        <section className="lg:col-span-6 bg-[#fffdec] paper-texture lg:rounded-r-2xl rounded-2xl lg:rounded-l-none p-5 sm:p-7 shadow-lg flex flex-col justify-between space-y-6 relative overflow-hidden lg:pl-10">
          
          {/* Notebook ledger list (handwritten ledger book look) */}
          <FoodDiary
            logs={activeRecord.foodLogs}
            onAddLog={handleAddFoodLog}
            onDeleteLog={handleDeleteFoodLog}
          />

          {/* Weekly summary calendars */}
          <WeeklySummary
            history={history}
            onSelectDate={setSelectedDate}
            selectedDate={selectedDate}
          />

          {/* Camera / Image Vision snap entry panel */}
          <div className="border-t-2 border-dashed border-[#dfcca6] pt-5">
            <AIImagePicker
              onFoodAnalyzed={handleFoodAnalyzed}
            />
          </div>
        </section>
      </main>

      {/* Decorative Pencil lying on Wood Table */}
      <div className="max-w-6xl mx-auto mt-6 hidden sm:flex justify-end pr-10 pointer-events-none select-none">
        <div className="relative w-48 h-2.5 bg-gradient-to-b from-yellow-500 via-amber-400 to-amber-700/80 rounded-full rotate-[1.5deg] shadow-[2px_4px_6px_rgba(0,0,0,0.3)]">
          {/* Pencil eraser element */}
          <div className="absolute right-0 top-0 bottom-0 w-4 bg-rose-400 rounded-r-full border-l border-amber-800"></div>
          {/* Pencil silver band */}
          <div className="absolute right-4 top-0 bottom-0 w-2 bg-gradient-to-b from-zinc-300 via-zinc-400 to-zinc-500"></div>
          {/* Pencil tip element */}
          <div className="absolute left-0 top-0.5 bottom-0.5 w-4 bg-[#ead1b5] rounded-l-md transform -skew-x-12 flex items-center">
            <div className="w-1.5 h-1.5 bg-zinc-900 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
