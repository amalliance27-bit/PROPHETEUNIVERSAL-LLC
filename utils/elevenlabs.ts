// Client-side ElevenLabs Voice Integration Utility

export interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  category?: string;
  preview_url?: string;
  labels?: Record<string, string>;
}

export const ELEVENLABS_VOICES = {
  MALE_GREETING: "pNInz6obpgDQGcFmaJgB", // Adam (Male Premade)
  MALE_ANTONI: "ErXwobaYiN019PkySvjV",   // Antoni (Male Premade)
  FEMALE_PANDORA: "Xb7hH8MSUJpSbSDYk0k2", // Alice (Female Premade)
  FEMALE_BELLA: "EXAVITQu4vr4xnSDxMaL"    // Bella/Sarah (Female Premade)
};

const STORAGE_KEY_VOICE = "elevenlabs_selected_voice_id";
const STORAGE_KEY_API_KEY = "elevenlabs_custom_api_key";
const DEFAULT_VOICE_ID = ELEVENLABS_VOICES.FEMALE_PANDORA;

// Phonetic text normalization to ensure "Prophete" is pronounced as "profit" and "EST" as clearly spoken individual letters "E, S, T"
export function normalizeTTSPhonetics(text: string): string {
  if (!text) return text;
  return text
    .replace(/<break[^>]*\/>/gi, " ... ")
    .replace(/\bProphète\b/g, "Profit")
    .replace(/\bprophète\b/g, "profit")
    .replace(/\bProphete\b/g, "Profit")
    .replace(/\bprophete\b/g, "profit")
    .replace(/\bPROPHETE\b/g, "PROFIT")
    .replace(/\bE\.S\.T\.\b/gi, "E, S, T")
    .replace(/\bE\s+S\s+T\b/gi, "E, S, T")
    .replace(/\bEST\b/g, "E, S, T")
    .replace(/\bLLC\b/g, "L L C");
}

export const getStoredApiKey = (): string => {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(STORAGE_KEY_API_KEY) || "";
};

export const setStoredApiKey = (key: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY_API_KEY, key.trim());
    clearElevenLabsAudioCache();
  }
};

// In-memory audio cache for current session
const audioCache = new Map<string, Blob>();

// Persistent IndexedDB audio cache configuration
const DB_NAME = "elevenlabs_audio_cache_db";
const DB_VERSION = 1;
const STORE_NAME = "audio_blobs";

function openAudioDB(): Promise<IDBDatabase | null> {
  if (typeof window === "undefined" || !("indexedDB" in window)) {
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };
      request.onsuccess = (event) => {
        resolve((event.target as IDBOpenDBRequest).result);
      };
      request.onerror = (err) => {
        console.warn("IndexedDB open error:", err);
        resolve(null);
      };
    } catch (err) {
      console.warn("IndexedDB Exception:", err);
      resolve(null);
    }
  });
}

