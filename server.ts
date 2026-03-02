import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { Groq } from "groq-sdk";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Clients
const getSupabase = () => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.warn("Supabase credentials missing. Database features will not work.");
    return null;
  }
  return createClient(url, key);
};

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "missing_key" });
const resend = new Resend(process.env.RESEND_API_KEY || "re_missing");
const supabase = getSupabase();

// --- API Routes ---

// 1. AI Chat Route (Groq)
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are the LuminaLead AI Sales Consultant. Your purpose is to help businesses automate their lead qualification. 
          
          Your goal is to gather exactly four pieces of information from the user:
          1. Full Name
          2. Professional Email Address
          3. The specific business problem or service they need help with
          4. Their estimated budget and timeline
          
          GUIDELINES:
          - Be professional, welcoming, and concise.
          - Do not ask for everything at once; have a natural conversation.
          - Once (and ONLY once) you have gathered ALL FOUR pieces of information, you must explicitly say: "THANK YOU! I have gathered all your details and saved your inquiry. A confirmation email has been sent to you, and our team will reach out shortly."
          - This specific phrase triggers the system to save the lead and send the email.`,
        },
        ...messages,
      ],
      model: "llama-3.3-70b-versatile",
    });

    res.json({ message: completion.choices[0].message.content });
  } catch (error: any) {
    console.error("Groq Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 1.1. Structured Extraction Route (Groq)
app.post("/api/extract-lead", async (req, res) => {
  try {
    const { messages } = req.body;
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a data extraction expert. Analyze the provided conversation and extract lead details into a JSON object. Fields: name, email, problem, budget, timeline. If a field is missing, use 'Not provided'. Return ONLY valid JSON.",
        },
        {
          role: "user",
          content: `Extract lead info from this chat history: ${JSON.stringify(messages)}`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });

    const extracted = JSON.parse(completion.choices[0].message.content || "{}");
    res.json(extracted);
  } catch (error: any) {
    console.error("Extraction Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 2. Save Lead Route (Supabase)
app.post("/api/leads", async (req, res) => {
  try {
    if (!supabase) {
      throw new Error("Supabase is not configured. Please check your environment variables.");
    }
    const { name, email, problem, budget, timeline } = req.body;
    const { data, error } = await supabase
      .from("leads")
      .insert([{ name, email, problem, budget, timeline, status: "New" }])
      .select();

    if (error) {
      console.error("Supabase Insert Error Details:", JSON.stringify(error, null, 2));
      throw error;
    }
    res.json({ success: true, data });
  } catch (error: any) {
    console.error("Supabase Error:", error);
    res.status(500).json({ 
      error: error.message || "An unknown error occurred with Supabase",
      details: error
    });
  }
});

// 3. Send Email Route (Resend)
app.post("/api/send-email", async (req, res) => {
  try {
    const { name, email, problem, budget, timeline } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const { data, error } = await resend.emails.send({
      from: "LuminaLead <onboarding@resend.dev>",
      to: [email],
      subject: "🚀 Your LuminaLead Strategy Session is Confirmed!",
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
          <div style="background-color: #2563eb; padding: 40px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: -0.02em;">LuminaLead</h1>
          </div>
          <div style="padding: 40px 30px; background-color: #ffffff;">
            <h2 style="color: #1e293b; margin-top: 0;">Hi ${name},</h2>
            <p style="color: #475569; line-height: 1.6; font-size: 16px;">
              Thank you for reaching out to LuminaLead. Our AI Consultant has successfully captured your inquiry and our senior strategy team is already reviewing your details.
            </p>
            
            <div style="margin: 30px 0; padding: 20px; background-color: #f8fafc; border-radius: 8px; border-left: 4px solid #2563eb;">
              <h3 style="margin-top: 0; font-size: 14px; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em;">Inquiry Summary</h3>
              <p style="margin: 10px 0; color: #1e293b;"><strong>Service Needed:</strong> ${problem}</p>
              <p style="margin: 10px 0; color: #1e293b;"><strong>Budget/Timeline:</strong> ${budget || 'To be discussed'} / ${timeline || 'ASAP'}</p>
            </div>

            <p style="color: #475569; line-height: 1.6; font-size: 16px;">
              One of our experts will contact you within the next 24 hours to discuss how we can automate your lead generation and save you hours of manual work.
            </p>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #f1f5f9; text-align: center;">
              <p style="color: #94a3b8; font-size: 12px;">
                © 2024 LuminaLead AI. All rights reserved.<br/>
                123 Innovation Drive, Tech City
              </p>
            </div>
          </div>
        </div>
      `,
    });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error: any) {
    console.error("Resend Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 4. Get Leads (for Admin Dashboard)
app.get("/api/leads", async (req, res) => {
  try {
    if (!supabase) {
      return res.json([]); // Return empty array if not configured
    }
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase Fetch Error Details:", JSON.stringify(error, null, 2));
      throw error;
    }
    res.json(data || []);
  } catch (error: any) {
    console.error("Supabase Fetch Error:", error);
    res.status(500).json({ error: error.message || "Failed to fetch leads" });
  }
});

// --- Vite Middleware ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

export default app;
