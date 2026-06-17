import React, { useState, useRef } from "react";
import { Camera, Sparkles, Upload, FileImage, Loader2, AlertCircle, Check, Ban } from "lucide-react";
import { AIAnalysisResult } from "../types";

interface AIImagePickerProps {
  onFoodAnalyzed: (result: AIAnalysisResult, imageUrl: string) => void;
}

export const AIImagePicker: React.FC<AIImagePickerProps> = ({ onFoodAnalyzed }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Read file as base64
  const processFile = (file: File) => {
    if (!file) return;

    // Check size limit (max 12MB for Gemini API requests)
    if (file.size > 12 * 1024 * 1024) {
      setErrorMsg("Ukuran file terlalu besar. Batas maksimal adalah 12MB.");
      return;
    }

    setErrorMsg(null);
    setAnalysisResult(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageSrc(reader.result as string);
    };
    reader.onerror = () => {
      setErrorMsg("Gagal membaca file tersebut.");
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const startAnalysis = async () => {
    if (!imageSrc) return;

    setIsAnalyzing(true);
    setErrorMsg(null);

    try {
      // Split base64 to extract the raw contents and correct mimeType
      const match = imageSrc.match(/^data:([^;]+);base64,(.*)$/);
      if (!match) {
        throw new Error("Format foto tidak didukung.");
      }

      const mimeType = match[1];
      const base64Data = match[2];

      const response = await fetch("/api/analyze-food", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ base64Data, mimeType }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal menghubungi modul kecerdasan buatan.");
      }

      const result: AIAnalysisResult = await response.json();
      setAnalysisResult(result);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Terjadi kesalahan saat memproses data gambar.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const rejectAnalysis = () => {
    setAnalysisResult(null);
    setImageSrc(null);
  };

  const confirmAndSave = () => {
    if (analysisResult && imageSrc) {
      onFoodAnalyzed(analysisResult, imageSrc);
      // reset component state
      setAnalysisResult(null);
      setImageSrc(null);
    }
  };

  return (
    <div id="ai-polaroid-analyzer" className="bg-[#1e130c] text-[#eae2cf] p-5 rounded-2xl border-4 border-[#331c10] shadow-[0_12px_24px_rgba(0,0,0,0.5),inset_0_4px_10px_rgba(255,255,255,0.05)] relative overflow-hidden">
      {/* Visual camera lens overlay pattern for realistic skeuomorphism */}
      <div className="absolute top-2 right-4 text-[9px] font-mono text-[#bfb296]/30 tracking-widest uppercase">
        KAMERA OPTIK AI v3.5
      </div>

      <div className="text-center font-serif text-[#caa98a] font-bold text-xs tracking-wider uppercase mb-4 flex items-center justify-center gap-1.5">
        <Camera className="w-4 h-4 text-emerald-400" />
        Sistem Deteksi Hidangan AI
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Main Frame Container */}
      {!imageSrc ? (
        // Dropzone & manual picker state
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[#573d27] bg-[#120a06]/80 rounded-xl p-8 text-center hover:border-emerald-600 transition-all cursor-pointer group shadow-[inset_0_4px_8px_rgba(0,0,0,0.4)] flex flex-col items-center justify-center"
        >
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#e8ac58]/20 to-[#a36b1d]/20 flex items-center justify-center border border-[#78512b] group-hover:scale-105 transition-transform duration-300">
            <Camera className="w-6 h-6 text-[#eba134]" />
          </div>
          <p className="mt-3 text-xs font-serif font-bold text-[#e1ccaf]">
            Seret & Lepas Foto Makanan Anda di Sini
          </p>
          <p className="text-[10px] text-zinc-500 mt-1">
            Atau klik untuk memilih file gambar dari camera roll
          </p>
          <div className="mt-4 flex items-center gap-1.5 px-3 py-1.5 bg-[#402717] rounded-md text-[10px] font-mono text-[#eed9c4] border border-[#6b4226] shadow-sm">
            <Upload className="w-3.5 h-3.5" />
            <span>PILIH FILE FOTO</span>
          </div>
        </div>
      ) : (
        // Polaroid Frame preview with tactile analysis
        <div className="flex flex-col items-center">
          <div className="bg-white p-3.5 rounded-sm shadow-[0_10px_20px_rgba(0,0,0,0.4)] border border-[#e2dfd5] text-slate-800 w-full max-w-xs rotate-[1deg] transition-transform duration-300">
            {/* Polaroid photo display area */}
            <div className="bg-[#121212] aspect-square w-full relative overflow-hidden rounded-[1px] border border-black flex items-center justify-center shadow-inner">
              <img
                src={imageSrc}
                alt="Upload preview"
                className="w-full h-full object-cover"
              />
              
              {/* Developing Overlay when analyzing */}
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white p-4">
                  <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mb-2" />
                  <p className="font-typewriter text-xs text-center tracking-widest leading-relaxed text-emerald-300">
                    MENCETAK & MENGANALISIS...
                  </p>
                  <p className="text-[8px] mt-1 font-mono text-stone-400 uppercase">
                    Memindai Kalori Melalui Gemini AI
                  </p>
                </div>
              )}
            </div>

            {/* Note space underneath polaroid photo */}
            <div className="mt-4 pb-2 text-center select-none">
              {!analysisResult ? (
                <span className="font-handwritten text-[#3f301d] text-base leading-none">
                  "Menunggu diproses..."
                </span>
              ) : (
                <span className="font-handwritten font-bold text-red-600 text-xl leading-none">
                  {analysisResult.foodName}!
                </span>
              )}
              <div className="text-[8px] font-mono text-zinc-400 mt-0.5 uppercase tracking-wide">
                TERALIRKAN: 2026/06/17
              </div>
            </div>
          </div>

          {/* Action buttons under the polaroid photo container */}
          <div className="mt-5 w-full space-y-3.5">
            {!analysisResult && !isAnalyzing && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={startAnalysis}
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-600 text-white font-serif font-black text-xs uppercase rounded-lg shadow-md active:translate-y-0.5 cursor-pointer border border-[#306c46]"
                >
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  Analisis Dengan AI
                </button>
                <button
                  type="button"
                  onClick={() => setImageSrc(null)}
                  className="px-3 py-2.5 bg-stone-800 text-stone-400 font-serif font-bold text-xs uppercase rounded-lg shadow-md active:translate-y-0.5 hover:bg-stone-700 cursor-pointer"
                >
                  Batal
                </button>
              </div>
            )}

            {/* If analyzed successfully, display full interactive nutrition details in retro panel before accepting */}
            {analysisResult && (
              <div className="bg-[#241a12] border border-[#523d2e] rounded-lg p-3.5 space-y-3 animate-fade-in text-xs select-none">
                <div className="flex justify-between items-center border-b border-[#4d3a2d] pb-1.5">
                  <span className="text-[#caa98a] font-serif font-bold uppercase tracking-wider text-[10px]">
                    Hasil Estimasi Gizi AI
                  </span>
                  <span className="font-mono text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.5 rounded">
                    Kepercayaan: {analysisResult.confidence}%
                  </span>
                </div>

                {/* Macro summary grid */}
                <div className="grid grid-cols-4 gap-1.5 text-center">
                  <div className="bg-[#120c08] p-1.5 rounded">
                    <span className="block text-[8px] text-orange-400 font-mono">KALORI:</span>
                    <span className="font-mono font-bold text-[#ecd1b5]">
                      {analysisResult.calories} <span className="text-[7px]">kcal</span>
                    </span>
                  </div>
                  <div className="bg-[#120c08] p-1.5 rounded">
                    <span className="block text-[8px] text-amber-500 font-mono">KARBOHIDRAT:</span>
                    <span className="font-mono font-bold text-[#ecd1b5]">{analysisResult.carbs}g</span>
                  </div>
                  <div className="bg-[#120c08] p-1.5 rounded">
                    <span className="block text-[8px] text-teal-400 font-mono">PROTEIN:</span>
                    <span className="font-mono font-bold text-[#ecd1b5]">{analysisResult.protein}g</span>
                  </div>
                  <div className="bg-[#120c08] p-1.5 rounded">
                    <span className="block text-[8px] text-red-400 font-mono">LEMAK:</span>
                    <span className="font-mono font-bold text-[#ecd1b5]">{analysisResult.fat}g</span>
                  </div>
                </div>

                {/* Ingredients list */}
                <div>
                  <span className="block text-[8px] text-stone-400 font-mono uppercase">Bahan-Bahan Terdeteksi:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {analysisResult.ingredients.map((ing, i) => (
                      <span key={i} className="text-[9px] bg-[#3a281c] border border-[#583f2e] text-[#ffeada] px-1.5 py-0.5 rounded font-sans">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Chef Explanation */}
                <p className="text-[10px] text-[#dacbb0] leading-relaxed italic bg-[#170f0a] border border-[#3e2b1d] p-2 rounded">
                  " {analysisResult.explanation} "
                </p>

                {/* Final approvals */}
                <div className="flex gap-2 pt-1 border-t border-[#4d3a2d]">
                  <button
                    type="button"
                    onClick={confirmAndSave}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-serif font-black text-xs uppercase rounded shadow active:translate-y-0.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    Simpan Ke Buku
                  </button>
                  <button
                    type="button"
                    onClick={rejectAnalysis}
                    className="px-3 py-2 bg-[#422e23] text-stone-400 font-serif font-bold text-xs uppercase rounded hover:bg-[#523d32] cursor-pointer"
                  >
                    Ulangi
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error handling widget if anything goes wrong during API communication */}
      {errorMsg && (
        <div className="mt-4 bg-red-950/65 border border-red-800 p-2.5 rounded-lg flex items-start gap-1.5 text-xs text-red-200">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <div className="leading-tight">
            <span className="font-bold">Analisis Gagal:</span> {errorMsg}
          </div>
        </div>
      )}
    </div>
  );
};