async function getAudioFromPersistentCache(key: string): Promise<Blob | null> {
  const db = await openAudioDB();
  if (!db) return null;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => {
        if (req.result && req.result instanceof Blob) {
          resolve(req.result);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

async function saveAudioToPersistentCache(key: string, blob: Blob): Promise<void> {
  const db = await openAudioDB();
  if (!db) return;

  try {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.put(blob, key);
  } catch (err) {
    console.warn("IndexedDB save error:", err);
  }
}

export const clearElevenLabsAudioCache = async (): Promise<void> => {
  audioCache.clear();
  const db = await openAudioDB();
  if (db) {
    try {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).clear();
    } catch {
      // ignore
    }
  }
};

// Track whether ElevenLabs quota was exceeded during this session
let isElevenLabsQuotaExceeded = false;

export async function getCachedOrFetchAudioBlob(text: string, voiceId: string): Promise<Blob | null> {
  // Phonetically normalize text so "Prophete" is spoken as "Profit"
  const processedText = normalizeTTSPhonetics(text.trim());
  const cacheKey = `${voiceId}_${processedText.toLowerCase()}`;

  // 1. Check in-memory session cache
  if (audioCache.has(cacheKey)) {
    console.log("🔊 [Memory Cache Hit] Playing stored ElevenLabs audio:", cacheKey);
    return audioCache.get(cacheKey)!;
  }

  // 2. Check persistent IndexedDB cache across browser restarts
  const persistentBlob = await getAudioFromPersistentCache(cacheKey);
  if (persistentBlob && persistentBlob.size > 0) {
    console.log("💾 [IndexedDB Cache Hit] Playing saved ElevenLabs audio (0 tokens used):", cacheKey);
    audioCache.set(cacheKey, persistentBlob);
    return persistentBlob;
  }

  // If quota is known to be exceeded for uncached text, fall back directly to SpeechSynthesis
  if (isElevenLabsQuotaExceeded) {
    return null;
  }

  // 3. Fetch from ElevenLabs backend API if not cached
  try {
    const reqHeaders: Record<string, string> = { "Content-Type": "application/json" };
    const customKey = getStoredApiKey();
    if (customKey) reqHeaders["x-elevenlabs-key"] = customKey;

    const res = await fetch("/api/elevenlabs/tts", {
      method: "POST",
      headers: reqHeaders,
      body: JSON.stringify({ text: processedText, voiceId })
    });

    if (!res.ok) return null;

    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const data = await res.json();
      if (!data.success) {
        if (data.quotaExceeded || data.invalidKey) {
          isElevenLabsQuotaExceeded = true;
        }
        console.warn("ElevenLabs TTS backend response:", data.message || data);
      }
      return null;
    }

    const blob = await res.blob();
    if (blob && blob.size > 0) {
      // Store in memory & persistent IndexedDB storage
      audioCache.set(cacheKey, blob);
      await saveAudioToPersistentCache(cacheKey, blob);
      console.log("✅ [Saved to Cache] Stored new ElevenLabs audio clip:", cacheKey);
      return blob;
    }
  } catch (err) {
    console.warn("ElevenLabs TTS fetch error:", err);
  }
  return null;
}

export const getSelectedVoiceId = (): string => {
  if (typeof window === "undefined") return DEFAULT_VOICE_ID;
  return localStorage.getItem(STORAGE_KEY_VOICE) || DEFAULT_VOICE_ID;
};

export const setSelectedVoiceId = (voiceId: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY_VOICE, voiceId);
    window.dispatchEvent(new CustomEvent("elevenlabs-voice-changed", { detail: voiceId }));
  }
};

export async function checkElevenLabsStatus(): Promise<{ configured: boolean; validKey?: boolean; message: string }> {
  try {
    const reqHeaders: Record<string, string> = {};
    const customKey = getStoredApiKey();
    if (customKey) reqHeaders["x-elevenlabs-key"] = customKey;

    const res = await fetch("/api/elevenlabs/status", { headers: reqHeaders });
    if (!res.ok) return { configured: false, validKey: false, message: "Status endpoint unavailable." };
    return await res.json();
  } catch {
    return { configured: false, validKey: false, message: "Could not connect to backend server." };
  }
}

