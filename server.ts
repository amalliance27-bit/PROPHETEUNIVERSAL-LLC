import express from "express";
import path from "path";
import http from "http";
import https from "https";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";
import cors from "cors";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json({ limit: "25mb" }));
  app.use(express.urlencoded({ limit: "25mb", extended: true }));

  // API route to proxy radio audio streams safely (bypassing CORS and audio blocks)
  app.get("/api/radio-stream", (req, res) => {
    const streamUrl = req.query.url as string;
    if (!streamUrl) {
      return res.status(400).send("Missing url parameter");
    }

    try {
      const parsed = new URL(streamUrl);
      const isHttps = parsed.protocol === "https:";
      const client = isHttps ? https : http;

      const request = client.get(
        streamUrl,
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "*/*",
            "Icy-MetaData": "1"
          }
        },
        (response: any) => {
          if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
            const redirectUrl = response.headers.location.startsWith("http")
              ? response.headers.location
              : `${parsed.protocol}//${parsed.host}${response.headers.location}`;
            return res.redirect(`/api/radio-stream?url=${encodeURIComponent(redirectUrl)}`);
          }

          res.setHeader("Content-Type", response.headers["content-type"] || "audio/mpeg");
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.setHeader("Cache-Control", "no-cache, no-store");

          response.pipe(res);

          req.on("close", () => {
            response.destroy();
          });
        }
      );

      request.on("error", (err: any) => {
        console.error("Radio proxy error:", err.message);
        if (!res.headersSent) {
          res.status(502).send("Radio stream unavailable");
        }
      });
    } catch (e: any) {
      if (!res.headersSent) {
        res.status(400).send("Invalid stream URL");
      }
    }
  });

  // API route for ElevenLabs Status
  app.get("/api/elevenlabs/status", async (req, res) => {
    const apiKey = (req.headers["x-elevenlabs-key"] as string) || process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return res.json({
        configured: false,
        validKey: false,
        message: "ELEVENLABS_API_KEY is not set in environment variables or UI modal."
      });
    }

    try {
      // Quick lightweight check to verify if the key is valid
      const response = await fetch("https://api.elevenlabs.io/v1/user/subscription", {
        headers: { "xi-api-key": apiKey }
      });

      if (response.status === 401 || response.status === 403) {
        return res.json({
          configured: true,
          validKey: false,
          message: "ELEVENLABS_API_KEY is invalid or expired."
        });
      }

      if (response.ok) {
        const subData = await response.json();
        return res.json({
          configured: true,
          validKey: true,
          tier: subData.tier || "active",
          characterCount: subData.character_count,
          characterLimit: subData.character_limit,
          message: `ElevenLabs API key is VALID and active! Tier: ${subData.tier || 'active'}, Characters used: ${subData.character_count}/${subData.character_limit}.`
        });
      }

      return res.json({
        configured: true,
        validKey: false,
        message: `ElevenLabs returned HTTP ${response.status}`
      });
    } catch (err: any) {
      return res.json({
        configured: Boolean(apiKey),
        validKey: false,
        message: err.message || "Failed to reach ElevenLabs API"
      });
    }
  });

  // API route to fetch ElevenLabs voices
  app.get("/api/elevenlabs/voices", async (req, res) => {
    const defaultVoices = [
      { voice_id: "TYKLc7ViOIGE13dSZYlK", name: "Rachel (Female - Pandora)", category: "premade" },
      { voice_id: "IRHApOXLvnW57QJPQH2P", name: "Adam (Male - Greeting)", category: "premade" },
      { voice_id: "ErXwobaYiN019PkySvjV", name: "Antoni (Male)", category: "premade" },
      { voice_id: "EXAVITQu4vr4xnSDxMaL", name: "Bella (Female)", category: "premade" },
      { voice_id: "AZnzlk1XvdvUeBnXmlld", name: "Domi (Female)", category: "premade" },
      { voice_id: "MF3mGyEYCl7XYWbV9V6O", name: "Elli (Female)", category: "premade" },
      { voice_id: "TxGEqnHWrfWFTfGW9XjX", name: "Josh (Male)", category: "premade" },
      { voice_id: "VR6AewLTigWG4xTvo15k", name: "Arnold (Male)", category: "premade" }
    ];

    try {
      const apiKey = (req.headers["x-elevenlabs-key"] as string) || process.env.ELEVENLABS_API_KEY;
      if (!apiKey) {
        return res.json({
          success: false,
          configured: false,
          message: "ELEVENLABS_API_KEY is missing.",
          voices: defaultVoices
        });
      }

      const response = await fetch("https://api.elevenlabs.io/v1/voices", {
        headers: {
          "xi-api-key": apiKey
        }
      });

      if (!response.ok) {
        return res.json({
          success: false,
          configured: false,
          invalidKey: response.status === 401 || response.status === 403,
          message: "ElevenLabs API key invalid or unauthorized. Using default voice list.",
          voices: defaultVoices
        });
      }

      const data = await response.json();
      res.json({ success: true, configured: true, voices: data.voices });
    } catch (error: any) {
      res.json({
        success: false,
        message: error.message || "Failed to fetch voices from ElevenLabs",
        voices: defaultVoices
      });
    }
  });

  // Helper for status check fallback
  function borderCheck(key?: string): boolean {
    return !!key && key.length > 5;
  }

  // API route to generate text-to-speech audio via ElevenLabs
  app.post("/api/elevenlabs/tts", async (req, res) => {
    try {
      const apiKey = (req.headers["x-elevenlabs-key"] as string) || process.env.ELEVENLABS_API_KEY;
      if (!apiKey) {
        return res.status(200).json({
          success: false,
          configured: false,
          message: "ELEVENLABS_API_KEY is not set."
        });
      }

      const { text, voiceId, modelId, stability, similarity_boost } = req.body;
      if (!text || typeof text !== "string") {
        return res.status(400).json({ success: false, message: "Text parameter is required." });
      }

      const targetVoiceId = voiceId || "TYKLc7ViOIGE13dSZYlK"; // Default Rachel
      const targetModelId = modelId || "eleven_turbo_v2_5";

      let response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${targetVoiceId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
          "Accept": "audio/mpeg"
        },
        body: JSON.stringify({
          text,
          model_id: targetModelId,
          voice_settings: {
            stability: typeof stability === "number" ? stability : 0.5,
            similarity_boost: typeof similarity_boost === "number" ? similarity_boost : 0.75
          }
        })
      });

      // If turbo model fails with 400, fallback to multilingual_v2
      if (!response.ok && response.status === 400) {
        console.warn(`ElevenLabs model ${targetModelId} returned 400, trying eleven_multilingual_v2...`);
        response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${targetVoiceId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "xi-api-key": apiKey,
            "Accept": "audio/mpeg"
          },
          body: JSON.stringify({
            text,
            model_id: "eleven_multilingual_v2",
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75
            }
          })
        });
      }

      // If voice requires paid plan (402) or not found (404), fallback to premade voice (Adam / Alice)
      if (!response.ok && (response.status === 402 || response.status === 404)) {
        const fallbackVoice = (targetVoiceId === "IRHApOXLvnW57QJPQH2P" || targetVoiceId === "pNInz6obpgDQGcFmaJgB") 
          ? "pNInz6obpgDQGcFmaJgB" 
          : "Xb7hH8MSUJpSbSDYk0k2";
        console.warn(`ElevenLabs voice ${targetVoiceId} restricted on tier (${response.status}), falling back to premade ${fallbackVoice}...`);
        
        response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${fallbackVoice}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "xi-api-key": apiKey,
            "Accept": "audio/mpeg"
          },
          body: JSON.stringify({
            text,
            model_id: "eleven_turbo_v2_5",
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75
            }
          })
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        const isQuota = errorText.includes("quota_exceeded") || errorText.includes("quota");
        const isAuthError = response.status === 401 || response.status === 403;
        
        console.warn(`ElevenLabs API status ${response.status} (${isQuota ? 'Quota Exceeded' : 'Key Invalid'}). Web Speech API fallback activated.`);
        
        return res.status(200).json({
          success: false,
          invalidKey: isAuthError && !isQuota,
          quotaExceeded: isQuota,
          message: isQuota
            ? "ElevenLabs API quota reached. System activated native browser Speech Synthesis fallback."
            : isAuthError
            ? "Invalid ElevenLabs API key. System activated native browser Speech Synthesis fallback."
            : `ElevenLabs TTS request failed with status ${response.status}: ${errorText}`
        });
      }

      const audioBuffer = await response.arrayBuffer();
      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader("Cache-Control", "no-cache");
      res.send(Buffer.from(audioBuffer));
    } catch (error: any) {
      res.status(200).json({ success: false, message: error.message || "Failed to generate audio" });
    }
  });

  // API route for form submissions
  app.post("/api/submit-form", async (req, res) => {
    try {
      const { formType, formData, files } = req.body;
      
      let subject = `New Submission: ${formType}`;
      let text = `You have received a new ${formType} submission.\n\nDetails:\n`;
      
      for (const [key, value] of Object.entries(formData || {})) {
        text += `${key}: ${value}\n`;
      }

      if (Array.isArray(files) && files.length > 0) {
        text += `\n--- ATTACHED DOCUMENTS (${files.length}) ---\n`;
        files.forEach((f: { name: string, category: string, size: string }, idx: number) => {
          text += `${idx + 1}. [${f.category || 'Document'}] ${f.name} (${f.size || 'N/A'})\n`;
        });
      }

      const emailUser = process.env.EMAIL_USER || "PropheteUniversal@gmail.com";
      const emailPass = process.env.EMAIL_PASS;

      if (emailPass) {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: emailUser,
            pass: emailPass,
          },
        });

        await transporter.sendMail({
          from: emailUser,
          to: "PropheteUniversal@gmail.com", // Destination email
          subject,
          text,
        });
        console.log(`Email sent successfully for ${formType}`);
      } else {
        console.warn("EMAIL_PASS is not set in environment variables. Form data recorded:", { subject, text });
      }

      res.status(200).json({ success: true, message: "Form submitted successfully" });
    } catch (error) {
      console.error("Error submitting form:", error);
      res.status(500).json({ success: false, message: "Failed to submit form" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
