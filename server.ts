import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API route for health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Quality Assistant route using Gemini API
app.post("/api/ai-audit", async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "مفتاح GEMINI_API_KEY غير متوفر" });
    }

    const { prompt, context } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "الرجاء تقديم النص المطلوب" });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `
أنت مهندس استشاري متخصص في إدارة جودة التصنيع (QC/QA) وأنظمة إدارة البيانات واستدامة الجودة لمصانع البلاستيك (الأنابيب Pipe والوصلات Fittings مثل PPR و UPVC).
مهامك هي:
1. تحليل أخطاء شيتات الجودة والبيانات الأساسية (Master Data) وتقديم نصائح باللغة العربية الواضحة.
2. اقتراح خطط عمل تصحيحية ووقائية (CAPA) ودراسة الأسباب الجذرية (Root Cause Analysis - Fishbone / 5 Whys).
3. إعطاء معادلات Google Sheets / Excel دقيقة (مثل XLOOKUP, VLOOKUP, UNIQUE, COUNTIFS, DATA VALIDATION).
4. الرد بأسلوب مهني، مشجع، ومنظم بالنقاط التوضيحية.
`;

    const fullPrompt = `
البيانات المتاحة من شيت الجودة:
${JSON.stringify(context || {}, null, 2)}

سؤال المستخدم:
${prompt}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: systemInstruction + "\n" + fullPrompt }] }
      ],
    });

    return res.json({ result: response.text });
  } catch (err: any) {
    console.error("Error calling Gemini API:", err);
    return res.status(500).json({ error: "حدث خطأ أثناء التواصل مع الذكاء الاصطناعي: " + (err.message || err) });
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
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`QC Factory Server running on http://localhost:${PORT}`);
  });
}

startServer();