export async function fetchElevenLabsVoices(): Promise<ElevenLabsVoice[]> {
  try {
    const reqHeaders: Record<string, string> = {};
    const customKey = getStoredApiKey();
    if (customKey) reqHeaders["x-elevenlabs-key"] = customKey;

    const res = await fetch("/api/elevenlabs/voices", { headers: reqHeaders });
    const data = await res.json();
    if (data.voices && Array.isArray(data.voices)) {
      return data.voices;
    }
  } catch (error) {
    console.warn("Failed to fetch ElevenLabs voices:", error);
  }
  return [
    { voice_id: ELEVENLABS_VOICES.FEMALE_PANDORA, name: "Rachel (Female - Pandora)", category: "premade" },
    { voice_id: ELEVENLABS_VOICES.MALE_GREETING, name: "Adam (Male - Greeting)", category: "premade" },
    { voice_id: ELEVENLABS_VOICES.MALE_ANTONI, name: "Antoni (Male)", category: "premade" },
    { voice_id: ELEVENLABS_VOICES.FEMALE_BELLA, name: "Bella (Female)", category: "premade" },
    { voice_id: "AZnzlk1XvdvUeBnXmlld", name: "Domi (Female)", category: "premade" },
    { voice_id: "MF3mGyEYCl7XYWbV9V6O", name: "Elli (Female)", category: "premade" },
    { voice_id: "TxGEqnHWrfWFTfGW9XjX", name: "Josh (Male)", category: "premade" },
    { voice_id: "VR6AewLTigWG4xTvo15k", name: "Arnold (Male)", category: "premade" }
  ];
}

let activeAudio: HTMLAudioElement | null = null;
let sharedUnlockedAudio: HTMLAudioElement | null = null;

export const getOrCreateSharedAudio = (): HTMLAudioElement | null => {
  if (typeof window === "undefined") return null;
  if (!sharedUnlockedAudio) {
    sharedUnlockedAudio = new Audio();
    sharedUnlockedAudio.setAttribute("playsinline", "true");
    sharedUnlockedAudio.setAttribute("webkit-playsinline", "true");
  }
  return sharedUnlockedAudio;
};

export const unlockElevenLabsAudioIOS = () => {
  try {
    const audio = getOrCreateSharedAudio();
    if (audio) {
      // Play brief silent audio chunk to unlock HTMLAudioElement on iOS Safari
      audio.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';
      audio.play().then(() => {
        audio.pause();
      }).catch(() => {});
    }
  } catch {
    // Ignore
  }
};

export const isElevenLabsSpeaking = (): boolean => {
  return activeAudio !== null;
};

export const isAnySpeechActive = (): boolean => {
  const browserSpeaking = typeof window !== "undefined" && "speechSynthesis" in window && window.speechSynthesis.speaking;
  return activeAudio !== null || Boolean(browserSpeaking);
};

export const stopElevenLabsSpeech = () => {
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.currentTime = 0;
    activeAudio = null;
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("speech-end"));
    }
  }
};

export async function speakWithElevenLabs(
  text: string,
  overrideVoiceId?: string
): Promise<{ success: boolean; duration?: number }> {
  stopElevenLabsSpeech();

  try {
    const voiceId = overrideVoiceId || getSelectedVoiceId();
    const blob = await getCachedOrFetchAudioBlob(text, voiceId);

    if (!blob) {
      return { success: false };
    }

    const audioUrl = URL.createObjectURL(blob);
    // Reuse shared unlocked audio element or fallback to new Audio
    const audio = getOrCreateSharedAudio() || new Audio();
    audio.src = audioUrl;
    activeAudio = audio;

    window.dispatchEvent(new CustomEvent("speech-start"));

    return new Promise((resolve) => {
      audio.onended = () => {
        activeAudio = null;
        URL.revokeObjectURL(audioUrl);
        window.dispatchEvent(new CustomEvent("speech-end"));
        resolve({ success: true, duration: audio.duration });
      };

      audio.onerror = () => {
        activeAudio = null;
        URL.revokeObjectURL(audioUrl);
        window.dispatchEvent(new CustomEvent("speech-end"));
        resolve({ success: false });
      };

      audio.play().then(() => {
        // Success
      }).catch((err) => {
        console.warn("Audio play blocked by browser policy:", err);
        activeAudio = null;
        window.dispatchEvent(new CustomEvent("speech-end"));
        resolve({ success: false });
      });
    });
  } catch (err) {
    console.error("ElevenLabs speak error:", err);
    window.dispatchEvent(new CustomEvent("speech-end"));
    return { success: false };
  }
}
