export interface FoodLog {
  id: string;
  time: string; // e.g. "08:30"
  foodName: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  ingredients?: string[];
  imageUrl?: string; // base64 preview of polaroid
  isAiAnalyzed?: boolean;
}

export interface DailyRecord {
  date: string; // "YYYY-MM-DD"
  foodLogs: FoodLog[];
  waterIntake: number; // in ml
  waterTarget: number; // in ml
  calorieTarget: number; // in kcal
}

export interface AIAnalysisResult {
  foodName: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  ingredients: string[];
  confidence: number;
  explanation: string;
}

export interface UserProfile {
  name: string;
  weight: number; // kg
  height: number; // cm
  dailyCalorieTarget: number;
  dailyWaterTarget: number;
}
