import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase payload limits for base64 images
app.use(express.json({ limit: "15mb" }));

// Initialize Gemini client (server-side only)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Analyze food endpoint
app.post("/api/analyze-food", async (req, res) => {
  try {
    const { base64Data, mimeType } = req.body;
    if (!base64Data || !mimeType) {
      return res.status(400).json({ error: "Data gambar atau mimeType tidak ditemukan" });
    }

    // Call the Gemini API securely
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Data,
          },
        },
        {
          text: "Identifikasi makanan pada gambar ini. Estimasi jumlah kalori (kcal), karbohidrat (gram), protein (gram), dan lemak (gram) berdasarkan porsi standar sedang yang terlihat. Daftarkan juga bahan-bahan makanan utama dalam bahasa Indonesia.",
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            foodName: { type: Type.STRING, description: "Nama hidangan atau makanan dominan dalam bahasa Indonesia" },
            calories: { type: Type.INTEGER, description: "Estimasi energi total dalam kkal" },
            carbs: { type: Type.INTEGER, description: "Estimasi karbohidrat gram" },
            protein: { type: Type.INTEGER, description: "Estimasi protein gram" },
            fat: { type: Type.INTEGER, description: "Estimasi lemak gram" },
            ingredients: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Daftar bahan makanan utama yang berhasil diidentifikasi"
            },
            confidence: { type: Type.INTEGER, description: "Tingkat kepercayaan estimasi (0-100)" },
            explanation: { type: Type.STRING, description: "Penjelasan ringkas porsi dan kandungan gizi hidangan dalam bahasa Indonesia" }
          },
          required: ["foodName", "calories", "carbs", "protein", "fat", "ingredients", "confidence", "explanation"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Tidak ada respon teks dari kecerdasan buatan Gemini");
    }

    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error("Gemini analysis error:", error);
    res.status(500).json({ error: error.message || "Gagal menganalisis gambar makanan harian" });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server pencatat kalori berjalan di http://localhost:${PORT}`);
  });
}

startServer();
